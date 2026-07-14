import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Filter, Shirt, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useListChristverseWearables } from "@/api";

const CATEGORIES = ["All", "Robes", "Streetwear", "Headwear", "Accessories", "Footwear"];

export default function Fashion() {
  const [category, setCategory] = useState<string>("All");
  const [, setLocation] = useLocation();

  const queryParams = category === "All" ? undefined : { category };
  const { data: wearables, isLoading } = useListChristverseWearables(queryParams);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/40 pb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Digital Atelier
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Visionary wearables minted by the community. Express your faith through digital fashion.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => setLocation("/fashion/mint")} className="gap-2 font-mono">
            <Sparkles className="h-4 w-4" /> MINT NEW
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : wearables?.length === 0 ? (
        <div className="text-center py-32 bg-secondary/20 rounded-3xl border border-border/40 border-dashed">
          <Shirt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">The atelier is empty</h3>
          <p className="text-muted-foreground mb-6">No wearables found in this category.</p>
          <Button onClick={() => setLocation("/fashion/mint")} variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" /> Mint the first one
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wearables?.map((item) => (
            <Link key={item.id} href={`/fashion/${item.id}`}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary mb-4 border border-border/40 group-hover:border-primary/50 transition-colors">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 p-6 text-center">
                      <div className="space-y-4">
                        <div className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center mx-auto bg-background/50 backdrop-blur-sm shadow-sm">
                          <Shirt className="h-5 w-5 text-primary/70" />
                        </div>
                        <p className="font-mono text-xs text-primary/60 font-medium uppercase tracking-widest break-words line-clamp-3">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-background/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground border border-border/50">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif font-bold text-lg leading-tight truncate">{item.name}</h3>
                    <div className="font-mono font-bold text-primary shrink-0">{item.price} CVT</div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground flex items-center justify-between">
                    <span>Creator: {item.walletAddress.slice(0, 6)}</span>
                    <span>Royalty: {item.royaltyBps / 100}%</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
