"use client"
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWallet } from "@/lib/hooks";

const WalletConnect = () => {
  const { publicKey, connectWallet, disconnectWallet } = useWallet();

  const handleWalletAction = () => {
    if (publicKey) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" onClick={handleWalletAction}>
              {publicKey ? "Disconnect Wallet" : "Connect Wallet"}
            </Button>
          </TooltipTrigger>
          {publicKey && (
            <TooltipContent>
              <p className="p-1">Connected: {publicKey}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default WalletConnect