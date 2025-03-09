export type Song = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  mp3: string;
  wave?: string;
  image?: string;
  lyrics: string;
  duration: number;
  description?: string;
};
