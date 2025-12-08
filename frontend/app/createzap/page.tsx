'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import axios from 'axios';
import Navbar from '@/components/navbar';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface Action {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface Trigger {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface CustomNodeData {
  label: string;
  type: 'trigger' | 'action';
  selected?: boolean;
  itemId?: string;
  onConfigure: () => void;
  onAddAction?: () => void;
  onDelete?: () => void;
}

const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div
      className="px-6 py-4 shadow-lg rounded-lg border-2 border-gray-300 bg-white cursor-pointer hover:shadow-xl transition-shadow relative"
      onClick={data.onConfigure}
    >
      <Handle type="target" position={Position.Left} />
      {data.type === 'action' && data.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      )}
      <div className="flex flex-col gap-2">
        <div className="font-bold text-lg">{data.label}</div>
        <div className="text-sm text-gray-500">{data.type === 'trigger' ? 'Trigger' : 'Action'}</div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onAddAction?.();
        }}
        className="mt-2 w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} />
        Add Action
      </button>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const CreateZap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'trigger' | 'action'>('trigger');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await axios.get<Action[]>(`${BACKEND_URL}/api/v1/actions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActions(response.data);
    } catch (error: unknown) {
      console.error('Failed to fetch actions:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          console.error('Unauthorized: Please check your token');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTriggers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await axios.get<Trigger[]>(`${BACKEND_URL}/api/v1/triggers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTriggers(response.data);
    } catch (error: unknown) {
      console.error('Failed to fetch triggers:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          console.error('Unauthorized: Please check your token');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback((nodeId: string, type: 'trigger' | 'action') => {
    setCurrentNodeId(nodeId);
    setDialogType(type);
    setIsDialogOpen(true);

    if (type === 'trigger') {
      fetchTriggers();
    } else {
      fetchActions();
    }
  }, [fetchActions, fetchTriggers]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((currentNodes: Node[]) => currentNodes.filter((node: Node) => node.id !== nodeId));
    setEdges((currentEdges: Edge[]) =>
      currentEdges.filter((edge: Edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  }, [setNodes, setEdges]);

  const handleAddAction = useCallback((afterNodeId: string) => {
    const newNodeId = `node-${Date.now()}`;

    setNodes((currentNodes) => {
      const afterNode = currentNodes.find((n) => n.id === afterNodeId);
      if (!afterNode) return currentNodes;

      // Calculate position to the right of the current node
      const newX = afterNode.position.x + 300;

      // Check if there are already nodes at this X position from this parent
      const nodesFromSameParent = currentNodes.filter(
        (n) => Math.abs(n.position.x - newX) < 50
      );

      // Calculate vertical offset to avoid overlap
      let newY = afterNode.position.y;
      if (nodesFromSameParent.length > 0) {
        // Stagger nodes: alternate above and below
        const offset = Math.ceil(nodesFromSameParent.length / 2) * 100;
        newY = nodesFromSameParent.length % 2 === 0
          ? afterNode.position.y + offset
          : afterNode.position.y - offset;
      }

      // Create new action node
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

    setEdges((currentEdges) => {
      // Add edge from the clicked node to the new node
      const newEdge: Edge = {
        id: `e${afterNodeId}-${newNodeId}`,
        source: afterNodeId,
        target: newNodeId,
        animated: true,
      };

      return [...currentEdges, newEdge];
    });
  }, [handleNodeClick, handleDeleteNode, setNodes, setEdges]);

  useEffect(() => {
    // Initialize with default trigger and action nodes
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
  }, [handleNodeClick, handleAddAction, handleDeleteNode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSelectItem = (item: Action | Trigger) => {
    if (currentNodeId) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === currentNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: item.name,
                selected: true,
                itemId: item.id,
              },
            };
          }
          return node;
        })
      );
    }
    setIsDialogOpen(false);
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      // Find the trigger node
      const triggerNode = nodes.find((n) => n.data.type === 'trigger');
      if (!triggerNode || !triggerNode.data.itemId) {
        alert('Please select a trigger before publishing');
        return;
      }

      // Find all action nodes that have been configured
      const actionNodes = nodes.filter(
        (n) => n.data.type === 'action' && n.data.itemId
      );

      if (actionNodes.length === 0) {
        alert('Please add and configure at least one action');
        return;
      }

      // Prompt user for zap name
      const zapName = prompt('Enter a name for your Zap:');
      if (!zapName || zapName.trim() === '') {
        alert('Zap name is required');
        return;
      }

      // Build the zap payload
      const zapData = {
        name: zapName.trim(),
        availableTriggerId: triggerNode.data.itemId,
        triggerMetadata: {},
        actions: actionNodes.map((node) => ({
          availableActionId: node.data.itemId,
          actionMetadata: {},
        })),
      };

      const response = await axios.post(`${BACKEND_URL}/api/v1/zap`, zapData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Zap published successfully!');
      console.log('Published zap:', response.data);
    } catch (error: unknown) {
      console.error('Failed to publish zap:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        alert(`Failed to publish zap: ${axiosError.response?.data?.message || axiosError.message || 'Unknown error'}`);
      } else {
        alert('Failed to publish zap');
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Create Zap</h1>
        <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700">
          Publish
        </Button>
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Select {dialogType === 'trigger' ? 'Trigger' : 'Action'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="grid gap-3">
                {(dialogType === 'trigger' ? triggers : actions).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      )}
                    </div>
                  </div>
                ))}
                {(dialogType === 'trigger' ? triggers : actions).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {dialogType === 'trigger' ? 'triggers' : 'actions'} available
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateZap;
  