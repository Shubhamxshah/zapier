import axios from 'axios';
import { Node, Edge } from '@xyflow/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

interface ZapData {
  name: string;
  availableTriggerId: string;
  triggerMetadata: Record<string, unknown>;
  actions: Array<{
    availableActionId: string;
    actionMetadata: Record<string, unknown>;
  }>;
}

const getSortedActions = (nodes: Node[], edges: Edge[], triggerNodeId: string) => {
  const actionNodes = nodes.filter((n) => n.data.type === 'action' && n.data.itemId);

  const nodeOrder = new Map<string, number>();
  let currentId = triggerNodeId;
  let sortingOrder = 0;

  while (currentId) {
    const nextEdge = edges.find((edge) => edge.source === currentId);
    if (!nextEdge) break;

    const nextNode = nodes.find((n) => n.id === nextEdge.target);
    if (nextNode && nextNode.data.type === 'action' && nextNode.data.itemId) {
      nodeOrder.set(nextNode.id, sortingOrder);
      sortingOrder++;
    }
    currentId = nextEdge.target;
  }

  return actionNodes
    .map((node) => ({
      node,
      order: nodeOrder.get(node.id) ?? 999,
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ node }) => ({
      availableActionId: node.data.itemId as string,
      actionMetadata: (node.data.metadata as Record<string, unknown>) || {},
    }));
};

export const publishZap = async (nodes: Node[], edges: Edge[]): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const triggerNode = nodes.find((n) => n.data.type === 'trigger');
  if (!triggerNode || !triggerNode.data.itemId) {
    throw new Error('Please select a trigger before publishing');
  }

  const sortedActions = getSortedActions(nodes, edges, triggerNode.id);
  if (sortedActions.length === 0) {
    throw new Error('Please add and configure at least one action');
  }

  const zapName = prompt('Enter a name for your Zap:');
  if (!zapName?.trim()) {
    throw new Error('Zap name is required');
  }

  const zapData: ZapData = {
    name: zapName.trim(),
    availableTriggerId: triggerNode.data.itemId as string,
    triggerMetadata: (triggerNode.data.metadata as Record<string, unknown>) || {},
    actions: sortedActions,
  };

  await axios.post(`${BACKEND_URL}/api/v1/zap`, zapData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
