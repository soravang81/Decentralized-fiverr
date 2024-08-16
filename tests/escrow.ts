import * as anchor from '@project-serum/anchor';
import { Program, Wallet, AnchorProvider } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import idl from '../target/idl/d_fiverr.json'; // Make sure this path is correct
import * as fs from 'fs';


async function main() {
    const connection = new Connection("https://api.devnet.solana.com") 
    const programId = new PublicKey("CrRa5MvEM4iBp4qkTiywNMYdRWCywzHcBGWcwHs32UuG")
    
    const programAccounts = await connection.getProgramAccounts(programId);  // Your test code here
    console.log("Program accounts:", programAccounts)
    const keypairFile = fs.readFileSync('/home/sourav/.config/solana/id.json', 'utf-8');
    const keypairData = JSON.parse(keypairFile);
    const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
    
    // Create the wallet instance
    const wallet = new Wallet(keypair);
    
    // Create the provider
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    
    // Set the provider as the default one
    anchor.setProvider(provider);
    
    // Initialize the program
    const program = new Program(idl as any, "sKiCxvD7pyGxAjT6wPxAssEPqTSuD7FLyXFDxu4MEF1" as anchor.Address, provider);
  
  // Example: derive PDA for escrow account
  const [escrowAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('escrow'), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  console.log("Escrow Account PDA:", escrowAccount.toString());
  
    const clientPublicKey = provider.wallet.publicKey;
    const freelancerPublicKey = new PublicKey('B17g8BzsXN8qNsimyJdzCivJfRSZiBEPADDwtMuj1tsS');
    const amount = new anchor.BN(1000000);
  
    console.log('Client PublicKey:', clientPublicKey.toBase58());
    console.log('Freelancer PublicKey:', freelancerPublicKey.toBase58());
    console.log('Escrow Account:', escrowAccount.toBase58());
    console.log('Amount:', amount.toString());
  
    try {
        await program.methods
        .initialize(clientPublicKey, freelancerPublicKey, amount)
        .accounts({
          escrow: escrowAccount,
          client: clientPublicKey,
          owner: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log('Escrow initialized!');
    } catch (error) {
      console.error('Error initializing escrow:', error);
    }
  }

main().catch(err => {
  console.error(err);
});
