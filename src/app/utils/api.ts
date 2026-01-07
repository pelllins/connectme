import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { PostIt } from '../types';
import { supabase } from './supabase';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3ea9e007`;
const STORAGE_KEY = 'connectme_postits';
const SYNC_STATUS_KEY = 'connectme_sync_status';

// LocalStorage functions
function saveToLocalStorage(postIts: PostIt[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postIts));
    localStorage.setItem(SYNC_STATUS_KEY, new Date().toISOString());
    console.log('💾 Saved to localStorage');
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
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
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
      throw new Error(errorData.details || errorData.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

// Check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Sync localStorage to backend
export async function syncToBackend(postIts: PostIt[]): Promise<boolean> {
  try {
    console.log('🔄 Syncing to backend...');
    await fetchAPI('/postits/batch', {
      method: 'POST',
      body: JSON.stringify(postIts),
    });
    console.log('✅ Synced to backend successfully');
    return true;
  } catch (error) {
    console.log('⚠️ Backend sync failed, will retry later');
    return false;
  }
}

export async function getAllPostIts(): Promise<PostIt[]> {
  // Always try localStorage first (fastest)
  const localData = loadFromLocalStorage();
  
  // Try to fetch from backend and sync
  try {
    const data = await fetchAPI('/postits');
    const backendPostIts = data.postIts || [];
    
    // Ensure all post-its have valid positions
    const validBackendPostIts = backendPostIts.map((postIt: PostIt) => ({
      ...postIt,
      position: postIt.position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 }
    }));
    
    // If backend has data, use it and save to localStorage
    if (validBackendPostIts.length > 0) {
      console.log('✅ Backend is online - using backend data');
      saveToLocalStorage(validBackendPostIts);
      return validBackendPostIts;
    }
    
    // If backend is empty but localStorage has data, sync localStorage to backend
    if (localData && localData.length > 0) {
      console.log('🔄 Backend is empty - syncing localStorage to backend');
      // Ensure localStorage data has valid positions too
      const validLocalData = localData.map(postIt => ({
        ...postIt,
        position: postIt.position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 }
      }));
      await syncToBackend(validLocalData);
      return validLocalData;
    }
    
    return validBackendPostIts;
  } catch (error) {
    console.log('⚠️ Backend offline - using localStorage');
    // Ensure localStorage data has valid positions
    const validLocalData = (localData || []).map(postIt => ({
      ...postIt,
      position: postIt.position || { x: 100 + Math.random() * 300, y: 100 + Math.random() * 200 }
    }));
    return validLocalData;
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
    
    // Also save to localStorage
    const localData = loadFromLocalStorage() || [];
    const updatedData = [...localData, data.postIt];
    saveToLocalStorage(updatedData);
    
    return data.postIt;
  } catch (error) {
    console.error("Error saving post-it:", error);
    
    // Still save to localStorage even if backend fails
    const localData = loadFromLocalStorage() || [];
    const updatedData = [...localData, postIt];
    saveToLocalStorage(updatedData);
    
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
    
    // Also update localStorage
    const localData = loadFromLocalStorage();
    if (localData) {
      const updatedData = localData.map(p => 
        p.id === id ? { ...p, position: { x, y } } : p
      );
      saveToLocalStorage(updatedData);
    }
    
    return data.postIt;
  } catch (error) {
    console.error(
      `❌ Error updating post-it position for ${id}:`,
      error,
    );
    throw error;
  }
}

export async function addParticipant(
  postItId: string,
  userId: string,
): Promise<PostIt> {
  try {
    console.log(`👤 Adding participant ${userId} to post-it ${postItId}`);
    
    // Update localStorage immediately
    const localData = loadFromLocalStorage();
    if (localData) {
      const updatedData = localData.map(p => {
        if (p.id === postItId) {
          const participantIds = p.participantIds || [];
          // Check if user already participating
          if (participantIds.includes(userId)) {
            console.log('⚠️ User already participating');
            return p;
          }
          return {
            ...p,
            participants: p.participants + 1,
            participantIds: [...participantIds, userId]
          };
        }
        return p;
      });
      saveToLocalStorage(updatedData);
      
      // Find and return the updated post-it
      const updatedPostIt = updatedData.find(p => p.id === postItId);
      
      // Try to sync to backend
      try {
        const data = await fetchAPI(`/postits/${postItId}/participate`, {
          method: "POST",
          body: JSON.stringify({ userId }),
        });
        console.log('✅ Participation saved to backend');
        return data.postIt;
      } catch (error) {
        console.log('⚠️ Could not save to backend, saved to localStorage');
        if (updatedPostIt) {
          return updatedPostIt;
        }
        throw error;
      }
    }
    
    // If no localStorage, try backend only
    const data = await fetchAPI(`/postits/${postItId}/participate`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    return data.postIt;
  } catch (error) {
    console.error(`❌ Error adding participant:`, error);
    throw error;
  }
}

export async function removeParticipant(
  postItId: string,
  userId: string,
): Promise<PostIt> {
  try {
    console.log(`👤 Removing participant ${userId} from post-it ${postItId}`);
    
    // Update localStorage immediately
    const localData = loadFromLocalStorage();
    if (localData) {
      const updatedData = localData.map(p => {
        if (p.id === postItId) {
          const participantIds = p.participantIds || [];
          // Check if user is participating
          if (!participantIds.includes(userId)) {
            console.log('⚠️ User not participating');
            return p;
          }
          return {
            ...p,
            participants: Math.max(0, p.participants - 1),
            participantIds: participantIds.filter(id => id !== userId)
          };
        }
        return p;
      });
      saveToLocalStorage(updatedData);
      
      // Find and return the updated post-it
      const updatedPostIt = updatedData.find(p => p.id === postItId);
      
      // Try to sync to backend
      try {
        const data = await fetchAPI(`/postits/${postItId}/participate`, {
          method: "DELETE",
          body: JSON.stringify({ userId }),
        });
        console.log('✅ Participation removed from backend');
        return data.postIt;
      } catch (error) {
        console.log('⚠️ Could not remove from backend, saved to localStorage');
        if (updatedPostIt) {
          return updatedPostIt;
        }
        throw error;
      }
    }
    
    // If no localStorage, try backend only
    const data = await fetchAPI(`/postits/${postItId}/participate`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    });
    return data.postIt;
  } catch (error) {
    console.error(`❌ Error removing participant:`, error);
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

// Real-time subscription to sync changes from Supabase
export function subscribeToPostIts(
  onInsert: (postIt: PostIt) => void,
  onUpdate: (postIt: PostIt) => void,
  onDelete: (id: string) => void
) {
  console.log('🔌 Creating Realtime channel...');
  
  const channel = supabase
    .channel('postits-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'postits',
      },
      (payload) => {
        console.log('🔔 Realtime INSERT:', payload.new);
        onInsert(payload.new as PostIt);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'postits',
      },
      (payload) => {
        console.log('🔔 Realtime UPDATE:', payload.new);
        onUpdate(payload.new as PostIt);
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'postits',
      },
      (payload) => {
        console.log('🔔 Realtime DELETE:', payload.old);
        onDelete((payload.old as PostIt).id);
      }
    )
    .subscribe((status, err) => {
      console.log('📡 Realtime subscription status:', status);
      if (err) {
        console.error('❌ Realtime subscription error:', err);
      }
      if (status === 'SUBSCRIBED') {
        console.log('✅ Successfully subscribed to Realtime!');
      }
      if (status === 'CHANNEL_ERROR') {
        console.error('❌ Channel error - check if Realtime is enabled on the table');
      }
      if (status === 'TIMED_OUT') {
        console.error('⏰ Subscription timed out');
      }
      if (status === 'CLOSED') {
        console.log('🔌 Channel closed');
      }
    });

  return () => {
    console.log('🔌 Unsubscribing from Realtime');
    supabase.removeChannel(channel);
  };
}