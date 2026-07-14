export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-lg font-bold text-primary">ChristVerse</span>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              A digital atelier and testimony wall for modern believers.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-mono text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Simulated Blockchain — Preview
            </div>
            <p className="text-xs max-w-sm text-center md:text-right mt-2">
              All transactions, wallets, and CVT tokens in this MVP are simulated. 
              No real funds are used. Hashes are real SHA-256.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
