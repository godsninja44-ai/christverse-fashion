import { assetUrl } from "@/lib/assets";
import { useState } from "react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, BookOpen, Box, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import {
  useGetChristverseProduct,
  getGetChristverseProductQueryKey,
} from "@/api";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const [size, setSize] = useState<string | null>(null);

  const { data: item, isLoading, error } = useGetChristverseProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetChristverseProductQueryKey(productId) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-6 pt-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Piece not found</h2>
        <Link href="/shop">
          <Button variant="outline">Return to the Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to the Collection
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary border border-border/50 shadow-lg flex-1">
          {item.imageUrl ? (
            <img
              src={assetUrl(item.imageUrl)}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
              <ShoppingBag className="h-16 w-16 text-primary/40" />
            </div>
          )}

          <div className="absolute top-6 left-6">
            <span className="rounded-full bg-background/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground border border-border/50 shadow-sm">
              {item.category}
            </span>
          </div>
        </div>

        <div className="space-y-8 lg:sticky lg:top-24 py-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono">
              {item.scriptureRef && (
                <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span className="text-primary font-bold">{item.scriptureRef}</span>
                </div>
              )}
              <div className="text-muted-foreground">
                Added {format(new Date(item.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Price</div>
            <div className="font-mono text-3xl font-bold text-primary">${item.price} USD</div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Size</h3>
            <div className="flex flex-wrap gap-2">
              {item.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  data-testid={`button-size-${s}`}
                  className={`px-4 py-2 rounded-lg border font-mono text-sm transition-colors ${
                    size === s
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border/50 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full gap-2 h-12 text-base"
              data-testid="button-simulated-checkout"
              onClick={() =>
                toast({
                  title: "Checkout coming soon",
                  description:
                    "This is a preview storefront — real checkout is not live yet. No payment was processed.",
                })
              }
            >
              <ShoppingBag className="h-5 w-5" />
              {size ? `Order — ${size}` : "Order"}
            </Button>
            <p className="text-xs text-muted-foreground font-mono text-center">
              Simulated checkout — no real payment is processed in this MVP.
            </p>
          </div>

          <Separator className="bg-border/40" />

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              Description
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
