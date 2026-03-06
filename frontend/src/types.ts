export interface ConceptNode {
  id: string
  data: { label: string }
  position: { x: number; y: number }
}

export interface ConceptEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface ConceptGraph {
  nodes: ConceptNode[]
  edges: ConceptEdge[]
}