import { useGetChristverseStats } from "@/api";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, MessageSquareText, Shirt, ShoppingBag } from "lucide-react";

export default function Home() {
  const { data: stats, isLoading } = useGetChristverseStats();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-8 font-mono animate-in fade-in slide-in-from-bottom-4 duration-700">
            ChristVerse Fashion Universe
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Faith in the <br/> <span className="text-primary italic">Digital Age</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            One Christ-centered universe: physical clothing anchored in Scripture, a digital atelier for visionary believers, and a permanent wall of testimonies.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
            <Link href="/shop">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                <ShoppingBag className="h-5 w-5" />
                Shop the Collection
              </Button>
            </Link>
            <Link href="/fashion">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                <Shirt className="h-5 w-5" />
                Explore Atelier
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-8">
                <MessageSquareText className="h-5 w-5" />
                Read Testimonies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/40 bg-secondary/30 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-border/40 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-mono text-4xl font-light text-primary">
                {isLoading ? <Skeleton className="h-10 w-20" /> : stats?.totalProducts || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pieces</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-mono text-4xl font-light text-primary">
                {isLoading ? <Skeleton className="h-10 w-20" /> : stats?.totalMessages || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Testimonies</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-mono text-4xl font-light text-primary">
                {isLoading ? <Skeleton className="h-10 w-20" /> : stats?.totalWearables || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Wearables</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-mono text-4xl font-light text-primary">
                {isLoading ? <Skeleton className="h-10 w-20" /> : stats?.totalCreators || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Creators</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="font-mono text-4xl font-light text-primary">
                {isLoading ? <Skeleton className="h-10 w-20" /> : stats?.tipVolume || 0}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">CVT Tipped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold">The Collection</h2>
              <p className="text-lg text-muted-foreground">
                Physical clothing anchored in Scripture — tees, hoodies, and headwear
                designed to carry the message into the real world.
              </p>
              <Link href="/shop">
                <Button variant="link" className="px-0 text-primary hover:text-primary/80 gap-2">
                  Shop the collection <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                <MessageSquareText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold">The Testimony Wall</h2>
              <p className="text-lg text-muted-foreground">
                In a world of fleeting content, carve your testimony into something permanent. 
                Every message is anchored by a cryptographic hash, creating an immutable record of faith.
              </p>
              <Link href="/messages">
                <Button variant="link" className="px-0 text-primary hover:text-primary/80 gap-2">
                  Browse the wall <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-2xl">
                <Shirt className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold">The Digital Atelier</h2>
              <p className="text-lg text-muted-foreground">
                Design and mint visionary wearables. From streetwear to holy robes, express your 
                spirituality through digital fashion. Earn royalties when others tip your creations.
              </p>
              <Link href="/fashion">
                <Button variant="link" className="px-0 text-primary hover:text-primary/80 gap-2">
                  Enter the atelier <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
