import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Alterra React Error Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center font-mono">
          <div className="max-w-2xl w-full bg-slate-900/90 border border-rose-500/50 p-6 rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400 mb-2">Simulation Rendering Exception</h2>
            <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded border border-slate-800 break-words">
              {this.state.error?.toString()}
            </p>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-[10px] text-slate-500 bg-slate-950 p-3 rounded overflow-auto max-h-40 mb-4">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs tracking-wider uppercase transition-colors"
            >
              Reload Simulation
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
