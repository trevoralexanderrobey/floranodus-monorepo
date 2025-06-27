export interface CommandResult {
  commandId: string;
  result: {
    success: boolean;
    data?: any;
    error?: string;
  };
}

export interface QueuedCommand {
  id: string;
  type: string;
  tool?: string;
  payload: any;
  timestamp: number;
}

export interface TunnelInfo {
  tunnelUrl: string | null;
  hasTunnel: boolean;
  timestamp: number;
}

export interface HealthResponse {
  status: string;
  unified: boolean;
  timestamp: number;
  message: string;
  tunnelUrl: string | null;
}

export interface StatusResponse {
  server: string;
  status: string;
  mode: string;
  tunnelUrl: string | null;
  timestamp: number;
  uptime: number;
  endpoints: string[];
}

export interface MCPToolRequest {
  tool: string;
  fileKey?: string;
  nodeIds?: string[];
  designSystem?: any;
  components?: any[];
  organizationType?: string;
  optimizationType?: string;
  variableTypes?: string[];
  [key: string]: any;
}

export interface CreateNodesRequest {
  fileKey: string;
  code: string;
  framework?: string;
  x?: number;
  y?: number;
}

export interface CreateNodeRequest {
  nodeType?: string;
  properties?: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    name?: string;
    [key: string]: any;
  };
}

export interface DesignPreviewRequest {
  description: string;
  style?: string;
  layout?: string;
}

export interface CodeConnectionsRequest {
  nodeIds: string[];
  codeInfo: {
    componentName: string;
    filePath: string;
    repository?: string;
    framework?: string;
  };
}

export interface UIKitRequest {
  kitType?: string;
  designSystem?: {
    colorPalette?: any;
    typography?: any;
    spacing?: any;
    shadows?: any;
    borderRadius?: any;
  };
  components?: string[];
}

export interface SmartOrganizeRequest {
  nodeIds: string[];
  organizationType?: 'proximity' | 'similarity' | 'hierarchy' | 'functionality';
  options?: {
    proximityThreshold?: number;
    similarityThreshold?: number;
    containerTypes?: string[];
  };
}

export interface OrganizePagesRequest {
  organizationType?: 'category' | 'workflow' | 'hierarchy';
  naming?: {
    prefix?: string;
    pattern?: string;
  };
}

export interface OptimizeMediaRequest {
  mediaType?: 'images' | 'videos' | 'all';
  optimizationType?: 'compress' | 'format' | 'resolution';
  placementConfig?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  };
}

export interface ExtractVariablesRequest {
  variableTypes?: ('colors' | 'typography' | 'spacing' | 'effects')[];
  nodeIds?: string[];
  scope?: 'selection' | 'page' | 'document';
}

export interface FigmaNodeConfig {
  type: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  name?: string;
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  cornerRadius?: number;
  [key: string]: any;
}

export interface ServerResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type CommandType = 
  | 'CREATE_NODES_FROM_CODE'
  | 'CREATE_NODE'
  | 'FIGMA_TOOL'
  | 'DESIGN_PREVIEW'
  | 'CODE_CONNECTIONS'
  | 'GENERATE_UI_KIT'
  | 'SMART_ORGANIZE'
  | 'ORGANIZE_PAGES'
  | 'OPTIMIZE_MEDIA'
  | 'EXTRACT_VARIABLES'
  | 'CREATE_WIREFRAME'
  | 'CREATE_UI_KIT';

export interface BridgeServer {
  start(): void;
}

export interface PluginConnection {
  sendPing(): Promise<void>;
  checkCommands(): Promise<void>;
  processCommands(commands: QueuedCommand[]): Promise<void>;
  sendResults(results: CommandResult[]): Promise<void>;
} 