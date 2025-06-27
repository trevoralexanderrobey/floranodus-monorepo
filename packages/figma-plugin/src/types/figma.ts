export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fills?: any[];
  strokes?: any[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  style?: any;
}

export interface FigmaFile {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
  components: Record<string, any>;
  schemaVersion: number;
  styles: Record<string, any>;
}

export interface CreateFileRequest {
  name: string;
  pages?: {
    name: string;
    children?: FigmaNode[];
  }[];
}

export interface CreateShapeRequest {
  fileKey: string;
  pageId: string;
  shape: {
    type: "RECTANGLE" | "ELLIPSE" | "POLYGON" | "STAR" | "VECTOR";
    x: number;
    y: number;
    width: number;
    height: number;
    fills?: any[];
    strokes?: any[];
    strokeWeight?: number;
    cornerRadius?: number;
    name?: string;
  };
}

export interface FigmaFileResponse {
  document: FigmaNode;
  components: Record<string, any>;
  schemaVersion: number;
  styles: Record<string, any>;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
}

export interface CreateTextRequest {
  fileKey: string;
  pageId: string;
  text: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    characters: string;
    style?: {
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: number;
      textAlign?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
      fills?: any[];
    };
    name?: string;
  };
}

export interface UpdateNodeRequest {
  fileKey: string;
  nodeId: string;
  updates: {
    name?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fills?: any[];
    strokes?: any[];
    strokeWeight?: number;
    cornerRadius?: number;
    characters?: string;
    style?: any;
  };
}

export interface FigmaApiError {
  status: number;
  err: string;
  message?: string;
}

export interface AssetRequest {
  fileKey: string;
  nodeIds: string[];
  format: 'png' | 'jpg' | 'svg' | 'pdf';
  scale?: number;
  svg_outline_text?: boolean;
  svg_include_id?: boolean;
  svg_simplify_stroke?: boolean;
}
