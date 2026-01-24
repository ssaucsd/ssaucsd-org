export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-blob" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-blob [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/8 rounded-full blur-3xl -z-10 animate-blob [animation-delay:4s]" />

      {/* Loading Spinner */}
      <div className="relative animate-in fade-in zoom-in duration-500">
        {/* Outer Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-muted" />

        {/* Spinning Gradient Arc */}
        <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary animate-spin" />

        {/* Inner Pulsing Dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <p className="text-lg font-medium text-foreground">Loading</p>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
