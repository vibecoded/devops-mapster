
export type PipelineNodeStatus = 'success' | 'warning' | 'error' | 'running' | 'pending' | 'unknown';

export interface PipelineNode {
  id: string;
  name: string;
  type: 'job' | 'stage' | 'environment';
  status: PipelineNodeStatus;
  platform: 'jenkins' | 'github' | 'gitlab' | 'azure' | 'circle';
  duration?: number; // in seconds
  startTime?: string;
  endTime?: string;
  resources?: {
    cpu: number;
    memory: number;
  };
  metadata?: Record<string, any>;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
  type?: 'default' | 'critical' | 'optional';
}

export interface PipelineData {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

// Sample pipeline data for visualization
export const samplePipelineData: PipelineData = {
  nodes: [
    {
      id: 'build-1',
      name: 'Build Backend',
      type: 'job',
      status: 'success',
      platform: 'github',
      duration: 245,
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'build-2',
      name: 'Build Frontend',
      type: 'job',
      status: 'success',
      platform: 'github',
      duration: 187,
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'test-1',
      name: 'Unit Tests',
      type: 'job',
      status: 'success',
      platform: 'github',
      duration: 132,
      resources: {
        cpu: 1,
        memory: 2,
      },
    },
    {
      id: 'test-2',
      name: 'Integration Tests',
      type: 'job',
      status: 'warning',
      platform: 'jenkins',
      duration: 368,
      resources: {
        cpu: 4,
        memory: 8,
      },
    },
    {
      id: 'test-3',
      name: 'UI Tests',
      type: 'job',
      status: 'error',
      platform: 'jenkins',
      duration: 421,
      resources: {
        cpu: 2,
        memory: 6,
      },
    },
    {
      id: 'deploy-1',
      name: 'Deploy to Staging',
      type: 'environment',
      status: 'pending',
      platform: 'azure',
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'deploy-2',
      name: 'Deploy to Production',
      type: 'environment',
      status: 'pending',
      platform: 'azure',
      resources: {
        cpu: 4,
        memory: 8,
      },
    },
    {
      id: 'security-1',
      name: 'Security Scan',
      type: 'job',
      status: 'running',
      platform: 'gitlab',
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'perf-1',
      name: 'Performance Tests',
      type: 'job',
      status: 'pending',
      platform: 'circle',
      resources: {
        cpu: 8,
        memory: 16,
      },
    },
  ],
  edges: [
    {
      id: 'e1-3',
      source: 'build-1',
      target: 'test-1',
      type: 'default',
    },
    {
      id: 'e1-4',
      source: 'build-1',
      target: 'test-2',
      type: 'default',
    },
    {
      id: 'e2-3',
      source: 'build-2',
      target: 'test-1',
      type: 'default',
    },
    {
      id: 'e2-5',
      source: 'build-2',
      target: 'test-3',
      type: 'default',
    },
    {
      id: 'e3-6',
      source: 'test-1',
      target: 'deploy-1',
      type: 'critical',
    },
    {
      id: 'e4-6',
      source: 'test-2',
      target: 'deploy-1',
      type: 'critical',
    },
    {
      id: 'e5-6',
      source: 'test-3',
      target: 'deploy-1',
      type: 'critical',
    },
    {
      id: 'e6-7',
      source: 'deploy-1',
      target: 'deploy-2',
      type: 'critical',
    },
    {
      id: 'e1-8',
      source: 'build-1',
      target: 'security-1',
      type: 'optional',
    },
    {
      id: 'e2-8',
      source: 'build-2',
      target: 'security-1',
      type: 'optional',
    },
    {
      id: 'e6-9',
      source: 'deploy-1',
      target: 'perf-1',
      type: 'optional',
    },
    {
      id: 'e9-7',
      source: 'perf-1',
      target: 'deploy-2',
      type: 'optional',
    },
  ],
};

// Platforms data with icons and colors
export const platformInfo = {
  jenkins: {
    name: 'Jenkins',
    icon: 'server',
    color: '#335061',
  },
  github: {
    name: 'GitHub Actions',
    icon: 'github',
    color: '#2088FF',
  },
  gitlab: {
    name: 'GitLab CI/CD',
    icon: 'git-branch',
    color: '#FC6D26',
  },
  azure: {
    name: 'Azure DevOps',
    icon: 'cloud',
    color: '#0078D7',
  },
  circle: {
    name: 'CircleCI',
    icon: 'circle',
    color: '#343434',
  },
};

// Status helper functions
export const getStatusColor = (status: PipelineNodeStatus): string => {
  const statusColors = {
    success: 'pipeline-status-success',
    warning: 'pipeline-status-warning',
    error: 'pipeline-status-error',
    running: 'pipeline-status-running',
    pending: 'pipeline-status-pending',
    unknown: 'pipeline-status-unknown',
  };
  
  return statusColors[status] || statusColors.unknown;
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  return `${minutes}m ${remainingSeconds}s`;
};

// Generate expanded data for demonstration
export const generateExpandedData = (): PipelineData => {
  const baseData = samplePipelineData;
  const expandedNodes = [...baseData.nodes];
  const expandedEdges = [...baseData.edges];
  
  // Add more nodes for a more complex visualization
  const additionalNodes: PipelineNode[] = [
    {
      id: 'build-3',
      name: 'Build Mobile App',
      type: 'job',
      status: 'success',
      platform: 'github',
      duration: 203,
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'test-4',
      name: 'Mobile Tests',
      type: 'job',
      status: 'success',
      platform: 'github',
      duration: 156,
      resources: {
        cpu: 2,
        memory: 4,
      },
    },
    {
      id: 'deploy-3',
      name: 'Deploy to Beta',
      type: 'environment',
      status: 'success',
      platform: 'azure',
      duration: 78,
      resources: {
        cpu: 1,
        memory: 2,
      },
    },
    {
      id: 'security-2',
      name: 'Dependency Scan',
      type: 'job',
      status: 'warning',
      platform: 'gitlab',
      duration: 194,
      resources: {
        cpu: 1,
        memory: 2,
      },
    },
    {
      id: 'analyze-1',
      name: 'Code Quality',
      type: 'job',
      status: 'success',
      platform: 'gitlab',
      duration: 87,
      resources: {
        cpu: 1,
        memory: 1,
      },
    },
  ];
  
  // Add additional edges
  const additionalEdges: PipelineEdge[] = [
    {
      id: 'e3-10',
      source: 'build-3',
      target: 'test-4',
      type: 'default',
    },
    {
      id: 'e10-11',
      source: 'test-4',
      target: 'deploy-3',
      type: 'default',
    },
    {
      id: 'e11-7',
      source: 'deploy-3',
      target: 'deploy-2',
      type: 'optional',
    },
    {
      id: 'e1-12',
      source: 'build-1',
      target: 'security-2',
      type: 'optional',
    },
    {
      id: 'e2-12',
      source: 'build-2',
      target: 'security-2',
      type: 'optional',
    },
    {
      id: 'e3-12',
      source: 'build-3',
      target: 'security-2',
      type: 'optional',
    },
    {
      id: 'e1-13',
      source: 'build-1',
      target: 'analyze-1',
      type: 'optional',
    },
    {
      id: 'e2-13',
      source: 'build-2',
      target: 'analyze-1',
      type: 'optional',
    },
    {
      id: 'e3-13',
      source: 'build-3',
      target: 'analyze-1',
      type: 'optional',
    },
  ];
  
  return {
    nodes: [...expandedNodes, ...additionalNodes],
    edges: [...expandedEdges, ...additionalEdges],
  };
};
