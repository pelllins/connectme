import { useEffect, useState } from 'react';
import { PostIt } from '../types';
import { getAllPostIts } from '../utils/api';

export default function HiddenTable() {
  const [postIts, setPostIts] = useState<PostIt[]>([]);

  useEffect(() => {
    getAllPostIts().then(setPostIts);
  }, []);

  // Ordina per data di aggiunta decrescente (ISO string -> timestamp)
  const sorted = [...postIts].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 'bold', fontSize: 24 }}>Tabella Post-it (nuovi in alto)</h1>
        <button
          style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}
          onClick={() => { window.location.hash = '#polimi'; window.location.reload(); }}
        >
          Torna a Io e il Polimi
        </button>
      </div>
      <table style={{ borderCollapse: 'collapse', width: '100%', background: 'white' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Argomento</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Titolo</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Contenuto</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Data di aggiunta</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((post) => (
            <tr key={post.id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{post.category}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{post.title}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{post.content}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{post.createdAt ? new Date(post.createdAt).toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
