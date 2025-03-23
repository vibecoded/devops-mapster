
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
          color: 'text-pipeline-status-success dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-100 dark:border-green-800/50',
          label: 'Success'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'text-pipeline-status-warning dark:text-amber-400',
          bgColor: 'bg-amber-50 dark:bg-amber-950/30',
          borderColor: 'border-amber-100 dark:border-amber-800/50',
          label: 'Warning'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-pipeline-status-error dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          borderColor: 'border-red-100 dark:border-red-800/50',
          label: 'Failed'
        };
      case 'running':
        return {
          icon: Play,
          color: 'text-pipeline-status-running dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
          borderColor: 'border-blue-100 dark:border-blue-800/50',
          label: 'Running',
          animate: 'animate-pulse-subtle'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-pipeline-status-pending dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800/30',
          borderColor: 'border-gray-100 dark:border-gray-700',
          label: 'Pending'
        };
      default:
        return {
          icon: HelpCircle,
          color: 'text-pipeline-status-unknown dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800/30',
          borderColor: 'border-gray-100 dark:border-gray-700',
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
        <span className="text-gray-700 dark:text-gray-300">{config.label}</span>
      )}
    </div>
  );
};

export default StatusBadge;
