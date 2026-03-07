import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RotateCcw, Home, RefreshCw } from 'lucide-react';
import { clearAppLocalStorage } from '../lib/appLocalStorage';

interface Props {
  children: ReactNode;
  router?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class AppErrorBoundary extends Component<Props, State> {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReturnHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Use router navigation if available, otherwise fallback to location
    if (this.props.router) {
      try {
        this.props.router.navigate({ to: '/' });
      } catch (err) {
        console.error('Router navigation failed, using location fallback:', err);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  };

  handleResetLocalData = () => {
    if (confirm('This will clear all your local data and reset the app to defaults. Continue?')) {
      clearAppLocalStorage();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription>
                    The application encountered an unexpected error
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-mono text-sm text-destructive break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              {this.state.errorInfo && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Stack Trace
                  </summary>
                  <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap break-all">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button onClick={this.handleReturnHome} className="flex-1 gap-2">
                    <Home className="h-4 w-4" />
                    Return to Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="flex-1 gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload Page
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  onClick={this.handleResetLocalData}
                  className="w-full gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset local data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
