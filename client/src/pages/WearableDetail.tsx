import { useState } from "react";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { ArrowLeft, Box, Hash, Palette, Shirt, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
  useGetChristverseWearable,
  getGetChristverseWearableQueryKey,
} from "@/api";

export default function WearableDetail() {
  const { id } = useParams();
  const wearableId = parseInt(id || "0", 10);

  const { data: item, isLoading, error } = useGetChristverseWearable(wearableId, {
    query: { enabled: !!wearableId, queryKey: getGetChristverseWearableQueryKey(wearableId) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
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
        <h2 className="text-2xl font-bold mb-4">Wearable not found</h2>
        <Link href="/fashion">
          <Button variant="outline">Return to Atelier</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/fashion" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Atelier
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-start">
        {/* Visual representation */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary border border-border/50 shadow-lg flex-1">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-12 text-center">
              <div className="space-y-6">
                <div className="h-24 w-24 rounded-full border border-primary/20 flex items-center justify-center mx-auto bg-background/50 backdrop-blur-sm shadow-md">
                  <Shirt className="h-10 w-10 text-primary/70" />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-xs font-bold text-primary uppercase tracking-widest">Digital Garment</p>
                  <h2 className="font-serif text-3xl font-bold text-foreground leading-tight">
                    {item.name}
                  </h2>
                </div>
              </div>
            </div>
          )}
          
          <div className="absolute top-6 left-6">
            <span className="rounded-full bg-background/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground border border-border/50 shadow-sm">
              {item.category}
            </span>
          </div>
        </div>

        {/* Details panel */}
        <div className="space-y-10 lg:sticky lg:top-24 py-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {item.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono">
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
                <span className="text-foreground">Created by</span>
                <span className="text-primary font-bold">{item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}</span>
              </div>
              <div className="text-muted-foreground">
                Minted {format(new Date(item.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">List Price</div>
              <div className="font-mono text-3xl font-bold text-primary">{item.price} CVT</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Creator Royalty</div>
              <div className="font-mono text-xl font-bold text-foreground">{item.royaltyBps / 100}%</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" /> 
              Description
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {item.prompt && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" /> 
                Design Prompt
              </h3>
              <div className="rounded-xl bg-secondary/30 p-4 border border-border/40 font-mono text-sm text-foreground/80 italic leading-relaxed">
                "{item.prompt}"
              </div>
            </div>
          )}

          <Separator className="bg-border/40" />

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" /> On-Chain Data
            </h3>
            <div className="rounded-xl bg-card border border-border/40 p-4 font-mono text-xs space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Token ID <span className="bg-destructive/10 text-destructive text-[9px] px-1 py-0.5 rounded font-bold uppercase ml-2">Simulated</span></span>
                <span className="text-foreground font-medium break-all">{item.tokenId}</span>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Mint Tx <span className="bg-destructive/10 text-destructive text-[9px] px-1 py-0.5 rounded font-bold uppercase ml-2">Simulated</span></span>
                <span className="text-foreground font-medium break-all">{item.txId}</span>
              </div>
              <Separator className="bg-border/40" />
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground flex items-center gap-1"><Hash className="h-3 w-3" /> Content Hash (Real)</span>
                <span className="text-foreground font-medium break-all">{item.contentHash}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
