import React from 'react';
import { usePhysicaStore } from '@/state/store';

interface State {
  hasError: boolean;
  message: string;
}

export class WorldErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(): void {
    // Gracefully fall back to 2D Catalog Mode while preserving active book & page!
    usePhysicaStore.getState().setViewMode('catalog');
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
