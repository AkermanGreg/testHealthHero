import React, { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js';
import { useMagic } from '../MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import CardHeader from '@/components/ui/CardHeader';
import Divider from '@/components/ui/Divider';
import Spacer from '@/components/ui/Spacer';

const CheckInCard = () => {
  const { magic, connection } = useMagic();
  const [lastCheckIn, setLastCheckIn] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckIn = useCallback(async () => {
    try {
      setLoading(true);
      if (!magic || !connection) return;

      const timestamp = Math.floor(Date.now() / 1000);
      const metadata = await magic.user.getMetadata();
      const userPublicKey = new PublicKey(metadata.publicAddress);

      const recentBlockhash = await connection.getRecentBlockhash();

      const checkInInstruction = new TransactionInstruction({
        keys: [{ pubkey: userPublicKey, isSigner: false, isWritable: true }],
        programId: 'G64aSk2TLjzCNXdhLN8ANECas1uZW8azGsQ6uqGf96cy',
        data: Buffer.from(Uint8Array.of(1, timestamp)),
      });

      const transaction = new Transaction().add(checkInInstruction);

      const signedTransaction = await magic.solana.signTransaction(transaction);
      signedTransaction.recentBlockhash = recentBlockhash.blockhash;

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize(),
        { skipPreflight: true }
      );

      await connection.confirmTransaction(signature, 'processed');
      await fetchLastCheckIn();

      showToast({ message: 'Checked in successfully!', type: 'success' });
    } catch (error) {
      console.error('Error checking in:', error);
      showToast({ message: 'Error checking in', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [magic, connection]);

  const fetchLastCheckIn = useCallback(async () => {
    try {
      if (!connection) return;
      
      const accountInfo = await connection.getAccountInfo(
        new PublicKey('G64aSk2TLjzCNXdhLN8ANECas1uZW8azGsQ6uqGf96cy')
      );

      if (accountInfo) {
        const lastCheckInTimestamp = new DataView(accountInfo.data.buffer).getInt64(0, true);
        setLastCheckIn(new Date(lastCheckInTimestamp).toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching last check-in:', error);
      showToast({ message: 'Error fetching last check-in', type: 'error' });
    }
  }, [connection]);

  useEffect(() => {
    fetchLastCheckIn();
  }, [fetchLastCheckIn]);

  return (
    <Card>
      <CardHeader id="check-in">Check-In</CardHeader>
      <Divider />
      <div>Last Check-In: {lastCheckIn || 'Not available'}</div>
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
    </Card>
  );
};

export default CheckInCard;
