# Create Zap Page

A visual workflow builder for creating automation zaps using React Flow.

## Structure

```
create/
├── components/
│   ├── CustomNode.tsx         # React Flow node component
│   └── SelectionDialog.tsx    # Dialog for selecting triggers/actions
├── hooks/
│   ├── useAvailableItems.ts   # Fetches available triggers and actions
│   └── useZapFlow.ts          # Manages React Flow nodes and edges
├── utils/
│   └── publishZap.ts          # Logic for publishing zaps to backend
├── types.ts                   # TypeScript interfaces
├── page.tsx                   # Main page component
└── README.md                  # This file
```

## Key Features

- **Visual Flow Editor**: Drag-and-drop interface for building automation workflows
- **Trigger & Action Selection**: Choose from available triggers and actions
- **Metadata Configuration**: Configure JSON metadata for each trigger/action
- **Auto-sorted Actions**: Actions are automatically sorted based on their position in the flow
- **SSR-safe**: Prevents hydration errors with client-side only rendering

## Components

### CustomNode
Renders individual nodes in the flow (triggers and actions) with:
- Delete button (actions only)
- Add Action button
- Visual indicators

### SelectionDialog
Two-step dialog for:
1. Selecting a trigger/action from available options
2. Configuring metadata in JSON format

## Hooks

### useAvailableItems
Fetches available triggers and actions from the backend API.

### useZapFlow
Manages:
- Node state (triggers and actions)
- Edge state (connections between nodes)
- Node initialization
- Adding new action nodes
- Node positioning logic

## Utils

### publishZap
Handles publishing the zap:
- Validates trigger and actions are configured
- Traverses the flow graph to determine action order
- Sorts actions by their position in the flow
- Sends data to backend API

## Usage

The page is automatically mounted at `/zap/create` and handles the complete flow creation experience.
