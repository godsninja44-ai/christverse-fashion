import { useState } from "react";
import { useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Coins, Hash, Clock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { useWallet } from "@/hooks/use-wallet";
import {
  useGetChristverseMessage,
  useTipChristverseMessage,
  getGetChristverseMessageQueryKey,
} from "@/api";

const tipSchema = z.object({
  amount: z.coerce.number().min(1, "Minimum tip is 1 CVT").max(1000, "Maximum tip is 1000 CVT"),
});

type TipFormValues = z.infer<typeof tipSchema>;

export default function MessageDetail() {
  const { id } = useParams();
  const messageId = parseInt(id || "0", 10);
  const { wallet, connect } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTipping, setIsTipping] = useState(false);

  const { data: detail, isLoading, error } = useGetChristverseMessage(messageId, {
    query: { enabled: !!messageId, queryKey: getGetChristverseMessageQueryKey(messageId) }
  });

  const tipMessage = useTipChristverseMessage();

  const form = useForm<TipFormValues>({
    resolver: zodResolver(tipSchema),
    defaultValues: { amount: 10 },
  });

  const onSubmit = async (data: TipFormValues) => {
    if (!wallet) return;

    try {
      setIsTipping(true);
      await tipMessage.mutateAsync({
        id: messageId,
        data: {
          walletAddress: wallet,
          amount: data.amount,
        },
      });

      toast({
        title: "Tip Sent successfully",
        description: `Tipped ${data.amount} CVT to the author.`,
      });
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: getGetChristverseMessageQueryKey(messageId) });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send tip",
        description: "There was an error processing your tip.",
      });
    } finally {
      setIsTipping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-[300px] w-full mb-8 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Message not found</h2>
        <Link href="/messages">
          <Button variant="outline">Return to Wall</Button>
        </Link>
      </div>
    );
  }

  const { message, tips } = detail;
  const isOwnMessage = wallet === message.walletAddress;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/messages" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Wall
      </Link>

      <div className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm mb-12">
        <div className="p-8 md:p-12">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-mono text-sm font-medium text-foreground">
                  {message.walletAddress}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(message.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            </div>
            {message.scriptureRef && (
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                {message.scriptureRef}
              </span>
            )}
          </div>

          <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground border-l-4 border-primary/30 pl-6 mb-8">
            "{message.content}"
          </blockquote>

          <div className="rounded-xl bg-secondary/30 p-4 border border-border/40 font-mono text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 break-all">
              <Hash className="h-3 w-3 shrink-0" />
              <span className="font-semibold text-foreground/70">Content Hash:</span> 
              {message.contentHash}
            </div>
            <div className="flex items-center gap-2 break-all">
              <span className="shrink-0 px-1 rounded bg-destructive/10 text-destructive text-[10px] uppercase font-bold tracking-wider">Simulated</span>
              <span className="font-semibold text-foreground/70">Tx ID:</span> 
              {message.txId}
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/20 border-t border-border/40 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-primary">{message.tipTotal}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total CVT</div>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-primary">{message.tipCount}</div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Supporters</div>
            </div>
          </div>

          <div className="w-full md:w-auto min-w-[280px]">
            {!wallet ? (
              <Button onClick={() => connect()} className="w-full" variant="outline">
                Connect Wallet to Tip
              </Button>
            ) : isOwnMessage ? (
              <div className="text-center p-3 rounded-lg bg-background border border-border/50 text-sm text-muted-foreground">
                You cannot tip your own testimony.
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pl-8 font-mono" />
                            <Coins className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isTipping} className="min-w-[100px]">
                    {isTipping ? "Sending..." : "Tip CVT"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-serif text-2xl font-bold border-b border-border/40 pb-4">Tip History</h3>
        
        {tips.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No tips yet. Be the first to support this testimony.
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div key={tip.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <Coins className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium">
                      {tip.walletAddress.slice(0, 6)}...{tip.walletAddress.slice(-4)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(tip.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-primary">+{tip.amount} CVT</div>
                  <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
                    <span className="text-destructive font-bold">SIM</span> {tip.txId.slice(0,8)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
