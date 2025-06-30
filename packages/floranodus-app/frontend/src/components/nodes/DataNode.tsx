import { NodeProps } from '@xyflow/react';
import { Database, Upload, Download } from 'lucide-react';
import BaseNode, { BaseNodeData } from './BaseNode';
import { useState } from 'react';

export interface DataNodeData extends BaseNodeData {
  dataType?: 'json' | 'csv' | 'image' | 'text';
  content?: any;
  preview?: string;
}

interface DataNodeProps extends NodeProps {
  data: DataNodeData;
}

const DataNode = (props: DataNodeProps) => {
  const { id, data } = props;
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // TODO: Implement file processing
    }
  };

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        icon: Database,
        type: 'data'
      }}
    >
      <div className="space-y-2">
        <select
          className="w-full bg-floranodus-bg-tertiary border border-floranodus-border rounded p-1 text-xs"
          value={data.dataType || 'json'}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="image">Image</option>
          <option value="text">Text</option>
        </select>

        {data.content ? (
          <>
            <div className="bg-floranodus-bg-tertiary rounded p-2 text-xs max-h-32 overflow-auto">
              {showPreview ? (
                <pre className="whitespace-pre-wrap">
                  {data.preview || JSON.stringify(data.content, null, 2)}
                </pre>
              ) : (
                <p className="text-floranodus-text-secondary">
                  Data loaded ({data.dataType})
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 bg-floranodus-bg-tertiary hover:bg-floranodus-bg-tertiary/80 border border-floranodus-border rounded p-1 text-xs"
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button className="p-1 bg-floranodus-bg-tertiary hover:bg-floranodus-bg-tertiary/80 border border-floranodus-border rounded">
                <Download size={12} />
              </button>
            </div>
          </>
        ) : (
          <label className="block">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept={data.dataType === 'image' ? 'image/*' : '*'}
            />
            <div className="border-2 border-dashed border-floranodus-border rounded p-4 text-center cursor-pointer hover:border-floranodus-accent-primary transition-colors">
              <Upload size={16} className="mx-auto mb-2 text-floranodus-text-secondary" />
              <p className="text-xs text-floranodus-text-secondary">
                Click to upload {data.dataType}
              </p>
            </div>
          </label>
        )}
      </div>
    </BaseNode>
  );
};

export default DataNode; 