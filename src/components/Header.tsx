
import React from 'react';
import { 
  GitBranch, 
  Settings, 
  RefreshCw, 
  Layers, 
  Filter,
  Share,
  Zap
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onRefresh?: () => void;
  onChangeView?: (view: string) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onRefresh, 
  onChangeView,
  className 
}) => {
  return (
    <header className={`w-full bg-white border-b border-gray-200 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <GitBranch className="h-5 w-5 text-blue-600 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">DevOps Pipeline Visualizer</h1>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Layers className="h-4 w-4" />
                  <span>main</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>main</DropdownMenuItem>
                <DropdownMenuItem>develop</DropdownMenuItem>
                <DropdownMenuItem>feature/new-ui</DropdownMenuItem>
                <DropdownMenuItem>hotfix/auth-bug</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1" 
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </Button>
            
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Zap className="h-4 w-4" />
                  <span>Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onChangeView?.('standard')}>Standard View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeView?.('detailed')}>Detailed View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeView?.('compact')}>Compact View</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Highlight Critical Path</DropdownMenuItem>
                <DropdownMenuItem>Show Bottlenecks</DropdownMenuItem>
                <DropdownMenuItem>Analyze Resource Usage</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
