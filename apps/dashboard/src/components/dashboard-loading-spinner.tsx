export function DashboardLoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary"
      >
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
