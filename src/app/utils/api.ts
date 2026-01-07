import { supabaseUrl, supabaseAnonKey } from '../../../utils/supabase/info';
import { PostIt } from '../types';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'connectme_postits';
const TABLE = 'kv_store_3ea9e007';

const url = (supabaseUrl || '').replace(/\/$/, '');
const anon = supabaseAnonKey || '';
const supabase = createClient(url, anon);

// Debug: Log credentials on init
if (typeof window !== 'undefined') {
  console.log('🔐 API Initialization Debug:');
  console.log('  VITE_SUPABASE_URL:', url ? '✅ Loaded' : '❌ Missing');
  console.log('  VITE_SUPABASE_ANON_KEY:', anon ? `✅ Loaded (${anon.slice(0, 10)}...)` : '❌ Missing');
  console.log('  Mode: direct table access');
}

function saveToLocalStorage(postIts: PostIt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postIts));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromLocalStorage(): PostIt[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

function keyFor(id: string) {
  return `postit:${id}`;
}

export async function getAllPostIts(): Promise<PostIt[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .like('key', 'postit:%');
  if (error) {
    console.error('❌ DB error on getAllPostIts:', error);
    const localData = loadFromLocalStorage();
    return localData || [];
  }
  const list = (data || []).map((row: any) => row.value as PostIt);
  saveToLocalStorage(list);
  return list;
}

export async function savePostIt(postIt: PostIt): Promise<PostIt> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ key: keyFor(postIt.id), value: postIt });
  if (error) {
    console.error('❌ DB error on savePostIt:', error);
    throw error;
  }
  return postIt;
}

export async function batchSavePostIts(postIts: PostIt[]): Promise<void> {
  const rows = postIts.map((p) => ({ key: keyFor(p.id), value: p }));
  const { error } = await supabase.from(TABLE).upsert(rows);
  if (error) {
    console.error('❌ DB error on batchSavePostIts:', error);
    throw error;
  }
}

export async function updatePostItPosition(id: string, x: number, y: number): Promise<PostIt> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('key', keyFor(id))
    .maybeSingle();
  if (error) {
    console.error('❌ DB error on fetch for position:', error);
    throw error;
  }
  const postIt = (data?.value as PostIt) || { id } as PostIt;
  const updated = { ...postIt, position: { x, y } };
  const { error: upsertError } = await supabase
    .from(TABLE)
    .upsert({ key: keyFor(id), value: updated });
  if (upsertError) {
    console.error('❌ DB error on updatePostItPosition:', upsertError);
    throw upsertError;
  }
  return updated;
}

export async function updatePostItParticipants(id: string, delta: number): Promise<PostIt> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('key', keyFor(id))
    .maybeSingle();
  if (error) {
    console.error('❌ DB error on fetch for participants:', error);
    throw error;
  }
  const postIt = (data?.value as PostIt) || { id, participants: 0 } as PostIt;
  const next = Math.max(0, (postIt.participants || 0) + delta);
  const updated = { ...postIt, participants: next };
  const { error: upsertError } = await supabase
    .from(TABLE)
    .upsert({ key: keyFor(id), value: updated });
  if (upsertError) {
    console.error('❌ DB error on updatePostItParticipants:', upsertError);
    throw upsertError;
  }
  return updated;
}

export async function deletePostIt(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('key', keyFor(id));
  if (error) {
    console.error('❌ DB error on deletePostIt:', error);
    throw error;
  }
}

export async function updatePostItColor(id: string, color: string): Promise<PostIt> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('value')
    .eq('key', keyFor(id))
    .maybeSingle();
  if (error) {
    console.error('❌ DB error on fetch for color:', error);
    throw error;
  }
  const postIt = (data?.value as PostIt) || { id } as PostIt;
  const updated = { ...postIt, color };
  const { error: upsertError } = await supabase
    .from(TABLE)
    .upsert({ key: keyFor(id), value: updated });
  if (upsertError) {
    console.error('❌ DB error on updatePostItColor:', upsertError);
    throw upsertError;
  }
  return updated;
}