import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <Card className="max-w-md w-full p-8 border-red-100 shadow-xl text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
              <p className="text-slate-500 text-sm">
                The application encountered an unexpected error. This usually happens when a component (like the Map or Charts) fails to initialize.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-lg text-left overflow-auto max-h-32">
                <code className="text-[10px] text-red-500">{this.state.error.message}</code>
              </div>
            )}
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <RefreshCw size={16} />
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.children;
  }

  // Helper because children is not automatically attached in class components sometimes in TS
  private get children() {
    return this.props.children;
  }
}

export default ErrorBoundary;
