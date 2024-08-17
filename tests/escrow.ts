import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { DFiverr } from '../target/types/d_fiverr';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';

describe('d_fiverr', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DFiverr as Program<DFiverr>;

  let escrowAccount: Keypair;
  let clientKeypair: Keypair;
  let freelancerKeypair: Keypair;
  let ownerKeypair: Keypair;

  const escrowAmount = new anchor.BN(1_000_000_000); // 1 SOL

  before(async () => {
    escrowAccount = Keypair.generate();
    clientKeypair = Keypair.generate();
    freelancerKeypair = Keypair.generate();
    ownerKeypair = Keypair.generate();

    // Airdrop SOL to client for paying escrow
    await provider.connection.requestAirdrop(clientKeypair.publicKey, 2_000_000_000);
    await provider.connection.confirmTransaction(await provider.connection.requestAirdrop(clientKeypair.publicKey, 2_000_000_000));
  });

  it('Initializes the escrow', async () => {
    await program.methods
      .initialize(clientKeypair.publicKey, freelancerKeypair.publicKey, escrowAmount)
      .accounts({
        escrow: escrowAccount.publicKey,
        client: clientKeypair.publicKey,
        owner: ownerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([clientKeypair, escrowAccount])
      .rpc();

    const escrowState = await program.account.escrow.fetch(escrowAccount.publicKey);
    expect(escrowState.client.toString()).to.equal(clientKeypair.publicKey.toString());
    expect(escrowState.freelancer.toString()).to.equal(freelancerKeypair.publicKey.toString());
    expect(escrowState.amount.toNumber()).to.equal(escrowAmount.toNumber());
    expect(escrowState.isCompleted).to.be.false;
    expect(escrowState.clientAgreed).to.be.false;
    expect(escrowState.freelancerAgreed).to.be.false;
    expect(escrowState.owner.toString()).to.equal(ownerKeypair.publicKey.toString());
  });

  it('Marks the escrow as completed by client and freelancer', async () => {
    await program.methods
      .markCompleted('client')
      .accounts({
        escrow: escrowAccount.publicKey,
        signer: clientKeypair.publicKey,
      })
      .signers([clientKeypair])
      .rpc();

    await program.methods
      .markCompleted('freelancer')
      .accounts({
        escrow: escrowAccount.publicKey,
        signer: freelancerKeypair.publicKey,
      })
      .signers([freelancerKeypair])
      .rpc();

    const escrowState = await program.account.escrow.fetch(escrowAccount.publicKey);
    expect(escrowState.isCompleted).to.be.true;
    expect(escrowState.clientAgreed).to.be.true;
    expect(escrowState.freelancerAgreed).to.be.true;
  });

  it('Releases funds to the freelancer', async () => {
    const freelancerBalanceBefore = await provider.connection.getBalance(freelancerKeypair.publicKey);
  
    await program.methods
      .releaseFunds()
      .accounts({
        escrow: escrowAccount.publicKey,
        freelancer: freelancerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  
    const freelancerBalanceAfter = await provider.connection.getBalance(freelancerKeypair.publicKey);
    expect(freelancerBalanceAfter).to.be.greaterThan(freelancerBalanceBefore);
  });
  
  it('Resolves a dispute', async () => {
    // Create a new escrow for this test
    const disputeEscrowAccount = Keypair.generate();
    
    // Airdrop more SOL to the client
    await provider.connection.requestAirdrop(clientKeypair.publicKey, 2_000_000_000);
    await provider.connection.confirmTransaction(await provider.connection.requestAirdrop(clientKeypair.publicKey, 2_000_000_000));
  
    // Use a smaller amount for this test
    const disputeEscrowAmount = new anchor.BN(100_000_000); // 0.1 SOL
  
    await program.methods
      .initialize(clientKeypair.publicKey, freelancerKeypair.publicKey, disputeEscrowAmount)
      .accounts({
        escrow: disputeEscrowAccount.publicKey,
        client: clientKeypair.publicKey,
        owner: ownerKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([clientKeypair, disputeEscrowAccount])
      .rpc();
  
    const clientBalanceBefore = await provider.connection.getBalance(clientKeypair.publicKey);
  
    await program.methods
      .resolveDispute(clientKeypair.publicKey)
      .accounts({
        escrow: disputeEscrowAccount.publicKey,
        owner: ownerKeypair.publicKey,
        recipient: clientKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([ownerKeypair])
      .rpc();
  
    const clientBalanceAfter = await provider.connection.getBalance(clientKeypair.publicKey);
    expect(clientBalanceAfter).to.be.greaterThan(clientBalanceBefore);
  });
  
});
