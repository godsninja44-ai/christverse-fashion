import { assetUrl } from "@/lib/assets";
import { useState } from "react";
import { Link } from "wouter";
import { Filter, ShoppingBag, BookOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useListChristverseProducts } from "@/api";

const CATEGORIES = ["All", "Tees", "Hoodies", "Headwear", "Accessories"];

export default function Shop() {
  const [category, setCategory] = useState<string>("All");

  const queryParams = category === "All" ? undefined : { category };
  const { data: products, isLoading } = useListChristverseProducts(queryParams);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-border/40 pb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            The Collection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Physical clothing, anchored in Scripture. Wear the message in the real world.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px]" data-testid="select-shop-category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground font-mono">
        Preview storefront — checkout is simulated in this MVP. No real payment is processed yet.
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="text-center py-32 bg-secondary/20 rounded-3xl border border-border/40 border-dashed">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">Nothing here yet</h3>
          <p className="text-muted-foreground">No pieces found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products?.map((item) => (
            <Link key={item.id} href={`/shop/${item.id}`}>
              <div className="group cursor-pointer" data-testid={`card-product-${item.id}`}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary mb-4 border border-border/40 group-hover:border-primary/50 transition-colors">
                  {item.imageUrl ? (
                    <img
                      src={assetUrl(item.imageUrl)}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 p-6 text-center">
                      <ShoppingBag className="h-10 w-10 text-primary/50" />
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
                    <div className="font-mono font-bold text-primary shrink-0">${item.price}</div>
                  </div>
                  {item.scriptureRef && (
                    <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3" /> {item.scriptureRef}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
