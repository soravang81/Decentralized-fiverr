// "use client"
// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { useWallet } from "@/lib/hooks";

// const WalletConnect = () => {
//   const { publicKey, connectWallet, disconnectWallet } = useWallet();

//   const handleWalletAction = () => {
//     if (publicKey) {
//       disconnectWallet();
//     } else {
//       connectWallet();
//     }
//   };

//   return (
//     <TooltipProvider delayDuration={100}>
//       <Tooltip>
//         <TooltipTrigger asChild className="">
//           <Button variant="default" className="m-0" onClick={handleWalletAction}>
//             {publicKey ? "Disconnect Wallet" : "Connect Wallet"}
//           </Button>
//         </TooltipTrigger>
//         {publicKey && (
//           <TooltipContent>
//             <p className="p-1">Connected: {publicKey}</p>
//           </TooltipContent>
//         )}
//       </Tooltip>
//     </TooltipProvider>
//   );
// };

// export default WalletConnect