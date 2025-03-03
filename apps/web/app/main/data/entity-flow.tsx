'use client';

import {
  type Edge,
  type Node,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Position,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from '@dagrejs/dagre';

import RootViewNode from './root-view-node';
import ViewNode from './view.node';

interface FlowAutoLayout {
  nodes: Node[];
  edges: Edge[];
}

export const autoLayout = ({
  nodes,
  edges,
  direction = 'TB',
  nodeWidth = 100,
  nodeHeight = 100,
}: {
  nodes: Node[];
  edges: Edge[];
  direction?: 'TB' | 'LR';
  nodeWidth?: number;
  nodeHeight?: number;
}): FlowAutoLayout => {
  const isHorizontal = direction === 'LR';

  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  for (const node of nodes) {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  }

  for (const edge of edges) {
    dagreGraph.setEdge(edge.source, edge.target);
  }

  dagre.layout(dagreGraph);

  const newNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const nodeTypes = {
  masterView: RootViewNode,
  product: ViewNode,
  custom: ViewNode,
};

export default function EntityFlow({
  autoLayout,
}: Readonly<{
  autoLayout: FlowAutoLayout;
}>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState([...autoLayout.nodes]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edges, setEdges, onEdgesChange] = useEdgesState([...autoLayout.edges]);

  return (
    <ReactFlowProvider>
      <div className="h-full w-full rounded-lg border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={nodeTypes}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
