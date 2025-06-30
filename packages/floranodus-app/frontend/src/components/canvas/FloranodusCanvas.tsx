import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { nodeTypes, initialNodes, initialEdges } from '@/utils/nodeTypes';
import CanvasControls from './CanvasControls';
import { useFigmaSync } from '@/hooks/useFigmaSync';

const FloranodusCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { isConnected: isFigmaConnected } = useFigmaSync();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-floranodus-bg-primary">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-floranodus-bg-primary"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#2a2a2a"
        />
        <Controls className="bg-floranodus-bg-secondary border-floranodus-border" />
        <MiniMap
          className="bg-floranodus-bg-secondary"
          nodeColor="#4a9eff"
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Panel position="top-left">
          <CanvasControls />
        </Panel>
        {isFigmaConnected && (
          <Panel position="top-right">
            <div className="bg-floranodus-bg-secondary border border-floranodus-border rounded-lg p-2">
              <span className="text-floranodus-success text-xs">● Figma Connected</span>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export default FloranodusCanvas; 