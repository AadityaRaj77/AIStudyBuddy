import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import type { ConceptGraph } from "../types";

interface Props {
  graph: ConceptGraph | null;
  setSelectedConcept: (concept: string) => void;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

function layoutGraph(graph: ConceptGraph) {
  dagreGraph.setGraph({ rankdir: "LR" });

  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: graph.nodes.map((node) => {
      const position = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: position.x,
          y: position.y,
        },
      };
    }),
    edges: graph.edges,
  };
}

export default function ConceptGraph({ graph, setSelectedConcept }: Props) {
  if (!graph) return null;

  const layouted = layoutGraph(graph);

  return (
    <div
      className="
    rounded-xl
    border
    border-slate-700
    bg-slate-900
    p-4
    shadow-lg
  "
    >
      <div className="h-125">
        <ReactFlow
          nodes={layouted.nodes}
          edges={layouted.edges}
          fitView
          onNodeClick={(_, node) => {
            setSelectedConcept(node.data.label);
          }}
        />
      </div>
    </div>
  );
}
