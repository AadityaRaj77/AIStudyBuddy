import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import type { ConceptGraph } from "../types";

interface Props {
  graph: ConceptGraph | null;
  setSelectedConcept: (concept: string) => void;
  weakConcepts: string[];
  strongConcepts: string[];
  currentStudyConcept: string | null;
}

const nodeWidth = 180;
const nodeHeight = 60;

function layoutGraph(
  graph: ConceptGraph,
  weakConcepts: string[],
  strongConcepts: string[],
  currentStudyConcept: string | null,
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR" });

  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const nodes = graph.nodes.map((node) => {
    const position = dagreGraph.node(node.id);

    const isWeak = weakConcepts.includes(node.id);
    const isStrong = strongConcepts.includes(node.id);
    const isCurrent = node.id === currentStudyConcept;

    let border = "2px solid #3B82F6";
    let glow = "0 4px 12px rgba(59,130,246,0.2)";
    let bg = "#ffffff";

    if (isWeak) {
      border = "2px solid #ef4444";
      glow = "0 4px 12px rgba(239,68,68,0.25)";
    }

    if (isStrong) {
      border = "2px solid #22c55e";
      glow = "0 4px 12px rgba(34,197,94,0.25)";
    }

    if (isCurrent) {
      border = "2px solid #8b5cf6";
      glow = "0 4px 16px rgba(139,92,246,0.35)";
    }

    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      },
      style: {
        background: bg,
        color: "#1e293b",
        border,
        boxShadow: glow,
        borderRadius: "12px",
        padding: "10px",
        fontWeight: "500",
        transition: "all 0.2s ease",
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
  currentStudyConcept,
}: Props) {
  if (!graph) return null;

  const layouted = layoutGraph(
    graph,
    weakConcepts,
    strongConcepts,
    currentStudyConcept,
  );

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-xl p-6 transition-all">
      <div className="h-105">
        <ReactFlow
          nodes={layouted.nodes}
          edges={layouted.edges}
          fitView
          onNodeClick={(_, node) => {
            setSelectedConcept(node.data?.label ?? node.id);
          }}
        />
      </div>
    </div>
  );
}
