import { Wallet } from '@project-serum/anchor';
import { PublicKey, Transaction, Keypair, Connection, VersionedTransaction } from '@solana/web3.js';

export class PhantomWalletWrapper implements Wallet {
  constructor(private wallet: any) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    try {
      return await this.wallet.signTransaction(tx);
    } catch (error) {
      console.error('Error in signTransaction:', error);
      throw error;
    }
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    try {
      return await this.wallet.signAllTransactions(txs);
    } catch (error) {
      console.error('Error in signAllTransactions:', error);
      throw error;
    }
  }

  async sendTransaction(
    transaction: Transaction,
    connection: Connection
  ): Promise<string> {
    try {
      const { signature } = await this.wallet.signAndSendTransaction(transaction);
      return signature;
    } catch (error) {
      console.error('Error in sendTransaction:', error);
      throw error;
    }
  }

  get publicKey(): PublicKey {
    return this.wallet.publicKey;
  }

  get payer(): Keypair {
    throw new Error("PhantomWallet does not provide a keypair. Use 'publicKey' instead.");
  }
}