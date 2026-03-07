import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import type { ConceptGraph } from "../types";

interface Props {
  graph: ConceptGraph | null;
  setSelectedConcept: (concept: string) => void;
  weakConcepts: string[];
  strongConcepts: string[];
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 60;

function layoutGraph(
  graph: ConceptGraph,
  weakConcepts: string[],
  strongConcepts: string[],
) {
  dagreGraph.setGraph({ rankdir: "LR" });

  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const nodes = graph.nodes.map((node) => {
    const position = dagreGraph.node(node.id);

    const isWeak = weakConcepts.includes(node.id);
    const isStrong = strongConcepts.includes(node.id);

    let border = "1px solid #00f5ff";
    let glow = "0 0 10px #00f5ff";

    if (isWeak) {
      border = "2px solid #ef4444";
      glow = "0 0 15px #ef4444";
    }

    if (isStrong) {
      border = "2px solid #22c55e";
      glow = "0 0 15px #22c55e";
    }

    return {
      ...node,
      position: {
        x: position.x,
        y: position.y,
      },
      style: {
        background: "#020617",
        color: "#ffffff",
        border: border,
        boxShadow: glow,
      },
    };
  });

  return {
    nodes,
    edges: graph.edges,
  };
}

export default function ConceptGraph({
  graph,
  setSelectedConcept,
  weakConcepts,
  strongConcepts,
}: Props) {
  if (!graph) return null;

  const layouted = layoutGraph(graph, weakConcepts, strongConcepts);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-lg">
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
