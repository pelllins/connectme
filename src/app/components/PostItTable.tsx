import { useMemo } from 'react';
import { PostIt } from '../types';

interface PostItTableProps {
  postIts: PostIt[];
}

export function PostItTable({ postIts }: PostItTableProps) {
  // Ordina i post-it per data di aggiunta (decrescente)
  const sorted = useMemo(() =>
    [...postIts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)),
    [postIts]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tabella Post-it (nuovi in alto)</h1>
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Argomento</th>
            <th className="px-4 py-2 border">Titolo</th>
            <th className="px-4 py-2 border">Contenuto</th>
            <th className="px-4 py-2 border">Data di aggiunta</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-2 border">{post.category}</td>
              <td className="px-4 py-2 border">{post.title}</td>
              <td className="px-4 py-2 border">{post.content}</td>
              <td className="px-4 py-2 border">{post.createdAt ? new Date(post.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
