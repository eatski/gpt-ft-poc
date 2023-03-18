import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getRoomCollection } from '@/models/store';
import { addDoc } from '@firebase/firestore';

const CreateRoom = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleCreateRoom = async () => {
    setStatus('loading'); // ボタンをクリックした時にloading状態にする

    try {
      const roomRef = await addDoc(getRoomCollection(), {
        createdAt: new Date(),
      });
      router.push(`/rooms/${roomRef.id}`); // ルームページにリダイレクトする
    } catch (error) {
      setStatus('error'); // エラーが発生したら、エラーメッセージを表示する
      console.error('Error adding document: ', error);
    }
  };

  const renderButtonContent = () => {
    switch (status) {
      case 'loading':
        return 'Loading...';
      case 'error':
        return 'Error creating room';
      default:
        return 'Create Room';
    }
  };

  return (
    <div>
      <button onClick={handleCreateRoom} disabled={status === 'loading'}>
        {renderButtonContent()}
      </button>
    </div>
  );
};

export default CreateRoom;


