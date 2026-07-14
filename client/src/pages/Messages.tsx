import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquarePlus, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { useWallet } from "@/hooks/use-wallet";
import {
  useListChristverseMessages,
  useCreateChristverseMessage,
  getListChristverseMessagesQueryKey,
} from "@/api";

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(500, "Maximum 500 characters"),
  scriptureRef: z.string().max(80, "Reference too long").optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function Messages() {
  const { wallet, connect } = useWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isPosting, setIsPosting] = useState(false);

  const { data: messages, isLoading } = useListChristverseMessages();
  const createMessage = useCreateChristverseMessage();

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      scriptureRef: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    if (!wallet) return;

    try {
      setIsPosting(true);
      await createMessage.mutateAsync({
        data: {
          walletAddress: wallet,
          content: data.content,
          scriptureRef: data.scriptureRef || undefined,
        },
      });

      toast({
        title: "Testimony recorded",
        description: "Your message has been permanently hashed to the wall.",
      });
      
      form.reset();
      queryClient.invalidateQueries({ queryKey: getListChristverseMessagesQueryKey() });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to post",
        description: "There was an error recording your testimony.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          The Testimony Wall
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A permanent, immutable record of faith. Leave your verse, your prayer, or your testimony.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
        <div className="space-y-8">
          <div className="sticky top-24 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-primary" />
              Post Message
            </h2>
            
            {!wallet ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-sm text-muted-foreground">Connect your demo wallet to leave a message.</p>
                <Button onClick={() => connect()} className="w-full">
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimony or Prayer</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What's on your heart?" 
                            className="resize-none min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scriptureRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scripture Reference (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Joshua 1:9" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPosting}>
                    {isPosting ? "Engraving..." : "Carve into Wall"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h3 className="font-serif text-xl font-bold">Recent Testimonies</h3>
            <span className="text-sm font-mono text-muted-foreground">
              {messages?.length || 0} Recorded
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 p-6 space-y-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : messages?.length === 0 ? (
            <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border/40 border-dashed">
              <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">The wall is blank</h3>
              <p className="text-sm text-muted-foreground">Be the first to leave a testimony.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages?.map((msg) => (
                <div 
                  key={msg.id} 
                  className="group relative rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-mono text-xs font-medium text-foreground">
                          {msg.walletAddress.slice(0, 6)}...{msg.walletAddress.slice(-4)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {format(new Date(msg.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    {msg.scriptureRef && (
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {msg.scriptureRef}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-base text-card-foreground leading-relaxed mb-6 font-serif">
                    "{msg.content}"
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                      <span>{msg.tipCount} tips</span>
                      <span>{msg.tipTotal} CVT</span>
                    </div>
                    
                    <Link href={`/messages/${msg.id}`}>
                      <Button variant="ghost" size="sm" className="gap-2 h-8 text-primary hover:text-primary/80">
                        View & Tip <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
