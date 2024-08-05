import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DFiverr } from "../target/types/d_fiverr";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("d_fiverr", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DFiverr as Program<DFiverr>;

  const client = Keypair.generate();
  const freelancer = Keypair.generate();
  const escrowAccount = Keypair.generate();

  it("Initialize escrow", async () => {
    const amount = new anchor.BN(1_000_000_000); // 1 SOL
    console.log('Escrow Account Public Key:', escrowAccount.publicKey.toString());
    console.log('Client Public Key:', client.publicKey.toString());
    console.log('Amount:', amount.toString());

    await program.methods
      .initializeEscrow(amount)
      .accounts({
        escrow: escrowAccount.publicKey,
        client: client.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([client, escrowAccount])
      .rpc();

    const escrowState = await program.account.escrow.fetch(escrowAccount.publicKey);
    console.log('Escrow State:', escrowState);

    expect(escrowState.client.toString()).to.equal(client.publicKey.toString());
    expect(escrowState.freelancer.toString()).to.equal(PublicKey.default.toString());
    expect(escrowState.amount.toNumber()).to.equal(amount.toNumber());
    expect(escrowState.isCompleted).to.be.false;
  });

  it("Set freelancer", async () => {
    console.log('Freelancer Public Key:', freelancer.publicKey.toString());

    await program.methods
      .setFreelancer(freelancer.publicKey)
      .accounts({
        escrow: escrowAccount.publicKey,
        client: client.publicKey,
      })
      .signers([client])
      .rpc();

    const escrowState = await program.account.escrow.fetch(escrowAccount.publicKey);
    console.log('Updated Escrow State:', escrowState);

    expect(escrowState.freelancer.toString()).to.equal(freelancer.publicKey.toString());
  });

  it("Release to freelancer", async () => {
    const initialBalance = await provider.connection.getBalance(freelancer.publicKey);
    console.log('Initial Freelancer Balance:', initialBalance);

    await program.methods
      .releaseToFreelancer()
      .accounts({
        escrow: escrowAccount.publicKey,
        freelancer: freelancer.publicKey,
      })
      .rpc();

    const finalBalance = await provider.connection.getBalance(freelancer.publicKey);
    console.log('Final Freelancer Balance:', finalBalance);

    expect(finalBalance - initialBalance).to.equal(1_000_000_000); // 1 SOL

    const escrowState = await program.account.escrow.fetch(escrowAccount.publicKey);
    console.log('Final Escrow State:', escrowState);

    expect(escrowState.isCompleted).to.be.true;
  });
});
