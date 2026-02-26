import { useMemo, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BezierEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// --- Miro-inspired color palette ---
const branchPalette = [
  { bg: '#818CF8', text: '#FFFFFF', light: '#E0E7FF', soft: 'rgba(129,140,248,0.15)' },
  { bg: '#34D399', text: '#FFFFFF', light: '#D1FAE5', soft: 'rgba(52,211,153,0.15)' },
  { bg: '#FB923C', text: '#FFFFFF', light: '#FFEDD5', soft: 'rgba(251,146,60,0.15)' },
  { bg: '#F472B6', text: '#FFFFFF', light: '#FCE7F3', soft: 'rgba(244,114,182,0.15)' },
  { bg: '#38BDF8', text: '#FFFFFF', light: '#E0F2FE', soft: 'rgba(56,189,248,0.15)' },
  { bg: '#A78BFA', text: '#FFFFFF', light: '#EDE9FE', soft: 'rgba(167,139,250,0.15)' },
  { bg: '#FBBF24', text: '#18181B', light: '#FEF3C7', soft: 'rgba(251,191,36,0.15)' },
];

// --- Custom Nodes: pill-shaped, colorful, clean ---

const CenterNode = memo(({ data }) => (
  <div style={{
    background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A78BFA 100%)',
    borderRadius: '50px',
    padding: '18px 36px',
    textAlign: 'center',
    boxShadow: '0 0 50px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.3)',
    cursor: 'grab',
  }}>
    <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Left} id="left" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Top} id="top" style={{ opacity: 0 }} />
    <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
    <div style={{
      fontSize: '17px',
      fontWeight: '800',
      color: '#FFFFFF',
      fontFamily: '"Instrument Sans", sans-serif',
      letterSpacing: '-0.02em',
      lineHeight: '1.25',
      textShadow: '0 1px 4px rgba(0,0,0,0.2)',
      whiteSpace: 'nowrap',
    }}>
      {data.label}
    </div>
  </div>
));
CenterNode.displayName = 'CenterNode';

const BranchNode = memo(({ data }) => {
  const c = data.color || branchPalette[0];
  return (
    <div style={{
      background: c.bg,
      borderRadius: '40px',
      padding: '12px 24px',
      textAlign: 'center',
      boxShadow: `0 0 24px ${c.soft}, 0 4px 16px rgba(0,0,0,0.25)`,
      cursor: 'grab',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    }}>
      <Handle type="target" position={Position.Left} id="target-left" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="target-right" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
      <div style={{
        fontSize: '13px',
        fontWeight: '700',
        color: c.text,
        fontFamily: '"Inter", sans-serif',
        lineHeight: '1.3',
        whiteSpace: 'nowrap',
      }}>
        {data.label}
      </div>
    </div>
  );
});
BranchNode.displayName = 'BranchNode';

