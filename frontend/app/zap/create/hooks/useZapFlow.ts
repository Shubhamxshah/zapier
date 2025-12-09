import { useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';

export const useZapFlow = (
  handleNodeClick: (nodeId: string, type: 'trigger' | 'action') => void,
  handleDeleteNode: (nodeId: string) => void,
  mounted: boolean
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const handleAddAction = useCallback(
    (afterNodeId: string) => {
      const newNodeId = `node-${Date.now()}`;

      setNodes((currentNodes) => {
        const afterNode = currentNodes.find((n) => n.id === afterNodeId);
        if (!afterNode) return currentNodes;

        const newX = afterNode.position.x + 300;
        const nodesFromSameParent = currentNodes.filter((n) => Math.abs(n.position.x - newX) < 50);

        let newY = afterNode.position.y;
        if (nodesFromSameParent.length > 0) {
          const offset = Math.ceil(nodesFromSameParent.length / 2) * 100;
          newY =
            nodesFromSameParent.length % 2 === 0
              ? afterNode.position.y + offset
              : afterNode.position.y - offset;
        }

        const newNode: Node = {
          id: newNodeId,
          type: 'custom',
          data: {
            label: 'Action',
            type: 'action',
            onConfigure: () => handleNodeClick(newNodeId, 'action'),
            onAddAction: () => handleAddAction(newNodeId),
            onDelete: () => handleDeleteNode(newNodeId),
          },
          position: { x: newX, y: newY },
        };

        return [...currentNodes, newNode];
      });

      setEdges((currentEdges) => [
        ...currentEdges,
        {
          id: `e${afterNodeId}-${newNodeId}`,
          source: afterNodeId,
          target: newNodeId,
          animated: true,
        },
      ]);
    },
    [handleNodeClick, handleDeleteNode, setNodes, setEdges]
  );

  useEffect(() => {
    if (!mounted) return;

    const initialNodes: Node[] = [
      {
        id: '1',
        type: 'custom',
        data: {
          label: 'Trigger',
          type: 'trigger',
          onConfigure: () => handleNodeClick('1', 'trigger'),
          onAddAction: () => handleAddAction('1'),
        },
        position: { x: 100, y: 100 },
      },
      {
        id: '2',
        type: 'custom',
        data: {
          label: 'Action',
          type: 'action',
          onConfigure: () => handleNodeClick('2', 'action'),
          onAddAction: () => handleAddAction('2'),
          onDelete: () => handleDeleteNode('2'),
        },
        position: { x: 400, y: 100 },
      },
    ];

    const initialEdges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return {
    nodes,
    edges,
    setNodes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleAddAction,
  };
};
