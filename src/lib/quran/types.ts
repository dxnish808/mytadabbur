export type { Surah } from "./surahs";

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation: string;
  transliteration?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  nameTransliteration: string;
  nameMalay: string;
  ayahCount: number;
  revelationType: "Makkiyyah" | "Madaniyyah";
  juz: number[];
  ayahs: Ayah[];
}
