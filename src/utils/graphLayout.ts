
import { PipelineData, PipelineNode, PipelineEdge } from './pipelineData';

// Interface for node with position
export interface PositionedNode extends PipelineNode {
  position: {
    x: number;
    y: number;
  };
}

// Interface for positioned pipeline data
export interface PositionedPipelineData {
  nodes: PositionedNode[];
  edges: PipelineEdge[];
}

// Helper for creating a directed acyclic graph
interface DAGNode {
  id: string;
  successors: string[];
  predecessors: string[];
  rank?: number;
}

/**
 * Calculates basic hierarchical layout for pipeline nodes
 */
export const calculateLayout = (
  data: PipelineData,
  width: number = 1200,
  height: number = 800,
  nodeWidth: number = 180,
  nodeHeight: number = 100,
  horizontalSpacing: number = 80,
  verticalSpacing: number = 100
): PositionedPipelineData => {
  // Create DAG structure
  const graph: Record<string, DAGNode> = {};
  
  // Initialize nodes
  data.nodes.forEach(node => {
    graph[node.id] = {
      id: node.id,
      successors: [],
      predecessors: [],
    };
  });
  
  // Add edges
  data.edges.forEach(edge => {
    if (graph[edge.source] && graph[edge.target]) {
      graph[edge.source].successors.push(edge.target);
      graph[edge.target].predecessors.push(edge.source);
    }
  });
  
  // Assign ranks (levels) to nodes using topological sort
  const assignRanks = () => {
    // Find nodes with no predecessors (sources)
    const sources = Object.values(graph).filter(node => node.predecessors.length === 0);
    
    // Assign rank 0 to source nodes
    sources.forEach(node => {
      node.rank = 0;
    });
    
    // Assign ranks to other nodes
    let currentNodes = [...sources];
    let nextNodes: DAGNode[] = [];
    let currentRank = 0;
    
    while (currentNodes.length > 0) {
      currentNodes.forEach(node => {
        node.successors.forEach(successorId => {
          const successor = graph[successorId];
          
          // Process a successor only if all its predecessors have been processed
          const allPredecessorsProcessed = successor.predecessors.every(
            predId => graph[predId].rank !== undefined
          );
          
          if (allPredecessorsProcessed) {
            // Assign rank as 1 + max rank of predecessors
            const maxPredRank = Math.max(
              ...successor.predecessors.map(predId => graph[predId].rank || 0)
            );
            successor.rank = Math.max(maxPredRank + 1, successor.rank || 0);
            
            if (!nextNodes.includes(successor)) {
              nextNodes.push(successor);
            }
          }
        });
      });
      
      currentNodes = nextNodes;
      nextNodes = [];
      currentRank++;
    }
  };
  
  assignRanks();
  
  // Group nodes by rank
  const rankGroups: Record<number, string[]> = {};
  Object.values(graph).forEach(node => {
    if (node.rank !== undefined) {
      if (!rankGroups[node.rank]) {
        rankGroups[node.rank] = [];
      }
      rankGroups[node.rank].push(node.id);
    }
  });
  
  // Calculate ranks count and width
  const maxRank = Math.max(...Object.keys(rankGroups).map(Number));
  
  // Calculate positions based on ranks
  const positionedNodes: PositionedNode[] = data.nodes.map(node => {
    const nodeInfo = graph[node.id];
    const rank = nodeInfo.rank || 0;
    
    // Calculate how many nodes in this rank
    const nodesInRank = rankGroups[rank]?.length || 1;
    const nodeIndex = rankGroups[rank]?.indexOf(node.id) || 0;
    
    // Calculate x, y positions
    const rankWidth = width;
    const nodeSpacing = rankWidth / (nodesInRank + 1);
    
    const x = nodeSpacing * (nodeIndex + 1) - nodeWidth / 2;
    const y = rank * (nodeHeight + verticalSpacing) + 50; // 50px top margin
    
    return {
      ...node,
      position: { x, y },
    };
  });
  
  return {
    nodes: positionedNodes,
    edges: data.edges,
  };
};

/**
 * Helper to find nodes that are on the critical path
 */
export const findCriticalPath = (data: PipelineData): string[] => {
  // For demonstration, we'll use a simple approach
  // In a real implementation, this would analyze durations and dependencies
  const criticalPathEdges = data.edges.filter(edge => edge.type === 'critical');
  const criticalNodes = new Set<string>();
  
  criticalPathEdges.forEach(edge => {
    criticalNodes.add(edge.source);
    criticalNodes.add(edge.target);
  });
  
  return Array.from(criticalNodes);
};

/**
 * Helper to find bottlenecks in the pipeline
 */
export const findBottlenecks = (data: PipelineData): string[] => {
  // In a real implementation, this would analyze queues, wait times, and resource usage
  // For this demo, we'll identify nodes with the longest duration
  const sortedByDuration = [...data.nodes]
    .filter(node => node.duration !== undefined)
    .sort((a, b) => (b.duration || 0) - (a.duration || 0));
  
  return sortedByDuration.slice(0, 3).map(node => node.id);
};
