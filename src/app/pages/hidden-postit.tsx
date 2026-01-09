import { useEffect, useState } from 'react';
import { PostIt } from './types';
import { PostItTable } from './components/PostItTable';
import { getAllPostIts } from './utils/api';

export default function HiddenPostItPage() {
  const [postIts, setPostIts] = useState<PostIt[]>([]);

  useEffect(() => {
    getAllPostIts().then(setPostIts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PostItTable postIts={postIts} />
    </div>
  );
}
