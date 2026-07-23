export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="border-muted border-t-primary size-8 animate-spin rounded-full border-2"
        role="status"
        aria-label="Caricamento"
      />
    </div>
  );
}
