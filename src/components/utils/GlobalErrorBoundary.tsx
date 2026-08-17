import { Component, Fragment, type ErrorInfo, type ReactNode } from 'react';

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  resetKeys?: readonly unknown[];
  onError?: (error: Error, errorInfo: ErrorInfo, incidentId: string) => void;
}

interface GlobalErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  incidentId: string | null;
  resetVersion: number;
}

const resetKeysChanged = (
  previous: readonly unknown[] = [],
  current: readonly unknown[] = []
): boolean => previous.length !== current.length || previous.some((value, index) => !Object.is(value, current[index]));

const createIncidentId = (): string =>
  `UI-${Date.now().toString(36).toUpperCase()}`;

class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = {
    error: null,
    errorInfo: null,
    incidentId: null,
    resetVersion: 0
  };

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return {
      error,
      incidentId: createIncidentId()
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const incidentId = this.state.incidentId ?? createIncidentId();

    console.error('[GlobalErrorBoundary] Error de renderizado', {
      incidentId,
      error,
      componentStack: errorInfo.componentStack
    });

    this.setState({ errorInfo, incidentId });
    this.props.onError?.(error, errorInfo, incidentId);
  }

  componentDidUpdate(previousProps: GlobalErrorBoundaryProps): void {
    if (this.state.error && resetKeysChanged(previousProps.resetKeys, this.props.resetKeys)) {
      this.resetBoundary();
    }
  }

  private resetBoundary = (): void => {
    this.setState(previous => ({
      error: null,
      errorInfo: null,
      incidentId: null,
      resetVersion: previous.resetVersion + 1
    }));
  };

  private goToDashboard = (): void => {
    this.resetBoundary();
    window.location.assign('/dashboard');
  };

  private reloadPage = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { error, errorInfo, incidentId, resetVersion } = this.state;

    if (!error) {
      return <Fragment key={resetVersion}>{this.props.children}</Fragment>;
    }

    return (
      <main
        role="alert"
        aria-live="assertive"
        className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10"
      >
        <section className="w-full max-w-2xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-600">
            Error inesperado
          </p>
          <h1 className="mb-3 text-2xl font-bold text-slate-900">
            No se pudo mostrar esta pantalla
          </h1>
          <p className="mx-auto mb-2 max-w-xl text-slate-600">
            La aplicación encontró un problema de renderizado. Puedes reintentar, volver al inicio o recargar la página.
          </p>
          {incidentId && (
            <p className="mb-6 text-sm text-slate-500">
              Código de referencia: <strong>{incidentId}</strong>
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.resetBoundary}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={this.goToDashboard}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Volver al inicio
            </button>
            <button
              type="button"
              onClick={this.reloadPage}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Recargar página
            </button>
          </div>

          {import.meta.env.DEV && (
            <details className="mt-6 rounded-lg bg-slate-900 p-4 text-left text-sm text-slate-100">
              <summary className="cursor-pointer font-semibold">Detalles técnicos</summary>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs">
                {error.stack ?? error.message}
                {errorInfo?.componentStack ? `\n\nComponent stack:${errorInfo.componentStack}` : ''}
              </pre>
            </details>
          )}
        </section>
      </main>
    );
  }
}

export default GlobalErrorBoundary;
