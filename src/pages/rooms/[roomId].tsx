import React from 'react';
import { useSubscribeDocument } from '@/util/firestore-hooks';
import { getRoomCollection } from '@/models/store';
import { doc } from '@firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

type Props = {
  roomId: string;
};

const RoomPage = ({ roomId }: Props) => {
  const room = useSubscribeDocument(doc(getRoomCollection(),roomId));

  switch (room.status) {
    case 'loading':
      return <p>Loading...</p>;
    case 'error':
    case 'not-found':
      return <p>Error occurred.</p>;
    default:
      return (
        <div>
          <h1>{room.data.scenario.title}</h1>
          <p>{room.data.createdAt.toString()}</p>
        </div>
      );
  }
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext,
) => {
  const roomId = context.params?.roomId as string;

  if (!roomId) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      roomId,
    },
  };
};

export default RoomPage;
