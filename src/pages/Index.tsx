
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PipelineGraph from '@/components/PipelineGraph';
import { 
  samplePipelineData, 
  PipelineNode,
  generateExpandedData
} from '@/utils/pipelineData';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [pipelineData, setPipelineData] = useState(samplePipelineData);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<PipelineNode | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'none' | 'criticalPath' | 'bottlenecks' | 'resources'>('none');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Simulate loading pipeline data
  const loadPipelineData = () => {
    setLoading(true);
    setSelectedNodeId(null);
    setSelectedNodeData(null);
    
    // Simulate API fetch with timeout
    setTimeout(() => {
      setPipelineData(samplePipelineData);
      setLoading(false);
      setAnalysisMode('none');
      
      toast({
        title: "Pipeline data refreshed",
        description: "Visualization has been updated with the latest data.",
        duration: 3000,
      });
    }, 1000);
  };
  
  // Load expanded data set
  const loadExpandedData = () => {
    setLoading(true);
    setSelectedNodeId(null);
    setSelectedNodeData(null);
    
    // Simulate API fetch with timeout
    setTimeout(() => {
      setPipelineData(generateExpandedData());
      setLoading(false);
      setAnalysisMode('none');
      
      toast({
        title: "Expanded pipeline view",
        description: "Showing a more complex pipeline configuration.",
        duration: 3000,
      });
    }, 1000);
  };
  
  // Handle node selection
  const handleNodeSelect = (nodeId: string, node: PipelineNode) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeData(node);
    
    toast({
      title: `Selected: ${node.name}`,
      description: `Status: ${node.status}, Type: ${node.type}`,
      duration: 2000,
    });
  };
  
  // Handle analysis mode changes
  const handleAnalysis = (type: string) => {
    if (type === 'criticalPath') {
      setAnalysisMode('criticalPath');
      toast({
        title: "Critical Path Analysis",
        description: "Highlighting the critical path in the pipeline that affects overall duration.",
        duration: 3000,
      });
    } else if (type === 'bottlenecks') {
      setAnalysisMode('bottlenecks');
      toast({
        title: "Bottleneck Analysis",
        description: "Highlighting the pipeline steps that are causing delays.",
        duration: 3000,
      });
    } else if (type === 'resources') {
      setAnalysisMode('resources');
      toast({
        title: "Resource Utilization",
        description: "Analyzing resource usage across pipeline components.",
        duration: 3000,
      });
    } else {
      setAnalysisMode('none');
    }
  };
  
  // Handle view changes
  const handleViewChange = (view: string) => {
    if (view === 'detailed') {
      loadExpandedData();
    } else {
      loadPipelineData();
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Initial data load
  useEffect(() => {
    loadPipelineData();
  }, []);
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        onAnalyze={handleAnalysis}
        selectedNodeId={selectedNodeId}
        selectedNodeData={selectedNodeData}
        onToggleDarkMode={toggleDarkMode}
        darkMode={theme === 'dark'}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onRefresh={loadPipelineData}
          onChangeView={handleViewChange}
        />
        
        <main className="flex-1 overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading pipeline data...</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full">
              <PipelineGraph
                data={pipelineData}
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNodeId}
                analysisMode={analysisMode}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
