import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { AuthProvider } from './contexts/AuthContext';
import FloranodusCanvas from './components/canvas/FloranodusCanvas';
import PerformanceMonitor from './components/PerformanceMonitor';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReactFlowProvider>
          <div className="w-full h-screen bg-floranodus-bg-primary text-floranodus-text-primary">
            <FloranodusCanvas />
            <PerformanceMonitor />
          </div>
        </ReactFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 