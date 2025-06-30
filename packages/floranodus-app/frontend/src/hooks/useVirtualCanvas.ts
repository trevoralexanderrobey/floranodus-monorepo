import { useMemo } from 'react';
import { Node, Edge, Viewport, getNodesBounds } from '@xyflow/react';

interface VirtualCanvasBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useVirtualCanvas = (
  nodes: Node[],
  edges: Edge[],
  viewport: Viewport,
  padding: number = 100
) => {
  const visibleElements = useMemo(() => {
    const viewportBounds: VirtualCanvasBounds = {
      x: -viewport.x / viewport.zoom - padding,
      y: -viewport.y / viewport.zoom - padding,
      width: (window.innerWidth / viewport.zoom) + (padding * 2),
      height: (window.innerHeight / viewport.zoom) + (padding * 2),
    };

    // Filter visible nodes
    const visibleNodes = nodes.filter(node => {
      const nodeBounds = {
        x: node.position.x,
        y: node.position.y,
        width: node.width || 200,
        height: node.height || 100,
      };

      return (
        nodeBounds.x < viewportBounds.x + viewportBounds.width &&
        nodeBounds.x + nodeBounds.width > viewportBounds.x &&
        nodeBounds.y < viewportBounds.y + viewportBounds.height &&
        nodeBounds.y + nodeBounds.height > viewportBounds.y
      );
    });

    // Create a set of visible node IDs for edge filtering
    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));

    // Filter visible edges (connected to at least one visible node)
    const visibleEdges = edges.filter(edge =>
      visibleNodeIds.has(edge.source) || visibleNodeIds.has(edge.target)
    );

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [nodes, edges, viewport]);

  return visibleElements;
}; 