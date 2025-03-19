import { getTimeDifference } from "@/lib/utils"
import { getAllTransactions } from "../actions/others/transaction"

const RecentTransactions = async () => {
   
   const txs = await getAllTransactions()

   return <div className="flex flex-col gap-4 container mt-20">
   {txs.map(tx => (
      <div key={tx.id} className="p-4 rounded-lg border flex flex-col md:flex-row justify-between shadow-md">
         <div className="flex flex-col">
            <p className="font-semibold text-lg">Purpose : {tx.purpose}</p>
            <section className="flex flex-col gap-1 ml-4">
               <p className="text-gray-500">From : {tx.fromAddress}</p>
               <p className="text-gray-500">To : {tx.toAddress}</p>
               <p className="text-gray-500">Status : {tx.status}</p>
               <p className="text-black">{getTimeDifference(tx.createdAt)}</p>
               <section className="flex gap-2">
                  <span>Tx hash :  </span>
                  <a 
                     href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="cursor-pointer hover:underline text-blue-900"
                  >
                     {tx.txHash}
                  </a>
               </section>
            </section>
         </div>
      </div>
   ))}
 </div>
}
export default RecentTransactions