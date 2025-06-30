import { Handle, Position, NodeProps } from '@xyflow/react';
import { memo, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  icon?: LucideIcon;
  description?: string;
  type: 'ai' | 'design' | 'data' | 'control';
  status?: 'idle' | 'processing' | 'success' | 'error';
}

interface BaseNodeProps extends NodeProps {
  data: BaseNodeData;
  children?: ReactNode;
}

const BaseNode = memo(({ data, selected, children }: BaseNodeProps) => {
  const IconComponent = data.icon;
  const statusColors = {
    idle: 'border-floranodus-border',
    processing: 'border-floranodus-accent-primary animate-pulse',
    success: 'border-floranodus-success',
    error: 'border-floranodus-error'
  };

  return (
    <div className={`
      floranodus-node
      ${selected ? 'selected' : ''}
      ${statusColors[data.status || 'idle']}
    `}>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-floranodus-accent-primary !w-3 !h-3"
      />
      
      <div className="flex items-center gap-2 mb-2">
        {IconComponent && <IconComponent size={16} className="text-floranodus-accent-primary" />}
        <span className="font-medium text-sm">{data.label}</span>
      </div>
      
      {data.description && (
        <p className="text-xs text-floranodus-text-secondary mb-2">
          {data.description}
        </p>
      )}
      
      {children}
      
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-floranodus-accent-primary !w-3 !h-3"
      />
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
export default BaseNode; 