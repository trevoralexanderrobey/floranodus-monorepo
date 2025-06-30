import { Plus, Save, Upload } from 'lucide-react';

const CanvasControls = () => {
  return (
    <div className="bg-floranodus-bg-secondary border border-floranodus-border rounded-lg p-2 shadow-lg">
      <div className="flex gap-2">
        <button className="p-2 bg-floranodus-bg-tertiary hover:bg-floranodus-accent-primary rounded text-floranodus-text-primary transition-colors">
          <Plus size={16} />
        </button>
        <button className="p-2 bg-floranodus-bg-tertiary hover:bg-floranodus-accent-primary rounded text-floranodus-text-primary transition-colors">
          <Save size={16} />
        </button>
        <button className="p-2 bg-floranodus-bg-tertiary hover:bg-floranodus-accent-primary rounded text-floranodus-text-primary transition-colors">
          <Upload size={16} />
        </button>
      </div>
    </div>
  );
};

export default CanvasControls; 