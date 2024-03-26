import React, { useCallback, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import showToast from '@/utils/showToast';
import Spinner from '@/components/ui/Spinner';
import { useMagic } from '../MagicProvider';

const GetEmailAddress = () => {
  const { magic } = useMagic();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');

  const getEmailAddress = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      const metadata = await magic.user.getMetadata();
      setDisabled(false);
      setEmail(metadata.email); // Set the email address in state
      showToast({
        message: `Email Address: ${metadata.email}`,
        type: 'success',
      });
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic]);

  useEffect(() => {
    getEmailAddress(); // Call getEmailAddress function when component mounts
  }, []); // Empty dependency array ensures it only runs once when component mounts

  return (
    <div className="wallet-method-container">
      {disabled ? (
        <div className="loading-container w-[220px]">
          <Spinner />
        </div>
      ) : (
        <div className="code">{email}</div>
      )}
      <div className="wallet-method-desc">Shows user email address when component mounts</div>
    </div>
  );
};

export default GetEmailAddress;
