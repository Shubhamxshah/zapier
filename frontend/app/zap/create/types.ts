export interface AvailableAction {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface AvailableTrigger {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CustomNodeData {
  label: string;
  type: 'trigger' | 'action';
  selected?: boolean;
  itemId?: string;
  metadata?: Record<string, unknown>;
  onConfigure: () => void;
  onAddAction?: () => void;
  onDelete?: () => void;
}

export type AvailableItem = AvailableAction | AvailableTrigger;
