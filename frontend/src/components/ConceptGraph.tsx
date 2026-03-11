import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import type { ConceptGraph } from "../types";
import { useState } from "react";

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
  search: string,
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "LR", nodesep: 80, ranksep: 120 });

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

    const matchesSearch =
      search && node.id.toLowerCase().includes(search.toLowerCase());

    let border = "2px solid #3B82F6";
    let glow = "0 4px 12px rgba(59,130,246,0.2)";
    let bg = "#ffffff";
    let opacity = 1;

    if (isWeak) {
      border = "2px solid #ef4444";
    }

    if (isStrong) {
      border = "2px solid #22c55e";
    }

    if (isCurrent) {
      border = "2px solid #8b5cf6";
      glow = "0 6px 18px rgba(139,92,246,0.35)";
    }

    if (search && !matchesSearch) {
      opacity = 0.4;
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
        opacity,
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
  const [search, setSearch] = useState("");

  if (!graph) return null;

  const layouted = layoutGraph(
    graph,
    weakConcepts,
    strongConcepts,
    currentStudyConcept,
    search,
  );

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-xl p-6">
      <div className="flex gap-6 text-xs mb-4 text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          Weak
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          Mastered
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-400"></span>
          Current Concept
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search concept..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            px-3
            py-2
            border
            border-blue-200
            rounded-lg
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-400
            w-60
          "
        />
      </div>

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
