export type Category = 'Studio' | 'Social' | 'Sport' | 'Passioni/Interessi' | 'Pausa Caffè' | 'Pranzo';
export type Campus = 'Leonardo' | 'Bovisa';

export interface PostIt {
  id: string;
  title: string;
  content: string;
  category: Category;
  campus: Campus;
  date?: string;
  createdAt?: string; // Timestamp ISO per calcolare l'età
  participants: number;
  position: { x: number; y: number };
  color: string;
}

export interface UserProfile {
  name: string;
  surname: string;
  matricola: string;
  email: string;
  avatar: string;
}