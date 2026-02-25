import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const typeStyles = {
  start: {
    background: '#065F46',
    border: '2px solid #34D399',
    color: '#D1FAE5',
  },
  process: {
    background: '#27272A',
    border: '2px solid #52525B',
    color: '#FAFAFA',
  },
  decision: {
    background: '#78350F',
    border: '2px solid #F59E0B',
    color: '#FEF3C7',
  },
  end: {
    background: '#3730A3',
    border: '2px solid #818CF8',
    color: '#E0E7FF',
  },
};

function buildFlowchartData(data) {
  if (!data?.steps?.length) return { nodes: [], edges: [] };

  const nodes = data.steps.map((step) => {
    const style = typeStyles[step.type] || typeStyles.process;

    return {
      id: step.id,
      data: { label: step.label },
      position: { x: 0, y: 0 },
      style: {
        ...style,
        borderRadius: step.type === 'decision' ? '8px' : '14px',
        padding: '14px 22px',
        fontSize: '13px',
        fontWeight: '600',
        fontFamily: '"Inter", sans-serif',
        width: 220,
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      },
    };
  });

  const edges = [];
  data.steps.forEach(step => {
    if (step.connections) {
      step.connections.forEach(conn => {
        edges.push({
          id: `${step.id}-${conn.target}`,
          source: step.id,
          target: conn.target,
          label: conn.label || '',
          type: 'smoothstep',
          style: { stroke: '#818CF8', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#818CF8', width: 20, height: 20 },
          labelStyle: { fill: '#E4E4E7', fontSize: 11, fontWeight: 600, fontFamily: '"Inter", sans-serif' },
          labelBgStyle: { fill: '#27272A', fillOpacity: 0.95 },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 6,
        });
      });
    }
  });

  // Dagre layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 80 });

  nodes.forEach(n => g.setNode(n.id, { width: 220, height: 60 }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const layoutedNodes = nodes.map(n => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - 110, y: pos.y - 30 } };
  });

  return { nodes: layoutedNodes, edges };
}

export default function FlowchartView({ data }) {
  const { nodes, edges } = useMemo(() => buildFlowchartData(data), [data]);

  if (!data?.steps?.length) {
    return <div className="text-center text-zinc-500 py-20">No flowchart data available.</div>;
  }

  return (
    <div className="w-full h-[650px] rounded-xl overflow-hidden border border-white/10 bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#0C0C0E' }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#3F3F46" gap={24} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const type = data.steps.find(s => s.id === node.id)?.type;
            if (type === 'start') return '#34D399';
            if (type === 'decision') return '#F59E0B';
            if (type === 'end') return '#818CF8';
            return '#71717A';
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#18181B' }}
        />
      </ReactFlow>
    </div>
  );
}
