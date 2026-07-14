import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

import { useWallet } from "@/hooks/use-wallet";
import {
  useMintChristverseWearable,
  getListChristverseWearablesQueryKey,
} from "@/api";

const CATEGORIES = ["Robes", "Streetwear", "Headwear", "Accessories", "Footwear"];

const mintSchema = z.object({
  name: z.string().min(1, "Name required").max(80, "Name too long"),
  description: z.string().min(1, "Description required").max(500, "Description too long"),
  category: z.string().min(1, "Category required"),
  imageUrl: z.string().url("Must be a valid URL").max(2000).optional().or(z.literal('')),
  prompt: z.string().max(500, "Prompt too long").optional(),
  price: z.coerce.number().min(0, "Price must be positive").max(100000, "Price too high"),
  royaltyPercent: z.coerce.number().min(0).max(20).default(5), // Converted to BPS before sending
});

type MintFormValues = z.infer<typeof mintSchema>;

export default function MintWearable() {
  const { wallet, connect } = useWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isMinting, setIsMinting] = useState(false);

  const mintWearable = useMintChristverseWearable();

  const form = useForm<MintFormValues>({
    resolver: zodResolver(mintSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      prompt: "",
      price: 100,
      royaltyPercent: 5,
    },
  });

  const onSubmit = async (data: MintFormValues) => {
    if (!wallet) return;

    try {
      setIsMinting(true);
      
      const result = await mintWearable.mutateAsync({
        data: {
          walletAddress: wallet,
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl || undefined,
          prompt: data.prompt || undefined,
          price: data.price,
          royaltyBps: data.royaltyPercent * 100,
        },
      });

      toast({
        title: "Mint Successful",
        description: `Successfully minted ${result.name} to the simulated blockchain.`,
      });
      
      queryClient.invalidateQueries({ queryKey: getListChristverseWearablesQueryKey() });
      setLocation(`/fashion/${result.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to mint",
        description: "There was an error minting your wearable.",
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/fashion" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Atelier
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Mint Wearable
        </h1>
        <p className="text-lg text-muted-foreground">
          Bring your vision into the digital realm. Set your price and define your royalty.
        </p>
      </div>

      {!wallet ? (
        <div className="rounded-3xl border border-border/50 bg-card p-12 text-center shadow-sm">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold mb-4">Connect Wallet to Mint</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You need a connected demo wallet to sign the mint transaction and establish ownership of this garment.
          </p>
          <Button onClick={() => connect()} size="lg" className="font-mono">
            CONNECT WALLET
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl border border-border/50 bg-card p-8 md:p-10 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="space-y-6">
                <h3 className="font-serif text-2xl font-bold border-b border-border/40 pb-2">1. Identity</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garment Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Armor of God Hoodie" className="font-serif text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map(c => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the inspiration and meaning behind this piece..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="font-serif text-2xl font-bold border-b border-border/40 pb-2">2. Artwork & Design</h3>
                
                <Alert className="bg-secondary/30 border-border/50">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <AlertTitle className="font-bold text-foreground">AI Generation Coming Soon</AlertTitle>
                  <AlertDescription className="text-muted-foreground text-sm mt-1">
                    The in-app AI designer is currently being integrated. For now, you can provide an external image URL, or leave it blank to mint a text-only conceptual garment. You can still save your prompt design for future use.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Link to a hosted image of your wearable.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Design Prompt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="A luminous white robe with golden thread..." 
                          className="font-mono text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>The creative prompt that describes this piece.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6 pt-6">
                <h3 className="font-serif text-2xl font-bold border-b border-border/40 pb-2">3. Economics</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>List Price (CVT)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" className="pl-10 font-mono text-lg" {...field} />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">CVT</span>
                          </div>
                        </FormControl>
                        <FormDescription>Price on the simulated market.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="royaltyPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creator Royalty (%)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" step="0.1" className="pr-10 font-mono text-lg text-right" {...field} />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">%</span>
                          </div>
                        </FormControl>
                        <FormDescription>Earned on secondary sales.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Tx will be simulated
                </div>
                <Button type="submit" size="lg" className="min-w-[200px] font-mono gap-2" disabled={isMinting}>
                  {isMinting ? "MINTING..." : <><Sparkles className="h-4 w-4" /> MINT WEARABLE</>}
                </Button>
              </div>

            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
