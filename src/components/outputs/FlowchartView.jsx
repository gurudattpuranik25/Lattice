import { useMemo, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

// --- Color System ---

const typeConfig = {
  start: {
    gradient: 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)',
    border: '#34D399',
    text: '#A7F3D0',
    glow: 'rgba(52,211,153,0.2)',
    icon: '▶',
    markerColor: '#34D399',
  },
  process: {
    gradient: 'linear-gradient(135deg, #1E1E24 0%, #18181B 100%)',
    border: '#6366F1',
    text: '#E0E7FF',
    glow: 'rgba(99,102,241,0.12)',
    icon: '⚙',
    markerColor: '#818CF8',
  },
  decision: {
    gradient: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
    border: '#F59E0B',
    text: '#FDE68A',
    glow: 'rgba(245,158,11,0.2)',
    icon: '◆',
    markerColor: '#F59E0B',
  },
  end: {
    gradient: 'linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)',
    border: '#818CF8',
    text: '#C7D2FE',
    glow: 'rgba(129,140,248,0.2)',
    icon: '■',
    markerColor: '#818CF8',
  },
};

// --- Custom Nodes ---

const StartNode = memo(({ data }) => {
  const cfg = typeConfig.start;
  return (
    <div style={{
      background: cfg.gradient,
      border: `2px solid ${cfg.border}`,
      borderRadius: '24px',
      padding: '16px 28px',
      textAlign: 'center',
      boxShadow: `0 0 30px ${cfg.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
      minWidth: '180px',
      maxWidth: '260px',
    }}>
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.border, width: 8, height: 8, border: '2px solid #064E3B' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px', opacity: 0.8 }}>{cfg.icon}</span>
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: cfg.text,
          fontFamily: '"Instrument Sans", sans-serif',
        }}>
          {data.label}
        </span>
      </div>
    </div>
  );
});
StartNode.displayName = 'StartNode';

const ProcessNode = memo(({ data }) => {
  const cfg = typeConfig.process;
  return (
    <div style={{
      background: cfg.gradient,
      border: `1.5px solid ${cfg.border}50`,
      borderRadius: '14px',
      padding: '14px 22px',
      textAlign: 'center',
      boxShadow: `0 0 20px ${cfg.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
      minWidth: '180px',
      maxWidth: '260px',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: cfg.border, width: 7, height: 7, border: '2px solid #18181B' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.border, width: 7, height: 7, border: '2px solid #18181B' }} />
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: cfg.text,
        fontFamily: '"Inter", sans-serif',
        lineHeight: '1.35',
      }}>
        {data.label}
      </div>
    </div>
  );
});
ProcessNode.displayName = 'ProcessNode';

const DecisionNode = memo(({ data }) => {
  const cfg = typeConfig.decision;
  return (
    <div style={{
      background: cfg.gradient,
      border: `2px solid ${cfg.border}`,
      borderRadius: '14px',
      padding: '16px 24px',
      textAlign: 'center',
      boxShadow: `0 0 30px ${cfg.glow}, 0 6px 20px rgba(0,0,0,0.4)`,
      minWidth: '180px',
      maxWidth: '260px',
      position: 'relative',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: cfg.border, width: 8, height: 8, border: '2px solid #451A03' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: cfg.border, width: 8, height: 8, border: '2px solid #451A03' }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: cfg.border, width: 7, height: 7, border: '2px solid #451A03' }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: cfg.border, width: 7, height: 7, border: '2px solid #451A03' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: cfg.border }}>{cfg.icon}</span>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          color: cfg.text,
          fontFamily: '"Inter", sans-serif',
          lineHeight: '1.35',
        }}>
          {data.label}
        </span>
      </div>
    </div>
  );
});
DecisionNode.displayName = 'DecisionNode';

const EndNode = memo(({ data }) => {
  const cfg = typeConfig.end;
  return (
    <div style={{
      background: cfg.gradient,
      border: `2px solid ${cfg.border}`,
      borderRadius: '24px',
      padding: '16px 28px',
      textAlign: 'center',
      boxShadow: `0 0 30px ${cfg.glow}, 0 8px 24px rgba(0,0,0,0.4)`,
      minWidth: '180px',
      maxWidth: '260px',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: cfg.border, width: 8, height: 8, border: '2px solid #1E1B4B' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>{cfg.icon}</span>
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: cfg.text,
          fontFamily: '"Instrument Sans", sans-serif',
        }}>
          {data.label}
        </span>
      </div>
    </div>
  );
});
EndNode.displayName = 'EndNode';

const nodeTypes = {
  startNode: StartNode,
  processNode: ProcessNode,
  decisionNode: DecisionNode,
  endNode: EndNode,
};

const nodeTypeMap = {
  start: 'startNode',
  process: 'processNode',
  decision: 'decisionNode',
  end: 'endNode',
};

// --- Data Builder ---

function buildFlowchartData(data) {
  if (!data?.steps?.length) return { nodes: [], edges: [] };

  const nodes = data.steps.map((step) => ({
    id: step.id,
    type: nodeTypeMap[step.type] || 'processNode',
    data: { label: step.label },
    position: { x: 0, y: 0 },
  }));

  const edges = [];
  data.steps.forEach(step => {
    if (step.connections) {
      const cfg = typeConfig[step.type] || typeConfig.process;
      step.connections.forEach(conn => {
        edges.push({
          id: `${step.id}-${conn.target}`,
          source: step.id,
          target: conn.target,
          label: conn.label || '',
          type: 'smoothstep',
          style: { stroke: cfg.markerColor, strokeWidth: 2, opacity: 0.7 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: cfg.markerColor,
            width: 18,
            height: 18,
          },
          labelStyle: {
            fill: '#FAFAFA',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: '"Inter", sans-serif',
            background: 'transparent',
          },
          labelBgStyle: {
            fill: '#27272A',
            fillOpacity: 0.95,
            stroke: cfg.markerColor,
            strokeWidth: 0.5,
            strokeOpacity: 0.3,
          },
          labelBgPadding: [8, 5],
          labelBgBorderRadius: 8,
          animated: step.type === 'decision',
        });
      });
    }
  });

  // Dagre layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 110, nodesep: 80, marginx: 40, marginy: 40 });

  nodes.forEach(n => g.setNode(n.id, { width: 240, height: 65 }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const layoutedNodes = nodes.map(n => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - 120, y: pos.y - 32 } };
  });

  return { nodes: layoutedNodes, edges };
}

// --- Component ---

export default function FlowchartView({ data }) {
  const { nodes, edges } = useMemo(() => buildFlowchartData(data), [data]);

  if (!data?.steps?.length) {
    return <div className="text-center text-zinc-500 py-20">No flowchart data available.</div>;
  }

  return (
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-white/5 relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#09090B' }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background color="#27272A" gap={24} size={1} />
        <Controls className="!rounded-xl !border-white/5" />
        <MiniMap
          nodeColor={(node) => {
            const type = data.steps.find(s => s.id === node.id)?.type;
            return typeConfig[type]?.border || '#71717A';
          }}
          maskColor="rgba(0,0,0,0.75)"
          style={{ background: '#18181B', borderRadius: '12px' }}
        />
      </ReactFlow>
    </div>
  );
}
