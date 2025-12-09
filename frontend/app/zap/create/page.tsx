'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, MiniMap, Background, BackgroundVariant, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/navbar';
import { CustomNode } from './components/CustomNode';
import { SelectionDialog } from './components/SelectionDialog';
import { useAvailableItems } from './hooks/useAvailableItems';
import { useZapFlow } from './hooks/useZapFlow';
import { publishZap } from './utils/publishZap';
import { AvailableItem } from './types';

const nodeTypes = {
  custom: CustomNode,
};

const CreateZap = () => {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'trigger' | 'action'>('trigger');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<AvailableItem | null>(null);
  const [metadataInput, setMetadataInput] = useState('{}');

  const { actions, triggers, loading, fetchActions, fetchTriggers } = useAvailableItems();

  const handleNodeClick = useCallback(
    (nodeId: string, type: 'trigger' | 'action') => {
      setCurrentNodeId(nodeId);
      setDialogType(type);
      setIsDialogOpen(true);
      type === 'trigger' ? fetchTriggers() : fetchActions();
    },
    [fetchActions, fetchTriggers]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes: Node[]) => currentNodes.filter((node: Node) => node.id !== nodeId));
      setEdges((currentEdges) =>
        currentEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect } = useZapFlow(
    handleNodeClick,
    handleDeleteNode,
    mounted
  );

  const handleSelectItem = (item: AvailableItem) => {
    setSelectedItem(item);
    const currentNode = nodes.find((n) => n.id === currentNodeId);
    if (currentNode?.data.metadata) {
      setMetadataInput(JSON.stringify(currentNode.data.metadata, null, 2));
    } else {
      setMetadataInput('{}');
    }
  };

  const handleSaveMetadata = () => {
    if (!selectedItem || !currentNodeId) return;

    try {
      const parsedMetadata = JSON.parse(metadataInput);
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === currentNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: selectedItem.name,
                selected: true,
                itemId: selectedItem.id,
                metadata: parsedMetadata,
              },
            };
          }
          return node;
        })
      );
      setIsDialogOpen(false);
      setSelectedItem(null);
      setMetadataInput('{}');
    } catch {
      alert('Invalid JSON format. Please check your metadata input.');
    }
  };

  const handlePublish = async () => {
    try {
      await publishZap(nodes, edges);
      alert('Zap published successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish zap';
      alert(message);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedItem(null);
      setMetadataInput('{}');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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

      <SelectionDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogClose}
        dialogType={dialogType}
        items={dialogType === 'trigger' ? triggers : actions}
        loading={loading}
        selectedItem={selectedItem}
        metadataInput={metadataInput}
        onSelectItem={handleSelectItem}
        onMetadataChange={setMetadataInput}
        onSave={handleSaveMetadata}
        onBack={() => {
          setSelectedItem(null);
          setMetadataInput('{}');
        }}
      />
    </div>
  );
};

export default CreateZap;
