import { NodeProps } from '@xyflow/react';
import { Figma, ExternalLink, RefreshCw } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState } from 'react';
import { useFigmaSync } from '@/hooks/useFigmaSync';

export interface DesignNodeData extends BaseNodeData {
  figmaNodeId?: string;
  figmaFileKey?: string;
  lastSynced?: Date;
}

interface DesignNodeProps extends NodeProps {
  data: DesignNodeData;
}

const DesignNode = (props: DesignNodeProps) => {
  const { id, data } = props;
  const [isSyncing, setIsSyncing] = useState(false);
  const { syncFromFigma, syncToFigma } = useFigmaSync();

  const handleSyncFromFigma = async () => {
    setIsSyncing(true);
    try {
      await syncFromFigma(data.figmaFileKey!, data.figmaNodeId!);
    } catch (error) {
      console.error('Sync failed:', error);
    }
    setIsSyncing(false);
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Figma,
        type: 'design',
        status: isSyncing ? 'processing' : data.status
      }}
    >
      <div className="space-y-2">
        {data.figmaNodeId ? (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-floranodus-text-secondary">Figma Node</span>
              <a
                href={`https://www.figma.com/file/${data.figmaFileKey}?node-id=${data.figmaNodeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-floranodus-accent-primary hover:underline flex items-center gap-1"
              >
                Open <ExternalLink size={10} />
              </a>
            </div>
            <button
              onClick={handleSyncFromFigma}
              disabled={isSyncing}
              className="w-full bg-floranodus-bg-tertiary hover:bg-floranodus-bg-tertiary/80 border border-floranodus-border rounded p-1 text-xs transition-colors flex items-center justify-center gap-1"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              Sync from Figma
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-floranodus-text-secondary mb-2">
              No Figma node connected
            </p>
            <button className="text-xs text-floranodus-accent-primary hover:underline">
              Connect Figma Node
            </button>
          </div>
        )}
        
        {data.lastSynced && (
          <p className="text-xs text-floranodus-text-secondary text-center">
            Last synced: {new Date(data.lastSynced).toLocaleTimeString()}
          </p>
        )}
      </div>
    </BaseNode>
  );
};

export default DesignNode; 