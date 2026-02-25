import { useMemo, useCallback, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const branchColors = [
  { main: '#818CF8', light: '#C7D2FE', bg: 'rgba(129,140,248,0.12)', glow: 'rgba(129,140,248,0.25)' },
  { main: '#34D399', light: '#A7F3D0', bg: 'rgba(52,211,153,0.12)', glow: 'rgba(52,211,153,0.25)' },
  { main: '#FB923C', light: '#FED7AA', bg: 'rgba(251,146,60,0.12)', glow: 'rgba(251,146,60,0.25)' },
  { main: '#F472B6', light: '#FBCFE8', bg: 'rgba(244,114,182,0.12)', glow: 'rgba(244,114,182,0.25)' },
  { main: '#38BDF8', light: '#BAE6FD', bg: 'rgba(56,189,248,0.12)', glow: 'rgba(56,189,248,0.25)' },
  { main: '#A78BFA', light: '#DDD6FE', bg: 'rgba(167,139,250,0.12)', glow: 'rgba(167,139,250,0.25)' },
  { main: '#FBBF24', light: '#FDE68A', bg: 'rgba(251,191,36,0.12)', glow: 'rgba(251,191,36,0.25)' },
];

// --- Custom Node Components ---

const CenterNode = memo(({ data }) => (
  <div style={{
    background: 'linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)',
    border: '2px solid #818CF8',
    borderRadius: '20px',
    padding: '20px 32px',
    textAlign: 'center',
    boxShadow: '0 0 40px rgba(129,140,248,0.2), 0 8px 32px rgba(0,0,0,0.4)',
    minWidth: '200px',
    maxWidth: '280px',
  }}>
    <Handle type="source" position={Position.Bottom} style={{ background: '#818CF8', width: 8, height: 8, border: '2px solid #312E81' }} />
    <Handle type="target" position={Position.Top} style={{ background: '#818CF8', width: 8, height: 8, border: '2px solid #312E81' }} />
    <div style={{
      fontSize: '16px',
      fontWeight: '700',
      color: '#E0E7FF',
      fontFamily: '"Instrument Sans", sans-serif',
      letterSpacing: '-0.01em',
      lineHeight: '1.3',
    }}>
      {data.label}
    </div>
    {data.summary && (
      <div style={{
        fontSize: '11px',
        color: '#A5B4FC',
        marginTop: '6px',
        opacity: 0.8,
      }}>
        {data.summary}
      </div>
    )}
  </div>
));
CenterNode.displayName = 'CenterNode';

const BranchNode = memo(({ data }) => {
  const color = data.color || branchColors[0];
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color.bg} 0%, rgba(24,24,27,0.95) 100%)`,
      border: `1.5px solid ${color.main}60`,
      borderLeft: `4px solid ${color.main}`,
      borderRadius: '14px',
      padding: '14px 20px',
      minWidth: '160px',
      maxWidth: '220px',
      boxShadow: `0 0 20px ${color.glow}, 0 4px 16px rgba(0,0,0,0.3)`,
      transition: 'box-shadow 0.2s',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: color.main, width: 7, height: 7, border: '2px solid #18181B' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color.main, width: 7, height: 7, border: '2px solid #18181B' }} />
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        color: color.light,
        fontFamily: '"Instrument Sans", sans-serif',
        lineHeight: '1.3',
      }}>
        {data.label}
      </div>
    </div>
  );
});
BranchNode.displayName = 'BranchNode';

const LeafNode = memo(({ data }) => {
  const color = data.color || branchColors[0];
  return (
    <div style={{
      background: 'rgba(24,24,27,0.9)',
      border: `1px solid ${color.main}30`,
      borderRadius: '12px',
      padding: '10px 16px',
      minWidth: '130px',
      maxWidth: '180px',
      backdropFilter: 'blur(8px)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: color.main, width: 6, height: 6, border: '2px solid #18181B' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: color.main, width: 6, height: 6, border: '2px solid #18181B' }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: color.main,
          flexShrink: 0,
          boxShadow: `0 0 8px ${color.main}`,
        }} />
        <div style={{
          fontSize: '12px',
          fontWeight: '500',
          color: '#D4D4D8',
          fontFamily: '"Inter", sans-serif',
          lineHeight: '1.35',
        }}>
          {data.label}
        </div>
      </div>
    </div>
  );
});
LeafNode.displayName = 'LeafNode';

const nodeTypes = {
  centerNode: CenterNode,
  branchNode: BranchNode,
  leafNode: LeafNode,
};

// --- Layout ---

function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 90, nodesep: 50, marginx: 40, marginy: 40 });

  nodes.forEach((node) => {
    const w = node.type === 'centerNode' ? 260 : node.type === 'branchNode' ? 200 : 170;
    const h = node.type === 'centerNode' ? 80 : node.type === 'branchNode' ? 60 : 50;
    g.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    const w = node.type === 'centerNode' ? 260 : node.type === 'branchNode' ? 200 : 170;
    const h = node.type === 'centerNode' ? 80 : node.type === 'branchNode' ? 60 : 50;
    return {
      ...node,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
}

// --- Data Builder ---

function buildReactFlowData(data) {
  if (!data?.nodes) return { nodes: [], edges: [] };

  const rfNodes = [];
  const rfEdges = [];
  let branchIndex = 0;

  function processNode(node, parentId = null, color = branchColors[0]) {
    const isCenter = node.type === 'center';
    const isBranch = node.type === 'branch';

    if (isBranch) {
      color = branchColors[branchIndex % branchColors.length];
      branchIndex++;
    }

    rfNodes.push({
      id: node.id,
      type: isCenter ? 'centerNode' : isBranch ? 'branchNode' : 'leafNode',
      data: {
        label: node.label,
        color,
        summary: isCenter ? data.summary : undefined,
      },
      position: { x: 0, y: 0 },
    });

    if (parentId) {
      rfEdges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        style: {
          stroke: color.main,
          strokeWidth: isBranch ? 2.5 : 1.5,
          opacity: isBranch ? 0.7 : 0.45,
        },
        animated: isBranch,
      });
    }

    if (node.children) {
      node.children.forEach(child => processNode(child, node.id, color));
    }
  }

  data.nodes.forEach(node => {
    if (node.type === 'center') {
      processNode(node);
    }
  });

  data.nodes.forEach(node => {
    if (node.type === 'branch') {
      processNode(node, node.parent || 'center');
    }
  });

  return getLayoutedElements(rfNodes, rfEdges);
}

// --- Component ---

export default function MindMapView({ data }) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => buildReactFlowData(data),
    [data]
  );

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  if (!data?.nodes?.length) {
    return <div className="text-center text-zinc-500 py-20">No mind map data available.</div>;
  }

  return (
    <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-white/5 relative">
      {/* Ambient glow behind the graph */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-3xl" />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#09090B' }}
      >
        <Background color="#27272A" gap={24} size={1} />
        <Controls className="!rounded-xl !border-white/5" />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'centerNode') return '#818CF8';
            const color = node.data?.color;
            return color?.main || '#71717A';
          }}
          maskColor="rgba(0,0,0,0.75)"
          style={{ background: '#18181B', borderRadius: '12px' }}
        />
      </ReactFlow>
    </div>
  );
}
