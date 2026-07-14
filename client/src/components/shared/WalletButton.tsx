import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { wallet, connect, disconnect } = useWallet();

  if (wallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="sm" className="font-mono text-xs gap-2">
            <Wallet className="h-3 w-3" />
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-mono text-xs text-muted-foreground">Demo Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="text-destructive focus:bg-destructive/10 cursor-pointer">
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => connect()} size="sm" className="font-mono text-xs gap-2">
      <Wallet className="h-3 w-3" />
      CONNECT
    </Button>
  );
}
