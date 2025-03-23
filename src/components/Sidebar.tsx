
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  GitBranch, 
  Settings, 
  Layers, 
  AlertCircle, 
  Clock,
  Network,
  ArrowRightLeft,
  Search,
  Moon,
  Sun
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import StatusBadge from './StatusBadge';
import { PipelineNodeStatus } from '@/utils/pipelineData';

interface SidebarProps {
  className?: string;
  onAnalyze?: (type: string) => void;
  selectedNodeId?: string | null;
  selectedNodeData?: any;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className,
  onAnalyze,
  selectedNodeId,
  selectedNodeData,
  darkMode = false,
  onToggleDarkMode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const ciSystems = [
    { name: 'Jenkins', connected: true },
    { name: 'GitHub Actions', connected: true },
    { name: 'GitLab CI', connected: false },
    { name: 'Azure DevOps', connected: true },
    { name: 'CircleCI', connected: false },
  ];
  
  const filters = {
    status: ['success', 'warning', 'error', 'running', 'pending'],
    type: ['job', 'stage', 'environment'],
  };
  
  return (
    <div 
      className={cn(
        'w-[280px] border-r flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:border-gray-800',
        className
      )}
    >
      <div className="p-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search pipelines..."
            className="pl-9 dark:bg-gray-800 dark:border-gray-700"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="px-3">
          <div className="py-2">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">ANALYSIS</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-700 dark:text-gray-300 mb-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onAnalyze?.('criticalPath')}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
              Highlight Critical Path
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-700 dark:text-gray-300 mb-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onAnalyze?.('bottlenecks')}
            >
              <AlertCircle className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400" />
              Show Bottlenecks
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-gray-700 dark:text-gray-300 mb-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onAnalyze?.('resources')}
            >
              <Network className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
              Resource Utilization
            </Button>
          </div>
          
          <Separator className="my-2 dark:bg-gray-800" />
          
          <Accordion type="single" collapsible defaultValue="filters">
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center">
                  <Layers className="h-4 w-4 mr-2 dark:text-gray-300" />
                  <span className="text-sm font-medium dark:text-gray-300">Filters</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1 pb-2">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Status</h4>
                    <div className="flex flex-wrap gap-1">
                      {filters.status.map((status) => (
                        <StatusBadge 
                          key={status} 
                          status={status as PipelineNodeStatus} 
                          className="mb-1"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Type</h4>
                    <div className="space-y-1">
                      {filters.type.map((type) => (
                        <div key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`type-${type}`}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                            defaultChecked
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="systems" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 dark:text-gray-300" />
                  <span className="text-sm font-medium dark:text-gray-300">CI/CD Systems</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1 pb-2">
                  {ciSystems.map((system) => (
                    <div key={system.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`system-${system.name}`}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                          defaultChecked={system.connected}
                        />
                        <label
                          htmlFor={`system-${system.name}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {system.name}
                        </label>
                      </div>
                      <span 
                        className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          system.connected ? 
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        )}
                      >
                        {system.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="settings" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 dark:text-gray-300" />
                  <span className="text-sm font-medium dark:text-gray-300">Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-1 pb-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Auto Refresh</label>
                    <Switch 
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Show Labels</label>
                    <Switch
                      checked={showLabels}
                      onCheckedChange={setShowLabels}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</label>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={onToggleDarkMode}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {selectedNodeId && selectedNodeData && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-800">
          <h3 className="text-sm font-medium mb-2 dark:text-gray-300">Node Details</h3>
          <div className="text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">ID:</span>
              <span className="font-mono dark:text-gray-300">{selectedNodeId}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">Name:</span>
              <span className="dark:text-gray-300">{selectedNodeData.name}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">Type:</span>
              <span className="capitalize dark:text-gray-300">{selectedNodeData.type}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <StatusBadge status={selectedNodeData.status} />
            </div>
            {selectedNodeData.duration && (
              <div className="flex justify-between mb-1">
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="flex items-center dark:text-gray-300">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedNodeData.duration}s
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
