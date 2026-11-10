import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[VibeSpace ErrorBoundary] Uncaught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-md bg-slate-900/90 border border-violet-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Something unexpected happened</h1>
              <p className="text-sm text-slate-400 mt-1">
                VibeSpace intercepted a runtime glitch without crashing the entire session.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs font-mono text-rose-300 max-h-32 overflow-y-auto">
                {this.state.error.message || 'Unknown runtime error'}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
