
import React, { useState, useEffect, useRef } from 'react';
import { PipelineData, PipelineNode, PipelineEdge } from '@/utils/pipelineData';
import { calculateLayout, findCriticalPath, findBottlenecks, PositionedNode } from '@/utils/graphLayout';
import PipelineNodeComponent from './PipelineNode';
import { cn } from '@/lib/utils';

interface PipelineGraphProps {
  data: PipelineData;
  className?: string;
  onNodeSelect?: (nodeId: string, node: PipelineNode) => void;
  selectedNodeId?: string | null;
  analysisMode?: 'none' | 'criticalPath' | 'bottlenecks' | 'resources';
}

const PipelineGraph: React.FC<PipelineGraphProps> = ({
  data,
  className,
  onNodeSelect,
  selectedNodeId,
  analysisMode = 'none',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [positionedNodes, setPositionedNodes] = useState<PositionedNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdge[]>([]);
  const [criticalPathNodes, setCriticalPathNodes] = useState<string[]>([]);
  const [bottleneckNodes, setBottleneckNodes] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  useEffect(() => {
    // Calculate layout
    const layout = calculateLayout(data, dimensions.width, dimensions.height);
    setPositionedNodes(layout.nodes);
    setEdges(layout.edges);
    
    // Calculate critical path
    const criticalPath = findCriticalPath(data);
    setCriticalPathNodes(criticalPath);
    
    // Calculate bottlenecks
    const bottlenecks = findBottlenecks(data);
    setBottleneckNodes(bottlenecks);
  }, [data, dimensions]);
  
  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const newScale = Math.max(0.5, Math.min(2, scale + (delta > 0 ? -0.1 : 0.1)));
    setScale(newScale);
  };
  
  // Handle mouse pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan({ x: pan.x + dx, y: pan.y + dy });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Reset view
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };
  
  const isNodeInCriticalPath = (nodeId: string) => {
    return criticalPathNodes.includes(nodeId);
  };
  
  const isNodeBottleneck = (nodeId: string) => {
    return bottleneckNodes.includes(nodeId);
  };
  
  // Draw curved connector lines between nodes
  const drawConnector = (start: { x: number; y: number }, end: { x: number; y: number }, id: string, animated: boolean = false) => {
    const midY = (start.y + end.y) / 2;
    
    const path = `
      M ${start.x} ${start.y}
      C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}
    `;
    
    return (
      <path
        key={id}
        d={path}
        className={cn(
          'pipeline-connector stroke-pipeline-connector-DEFAULT fill-none',
          animated ? 'animated' : ''
        )}
        strokeWidth={1.5}
        strokeDasharray="5,5"
      />
    );
  };
  
  // Function to find node position by id
  const getNodePosition = (nodeId: string) => {
    const node = positionedNodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    return {
      x: node.position.x + 90, // Half the node width
      y: node.position.y + 50, // Half the node height
    };
  };
  
  // Render edge connections
  const renderEdges = () => {
    return edges.map(edge => {
      const sourcePos = getNodePosition(edge.source);
      const targetPos = getNodePosition(edge.target);
      
      if (!sourcePos || !targetPos) return null;
      
      const isCritical = edge.type === 'critical' || 
                        (analysisMode === 'criticalPath' && 
                         isNodeInCriticalPath(edge.source) && 
                         isNodeInCriticalPath(edge.target));
      
      return drawConnector(
        { x: sourcePos.x, y: sourcePos.y + 50 }, // Bottom of source node
        { x: targetPos.x, y: targetPos.y - 50 }, // Top of target node
        edge.id,
        isCritical
      );
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden bg-gray-50',
        className
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setScale(scale + 0.1)}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-xs"
        >
          Reset
        </button>
      </div>
      
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: dimensions.width,
          height: dimensions.height,
        }}
        className="relative transition-transform duration-100"
      >
        {/* Render edges first (beneath nodes) */}
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="absolute top-0 left-0 pointer-events-none"
        >
          {renderEdges()}
        </svg>
        
        {/* Render nodes */}
        {positionedNodes.map(node => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.position.x,
              top: node.position.y,
              transform: 'translate(0, 0)',
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}
            className="animate-fade-in"
          >
            <PipelineNodeComponent
              node={node}
              isSelected={selectedNodeId === node.id}
              isCritical={analysisMode === 'criticalPath' && isNodeInCriticalPath(node.id)}
              isBottleneck={analysisMode === 'bottlenecks' && isNodeBottleneck(node.id)}
              onClick={() => onNodeSelect?.(node.id, node)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineGraph;
