import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

const branchColors = [
  '#818CF8', '#34D399', '#FB923C', '#F472B6', '#38BDF8', '#A78BFA', '#FBBF24',
];

function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 60 });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
    };
  });

  return { nodes: layoutedNodes, edges };
}

function buildReactFlowData(data) {
  if (!data?.nodes) return { nodes: [], edges: [] };

  const rfNodes = [];
  const rfEdges = [];
  let branchIndex = 0;

  function processNode(node, parentId = null, color = '#818CF8') {
    const isCenter = node.type === 'center';
    const isBranch = node.type === 'branch';

    if (isBranch) {
      color = branchColors[branchIndex % branchColors.length];
      branchIndex++;
    }

    rfNodes.push({
      id: node.id,
      data: { label: node.label },
      position: { x: 0, y: 0 },
      style: {
        background: isCenter ? '#312E81' : isBranch ? '#18181B' : '#1C1C1F',
        color: '#FAFAFA',
        border: isCenter ? '2px solid #818CF8' : `1px solid ${isBranch ? color + '66' : 'rgba(255,255,255,0.06)'}`,
        borderLeft: isBranch ? `3px solid ${color}` : undefined,
        borderRadius: '12px',
        padding: isCenter ? '16px 24px' : '10px 16px',
        fontSize: isCenter ? '15px' : '13px',
        fontWeight: isCenter ? '600' : '500',
        fontFamily: isCenter ? '"Instrument Sans", sans-serif' : '"Inter", sans-serif',
        width: isCenter ? 220 : isBranch ? 180 : 160,
        textAlign: 'center',
        boxShadow: isCenter ? '0 4px 20px rgba(129, 140, 248, 0.15)' : 'none',
      },
    });

    if (parentId) {
      rfEdges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        style: { stroke: color + '8C', strokeWidth: 2 },
        animated: false,
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
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-white/5">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        style={{ background: '#09090B' }}
      >
        <Background color="#27272A" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={() => '#818CF8'}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#18181B' }}
        />
      </ReactFlow>
    </div>
  );
}
