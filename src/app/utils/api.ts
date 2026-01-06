import { supabaseUrl, supabaseAnonKey } from '../../../utils/supabase/info';
import { PostIt } from '../types';

const baseUrl = (supabaseUrl || '').replace(/\/$/, '');
const API_URL = `${baseUrl}/functions/v1/make-server-3ea9e007`;
const STORAGE_KEY = 'connectme_postits';

// Debug: Log credentials on init
if (typeof window !== 'undefined') {
  console.log('🔐 API Initialization Debug:');
  console.log('  VITE_SUPABASE_URL:', baseUrl ? '✅ Loaded' : '❌ Missing');
  console.log('  VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `✅ Loaded (${supabaseAnonKey.slice(0, 10)}...)` : '❌ Missing');
  console.log('  API_URL:', API_URL);
}

// LocalStorage fallback functions
function saveToLocalStorage(postIts: PostIt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postIts));
    console.log('💾 Saved to localStorage as fallback');
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function loadFromLocalStorage(): PostIt[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      console.log('📦 Loaded from localStorage');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  console.log('🌐 Fetching:', url);
  
  if (!baseUrl) {
    const error = '❌ VITE_SUPABASE_URL is missing! Check GitHub secrets.';
    console.error(error);
    throw new Error(error);
  }
  
  if (!supabaseAnonKey) {
    const error = '❌ VITE_SUPABASE_ANON_KEY is missing! Check GitHub secrets.';
    console.error(error);
    throw new Error(error);
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        url: url,
      });
      throw new Error(errorData.details || errorData.error || `API request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Fetch error for', url, ':', error);
    throw error;
  }
}

export async function getAllPostIts(): Promise<PostIt[]> {
  try {
    const data = await fetchAPI('/postits');
    // Se il server funziona, salva anche in localStorage
    saveToLocalStorage(data.postIts);
    return data.postIts || [];
  } catch (error) {
    console.error('⚠️ Server offline - loading from localStorage');
    // Fallback to localStorage
    const localData = loadFromLocalStorage();
    return localData || [];
  }
}

export async function savePostIt(
  postIt: PostIt,
): Promise<PostIt> {
  try {
    const data = await fetchAPI("/postits", {
      method: "POST",
      body: JSON.stringify(postIt),
    });
    return data.postIt;
  } catch (error) {
    console.error("Error saving post-it:", error);
    throw error;
  }
}

export async function batchSavePostIts(
  postIts: PostIt[],
): Promise<void> {
  try {
    await fetchAPI("/postits/batch", {
      method: "POST",
      body: JSON.stringify(postIts),
    });
  } catch (error) {
    console.error("Error batch saving post-its:", error);
    throw error;
  }
}

export async function updatePostItPosition(
  id: string,
  x: number,
  y: number,
): Promise<PostIt> {
  try {
    console.log(
      `🌐 Sending PUT request for post-it ${id} to (${x}, ${y})`,
    );
    const data = await fetchAPI(`/postits/${id}/position`, {
      method: "PUT",
      body: JSON.stringify({ x, y }),
    });
    console.log(`✅ Server response:`, data);
    return data.postIt;
  } catch (error) {
    console.error(
      `❌ Error updating post-it position for ${id}:`,
      error,
    );
    throw error;
  }
}

export async function updatePostItParticipants(
  id: string,
  delta: number,
): Promise<PostIt> {
  try {
    const data = await fetchAPI(`/postits/${id}/participants`, {
      method: "PUT",
      body: JSON.stringify({ delta }),
    });
    return data.postIt;
  } catch (error) {
    console.error("Error updating post-it participants:", error);
    throw error;
  }
}

export async function deletePostIt(id: string): Promise<void> {
  try {
    await fetchAPI(`/postits/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting post-it:", error);
    throw error;
  }
}

export async function updatePostItColor(
  id: string,
  color: string,
): Promise<PostIt> {
  try {
    const data = await fetchAPI(`/postits/${id}/color`, {
      method: "PUT",
      body: JSON.stringify({ color }),
    });
    return data.postIt;
  } catch (error) {
    console.error("Error updating post-it color:", error);
    throw error;
  }
}