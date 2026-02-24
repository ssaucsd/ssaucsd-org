export default function NewsletterForm() {
  return (
    <div className="w-full max-w-md mx-auto mb-6 p-6 md:p-8 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 backdrop-blur-sm shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
        <p className="text-sm text-primary-foreground/70">
          Join our mailing list to receive our member newsletter.
        </p>
      </div>
      <a
        href="http://eepurl.com/jz_Srw"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-secondary/20 transition-all duration-300 rounded-md inline-flex items-center justify-center"
      >
        Subscribe to Newsletter
      </a>
    </div>
  );
}
