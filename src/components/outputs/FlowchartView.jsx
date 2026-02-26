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

// --- Modern color system ---
const palette = {
  start: { bg: '#059669', border: '#34D399', text: '#FFFFFF', glow: 'rgba(52,211,153,0.15)', marker: '#34D399' },
  process: { bg: '#1E1E28', border: '#6366F1', text: '#E0E7FF', glow: 'rgba(99,102,241,0.08)', marker: '#818CF8' },
  decision: { bg: '#D97706', border: '#FBBF24', text: '#FFFFFF', glow: 'rgba(251,191,36,0.15)', marker: '#FBBF24' },
  end: { bg: '#6366F1', border: '#A78BFA', text: '#FFFFFF', glow: 'rgba(129,140,248,0.15)', marker: '#818CF8' },
};

// --- Custom Nodes ---

const StartNode = memo(({ data }) => (
  <div style={{
    background: palette.start.bg,
    borderRadius: '50px',
    padding: '14px 32px',
    textAlign: 'center',
    boxShadow: `0 0 30px ${palette.start.glow}, 0 4px 20px rgba(0,0,0,0.3)`,
  }}>
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
      <div style={{
        width: 0, height: 0,
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: '8px solid rgba(255,255,255,0.8)',
      }} />
      <span style={{
        fontSize: '14px', fontWeight: '700', color: palette.start.text,
        fontFamily: '"Inter", sans-serif', letterSpacing: '-0.01em',
      }}>
        {data.label}
      </span>
    </div>
  </div>
));
StartNode.displayName = 'StartNode';

const ProcessNode = memo(({ data }) => (
  <div style={{
    background: palette.process.bg,
    border: `1.5px solid ${palette.process.border}40`,
    borderRadius: '16px',
    padding: '16px 24px',
    textAlign: 'center',
    boxShadow: `0 0 20px ${palette.process.glow}, 0 4px 16px rgba(0,0,0,0.25)`,
    minWidth: '180px',
    maxWidth: '280px',
  }}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    <div style={{
      fontSize: '13px', fontWeight: '600', color: palette.process.text,
      fontFamily: '"Inter", sans-serif', lineHeight: '1.4',
    }}>
      {data.label}
    </div>
    {data.stepNum && (
      <div style={{
        position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
        background: palette.process.border, color: '#FFFFFF',
        fontSize: '10px', fontWeight: '800', borderRadius: '10px',
        padding: '2px 8px', fontFamily: '"Inter", sans-serif',
      }}>
        {data.stepNum}
      </div>
    )}
  </div>
));
ProcessNode.displayName = 'ProcessNode';

const DecisionNode = memo(({ data }) => (
  <div style={{
    background: palette.decision.bg,
    borderRadius: '16px',
    padding: '16px 24px',
    textAlign: 'center',
    boxShadow: `0 0 30px ${palette.decision.glow}, 0 4px 20px rgba(0,0,0,0.3)`,
    minWidth: '180px',
    maxWidth: '260px',
    position: 'relative',
  }}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Left} id="left" style={{ opacity: 0 }} />
    {/* Diamond indicator */}
    <div style={{
      position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
      width: '14px', height: '14px', background: palette.decision.border,
      borderRadius: '2px',
    }} />
    <div style={{
      fontSize: '13px', fontWeight: '700', color: palette.decision.text,
      fontFamily: '"Inter", sans-serif', lineHeight: '1.35',
    }}>
      {data.label}
    </div>
  </div>
));
DecisionNode.displayName = 'DecisionNode';

const EndNode = memo(({ data }) => (
  <div style={{
    background: palette.end.bg,
    borderRadius: '50px',
    padding: '14px 32px',
    textAlign: 'center',
    boxShadow: `0 0 30px ${palette.end.glow}, 0 4px 20px rgba(0,0,0,0.3)`,
  }}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.8)',
      }} />
      <span style={{
        fontSize: '14px', fontWeight: '700', color: palette.end.text,
        fontFamily: '"Inter", sans-serif',
      }}>
        {data.label}
      </span>
    </div>
  </div>
));
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

  let stepCounter = 0;
  const nodes = data.steps.map((step) => {
    const isProcess = step.type === 'process';
    if (isProcess) stepCounter++;
    return {
      id: step.id,
      type: nodeTypeMap[step.type] || 'processNode',
      data: {
        label: step.label,
        stepNum: isProcess ? stepCounter : undefined,
      },
      position: { x: 0, y: 0 },
    };
  });

  const edges = [];
  data.steps.forEach(step => {
    if (!step.connections) return;
    const cfg = palette[step.type] || palette.process;
    step.connections.forEach(conn => {
      edges.push({
        id: `${step.id}-${conn.target}`,
        source: step.id,
        target: conn.target,
        label: conn.label || '',
        type: 'default', // smooth bezier
        style: { stroke: cfg.marker, strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: cfg.marker,
          width: 16,
          height: 16,
        },
        labelStyle: {
          fill: '#FAFAFA',
          fontSize: 11,
          fontWeight: 700,
          fontFamily: '"Inter", sans-serif',
        },
        labelBgStyle: {
          fill: '#18181B',
          fillOpacity: 0.95,
          rx: 8,
          ry: 8,
        },
        labelBgPadding: [8, 5],
        labelBgBorderRadius: 8,
      });
    });
  });

  // Dagre layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 100, marginx: 60, marginy: 60 });

  nodes.forEach(n => g.setNode(n.id, { width: 240, height: 60 }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);

  const layoutedNodes = nodes.map(n => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - 120, y: pos.y - 30 } };
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
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-white/[0.06] relative"
      style={{ background: '#0A0A0F' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
        nodesDraggable={true}
        nodesConnectable={false}
        defaultEdgeOptions={{
          type: 'default',
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#1E1E28" gap={30} size={1.5} variant="dots" />
        <Controls className="!rounded-xl !border-white/5" />
        <MiniMap
          nodeColor={(node) => {
            const type = data.steps.find(s => s.id === node.id)?.type;
            return palette[type]?.border || '#71717A';
          }}
          maskColor="rgba(0,0,0,0.8)"
          style={{ background: '#111116', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
        />
      </ReactFlow>
    </div>
  );
}
