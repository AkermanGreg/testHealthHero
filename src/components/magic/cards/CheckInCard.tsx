import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import showToast from '@/utils/showToast';
import CardHeader from '@/components/ui/CardHeader';
import Divider from '@/components/ui/Divider';
import Spacer from '@/components/ui/Spacer';
import Spinner from '@/components/ui/Spinner';
import {
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection
} from "@solana/web3.js";

import { useMagic } from '../MagicProvider';

const CheckInCard: React.FC = () => {
  const { magic, connection } = useMagic();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
  
      
  
      // Fetch metadata and user public key from Magic
      const metadata = await magic.user.getMetadata();
      const userPublicKey = new PublicKey(metadata.publicAddress);
  
      // Generate recipient public key
      const recipientPubkey = Keypair.generate().publicKey;
  
      // Fetch latest blockhash
      const blockhash = await connection?.getLatestBlockhash();
      if (!blockhash) return;
  
      // Create a new transaction
      const transaction = new Transaction({
        ...blockhash,
        feePayer: userPublicKey,
      });
  
      // Add transfer instruction to the transaction
      const transferIx = SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: recipientPubkey,
        lamports: 0.01 * LAMPORTS_PER_SOL,
      });
      transaction.add(transferIx);
  
      // Sign the transaction using Magic
      const signedTransaction = await magic?.solana.signTransaction(
        transaction,
        {
          requireAllSignatures: false,
          verifySignatures: true,
        }
      );
  
      // Send the signed transaction to Solana network
      const signature = await connection?.sendRawTransaction(
        Buffer.from(signedTransaction?.rawTransaction as string, "base64")
      );
  
      console.log(signature); // Print transaction signature
  
      // Sign the message using Magic
      const signedMessage = await magic?.solana.signMessage("Hello World");
      console.log(signedMessage);
      showToast({ message: `Signature: ${signature}`, type: 'success' });
      showToast({ message: `Signed message: ${signedMessage}`, type: 'success' });
    } catch (error) {
      console.error('Error submitting transaction:', error);
      showToast({ message: 'Error submitting transaction', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader id="check-in">Check-In</CardHeader>
      <Divider />
      <Spacer size={20} />
      <button onClick={handleCheckIn} disabled={loading}>
        {loading ? (
          <div className="w-full loading-container">
            <Spinner />
          </div>
        ) : (
          'Check In'
        )}
      </button>
      <div className="wallet-method-desc">This will generate a signature and signed message</div>
    </Card>
  );
};

export default CheckInCard;
