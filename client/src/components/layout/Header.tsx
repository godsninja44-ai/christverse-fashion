import { Link, useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/shared/WalletButton";

export function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-xl font-bold tracking-tight text-primary">ChristVerse</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/shop"
              className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/shop') ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Collection
            </Link>
            <Link 
              href="/messages" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/messages') ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Testimony Wall
            </Link>
            <Link 
              href="/fashion" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/fashion') && !location.startsWith('/fashion/mint') ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Atelier
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/fashion/mint" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              MINT WEARABLE
            </Button>
          </Link>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