const LeafNode = memo(({ data }) => {
  const c = data.color || branchPalette[0];
  return (
    <div style={{
      background: '#18181B',
      border: `2px solid ${c.bg}50`,
      borderRadius: '30px',
      padding: '9px 18px',
      textAlign: 'center',
      cursor: 'grab',
      transition: 'border-color 0.15s ease',
    }}>
      <Handle type="target" position={Position.Left} id="target-left" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right} id="target-right" style={{ opacity: 0 }} />
      <div style={{
        fontSize: '12px',
        fontWeight: '500',
        color: c.bg,
        fontFamily: '"Inter", sans-serif',
        lineHeight: '1.3',
        whiteSpace: 'nowrap',
      }}>
        {data.label}
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

// --- Radial Layout Engine ---
// Places center in the middle, branches radiate outward left/right,
// leaves fan out further from each branch — like a real mind map.

function radialLayout(rfNodes, rfEdges) {
  const centerNode = rfNodes.find(n => n.type === 'centerNode');
  if (!centerNode) return rfNodes;

  // Build adjacency: parent -> children
  const childMap = {};
  rfEdges.forEach(e => {
    if (!childMap[e.source]) childMap[e.source] = [];
    childMap[e.source].push(e.target);
  });

  // Collect branch nodes (direct children of center)
  const branchIds = childMap[centerNode.id] || [];
  const branchCount = branchIds.length;

  // Position center
  const positioned = {};
  positioned[centerNode.id] = { x: 0, y: 0 };

  // Distribute branches: alternate left/right, spread vertically
  const leftBranches = [];
  const rightBranches = [];
  branchIds.forEach((id, i) => {
    if (i % 2 === 0) rightBranches.push(id);
    else leftBranches.push(id);
  });

  const BRANCH_X = 350;  // horizontal distance from center to branches
  const BRANCH_Y_GAP = 140; // vertical gap between branches on same side
  const LEAF_X = 260;    // horizontal distance from branch to leaves
  const LEAF_Y_GAP = 55; // vertical gap between leaves

  function placeBranches(ids, side) {
    const totalHeight = (ids.length - 1) * BRANCH_Y_GAP;
    const startY = -totalHeight / 2;
    const xDir = side === 'right' ? 1 : -1;

    ids.forEach((branchId, idx) => {
      const bx = xDir * BRANCH_X;
      const by = startY + idx * BRANCH_Y_GAP;
      positioned[branchId] = { x: bx, y: by };

      // Place leaves for this branch
      const leafIds = childMap[branchId] || [];
      const leafTotalH = (leafIds.length - 1) * LEAF_Y_GAP;
      const leafStartY = by - leafTotalH / 2;

      leafIds.forEach((leafId, li) => {
        positioned[leafId] = {
          x: bx + xDir * LEAF_X,
          y: leafStartY + li * LEAF_Y_GAP,
        };
      });
    });
  }

  placeBranches(rightBranches, 'right');
  placeBranches(leftBranches, 'left');

  // Apply positions, centering each node on its position
  return rfNodes.map(node => {
    const pos = positioned[node.id];
    if (!pos) return node; // fallback for orphans
    // Estimate node width for centering
    const w = node.type === 'centerNode' ? 200 : node.type === 'branchNode' ? 150 : 130;
    const h = node.type === 'centerNode' ? 56 : node.type === 'branchNode' ? 42 : 36;
    return {
      ...node,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
    };
  });
}

// --- Data Builder ---

function buildReactFlowData(data) {
  if (!data?.nodes) return { nodes: [], edges: [] };

  const rfNodes = [];
  const rfEdges = [];
  let branchIndex = 0;

  // Track which side each branch goes to for edge routing
  const branchSides = {};

  function processNode(node, parentId = null, color = branchPalette[0], side = 'right') {
    const isCenter = node.type === 'center';
    const isBranch = node.type === 'branch';

    if (isBranch) {
      color = branchPalette[branchIndex % branchPalette.length];
      side = branchIndex % 2 === 0 ? 'right' : 'left';
      branchSides[node.id] = side;
      branchIndex++;
    }

    if (!isBranch && !isCenter) {
      // leaf inherits parent's side
      const parentSide = branchSides[parentId] || side;
      branchSides[node.id] = parentSide;
    }

    rfNodes.push({
      id: node.id,
      type: isCenter ? 'centerNode' : isBranch ? 'branchNode' : 'leafNode',
      data: { label: node.label, color },
      position: { x: 0, y: 0 },
    });

    if (parentId) {
      const nodeSide = branchSides[node.id] || side;
      rfEdges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'default',
        sourceHandle: nodeSide,
        targetHandle: nodeSide === 'right' ? 'target-left' : 'target-right',
        style: {
          stroke: color.bg,
          strokeWidth: isBranch ? 3 : 2,
          opacity: isBranch ? 0.6 : 0.35,
        },
      });
    }

    if (node.children) {
      node.children.forEach(child => processNode(child, node.id, color, side));
    }
  }

  // Process center nodes first
  data.nodes.forEach(node => {
    if (node.type === 'center') processNode(node);
  });

  // Process branches
  data.nodes.forEach(node => {
    if (node.type === 'branch') processNode(node, node.parent || 'center');
  });

  // Apply radial layout
  const layoutedNodes = radialLayout(rfNodes, rfEdges);

  return { nodes: layoutedNodes, edges: rfEdges };
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
    <div className="w-full h-[700px] rounded-2xl overflow-hidden border border-white/[0.06] relative"
      style={{ background: '#0A0A0F' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.15}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
        defaultEdgeOptions={{
          type: 'default',
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#1E1E28" gap={30} size={1.5} variant="dots" />
        <Controls className="!rounded-xl !border-white/5" />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'centerNode') return '#818CF8';
            return node.data?.color?.bg || '#71717A';
          }}
          maskColor="rgba(0,0,0,0.8)"
          style={{ background: '#111116', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
        />
      </ReactFlow>
    </div>
  );
}
