import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AvailableItem } from '../types';

interface SelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'trigger' | 'action';
  items: AvailableItem[];
  loading: boolean;
  selectedItem: AvailableItem | null;
  metadataInput: string;
  onSelectItem: (item: AvailableItem) => void;
  onMetadataChange: (value: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export const SelectionDialog: React.FC<SelectionDialogProps> = ({
  isOpen,
  onOpenChange,
  dialogType,
  items,
  loading,
  selectedItem,
  metadataInput,
  onSelectItem,
  onMetadataChange,
  onSave,
  onBack,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select {dialogType === 'trigger' ? 'Trigger' : 'Action'}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : !selectedItem ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectItem(item)}
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
              {items.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {dialogType === 'trigger' ? 'triggers' : 'actions'} available
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50 flex items-center gap-4">
                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-12 h-12 object-contain flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{selectedItem.name}</div>
                  {selectedItem.description && (
                    <div className="text-sm text-gray-500 mt-1">{selectedItem.description}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Metadata (JSON)</label>
                <textarea
                  value={metadataInput}
                  onChange={(e) => onMetadataChange(e.target.value)}
                  className="w-full h-48 p-3 border rounded-lg font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button onClick={onBack} variant="outline">
                  Back
                </Button>
                <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
