import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home, File01Icon } from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-blob [animation-delay:2000ms]" />

      <div className="flex flex-col items-center max-w-md text-center space-y-8 z-10 animate-in fade-in zoom-in duration-500">
        {/* Icon & 404 Display */}
        <div className="relative">
          <div className="text-[150px] font-bold font-serif leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-primary via-primary/80 to-primary/40 select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-4 rounded-full shadow-lg border border-border/50 rotate-12">
            <HugeiconsIcon
              icon={File01Icon}
              className="w-12 h-12 text-primary"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been removed, renamed, or doesn&apos;t exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/" passHref>
            <Button size="lg" className="w-full sm:w-auto gap-2 group">
              <HugeiconsIcon
                icon={Home}
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              Back to Home
            </Button>
          </Link>
          {/* We could add a 'Go Back' button using router.back() but that requires client component. 
                Keep it simple with server component for now, or make it use 'client' if strictly needed. 
                Home is usually enough for 404. */}
        </div>
      </div>

      {/* Footer / Copyright or Branding */}
      <div className="absolute bottom-8 text-center text-sm text-muted-foreground opacity-50">
        SSA at UCSD
      </div>
    </div>
  );
}
