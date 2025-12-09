import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, X } from 'lucide-react';
import { CustomNodeData } from '../types';

export const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
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
            data.onDelete();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      )}

      <div className="flex flex-col gap-2">
        <div className="font-bold text-lg">{data.label}</div>
        <div className="text-sm text-gray-500">
          {data.type === 'trigger' ? 'Trigger' : 'Action'}
        </div>
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
