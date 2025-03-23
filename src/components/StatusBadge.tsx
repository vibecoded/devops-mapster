
import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import { PipelineNodeStatus } from '@/utils/pipelineData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: PipelineNodeStatus;
  showLabel?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showLabel = true,
  className 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-pipeline-status-success',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          label: 'Success'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-pipeline-status-warning',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          label: 'Warning'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-pipeline-status-error',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
          label: 'Failed'
        };
      case 'running':
        return {
          icon: Play,
          color: 'text-pipeline-status-running',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100',
          label: 'Running',
          animate: 'animate-pulse-subtle'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-pipeline-status-pending',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100',
          label: 'Pending'
        };
      default:
        return {
          icon: HelpCircle,
          color: 'text-pipeline-status-unknown',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bgColor,
        config.borderColor,
        'border',
        className
      )}
    >
      <Icon 
        size={14} 
        className={cn(
          'mr-1',
          config.color,
          config.animate
        )} 
      />
      {showLabel && (
        <span className="text-gray-700">{config.label}</span>
      )}
    </div>
  );
};

export default StatusBadge;
