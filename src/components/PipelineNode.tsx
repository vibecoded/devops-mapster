
import React from 'react';
import { PipelineNode as PipelineNodeType } from '@/utils/pipelineData';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';
import { 
  GitBranch, 
  Server, 
  Github, 
  Circle, 
  Cloud,
  Timer,
  Cpu
} from 'lucide-react';

interface PipelineNodeProps {
  node: PipelineNodeType;
  isSelected?: boolean;
  isCritical?: boolean;
  isBottleneck?: boolean;
  onClick?: () => void;
  className?: string;
}

const PipelineNode: React.FC<PipelineNodeProps> = ({
  node,
  isSelected = false,
  isCritical = false,
  isBottleneck = false,
  onClick,
  className,
}) => {
  const getPlatformIcon = () => {
    switch (node.platform) {
      case 'jenkins':
        return <Server size={16} />;
      case 'github':
        return <Github size={16} />;
      case 'gitlab':
        return <GitBranch size={16} />;
      case 'azure':
        return <Cloud size={16} />;
      case 'circle':
        return <Circle size={16} />;
      default:
        return <Server size={16} />;
    }
  };
  
  const getTypeStyles = () => {
    switch (node.type) {
      case 'job':
        return 'border-blue-100 bg-blue-50';
      case 'stage':
        return 'border-purple-100 bg-purple-50';
      case 'environment':
        return 'border-emerald-100 bg-emerald-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };
  
  return (
    <div 
      className={cn(
        'w-[180px] h-auto min-h-[100px] rounded-lg shadow-sm overflow-hidden transition-all duration-300 p-0',
        'hover:shadow-md cursor-pointer',
        isSelected ? 'ring-2 ring-blue-400 shadow-md' : 'ring-0',
        isCritical ? 'before:absolute before:inset-0 before:border-2 before:border-amber-400 before:rounded-lg before:z-10' : '',
        isBottleneck ? 'before:absolute before:inset-0 before:border-2 before:border-rose-400 before:rounded-lg before:z-10' : '',
        className
      )}
      onClick={onClick}
    >
      <div className="relative">
        <div className={cn(
          'p-3 border-b relative',
          getTypeStyles()
        )}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              {getPlatformIcon()}
              <span>{node.platform.charAt(0).toUpperCase() + node.platform.slice(1)}</span>
            </div>
            <StatusBadge status={node.status} showLabel={false} />
          </div>
          <h3 className="font-medium text-gray-800 text-sm truncate">{node.name}</h3>
        </div>
        
        <div className="p-3 bg-white">
          {node.duration && (
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Timer size={14} className="mr-1" />
              <span>{node.duration}s</span>
            </div>
          )}
          
          {node.resources && (
            <div className="flex items-center text-xs text-gray-500">
              <Cpu size={14} className="mr-1" />
              <span>
                {node.resources.cpu} CPU / {node.resources.memory} GB
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PipelineNode;
