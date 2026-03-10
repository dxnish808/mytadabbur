export interface Surah {
  number: number;
  name: string;
  nameTransliteration: string;
  nameMalay: string;
  ayahCount: number;
  revelationType: "Makkiyyah" | "Madaniyyah";
  juz: number[];
}

export const SURAHS: Surah[] = [
  { number: 1,   name: "الفاتحة",       nameTransliteration: "Al-Fatihah",       nameMalay: "Pembukaan",                 ayahCount: 7,   revelationType: "Makkiyyah",  juz: [1] },
  { number: 2,   name: "البقرة",        nameTransliteration: "Al-Baqarah",        nameMalay: "Lembu Betina",               ayahCount: 286, revelationType: "Madaniyyah", juz: [1, 2, 3] },
  { number: 3,   name: "آل عمران",      nameTransliteration: "Ali 'Imran",        nameMalay: "Keluarga Imran",             ayahCount: 200, revelationType: "Madaniyyah", juz: [3, 4] },
  { number: 4,   name: "النساء",        nameTransliteration: "An-Nisa'",          nameMalay: "Wanita",                     ayahCount: 176, revelationType: "Madaniyyah", juz: [4, 5, 6] },
  { number: 5,   name: "المائدة",       nameTransliteration: "Al-Ma'idah",        nameMalay: "Hidangan",                   ayahCount: 120, revelationType: "Madaniyyah", juz: [6, 7] },
  { number: 6,   name: "الأنعام",       nameTransliteration: "Al-An'am",          nameMalay: "Binatang Ternak",            ayahCount: 165, revelationType: "Makkiyyah",  juz: [7, 8] },
  { number: 7,   name: "الأعراف",       nameTransliteration: "Al-A'raf",          nameMalay: "Tempat Tertinggi",           ayahCount: 206, revelationType: "Makkiyyah",  juz: [8, 9] },
  { number: 8,   name: "الأنفال",       nameTransliteration: "Al-Anfal",          nameMalay: "Rampasan Perang",            ayahCount: 75,  revelationType: "Madaniyyah", juz: [9, 10] },
  { number: 9,   name: "التوبة",        nameTransliteration: "At-Tawbah",         nameMalay: "Taubat",                     ayahCount: 129, revelationType: "Madaniyyah", juz: [10, 11] },
  { number: 10,  name: "يونس",          nameTransliteration: "Yunus",             nameMalay: "Nabi Yunus",                 ayahCount: 109, revelationType: "Makkiyyah",  juz: [11] },
  { number: 11,  name: "هود",           nameTransliteration: "Hud",               nameMalay: "Nabi Hud",                   ayahCount: 123, revelationType: "Makkiyyah",  juz: [11, 12] },
  { number: 12,  name: "يوسف",          nameTransliteration: "Yusuf",             nameMalay: "Nabi Yusuf",                 ayahCount: 111, revelationType: "Makkiyyah",  juz: [12, 13] },
  { number: 13,  name: "الرعد",         nameTransliteration: "Ar-Ra'd",           nameMalay: "Guruh",                      ayahCount: 43,  revelationType: "Madaniyyah", juz: [13] },
  { number: 14,  name: "إبراهيم",       nameTransliteration: "Ibrahim",           nameMalay: "Nabi Ibrahim",               ayahCount: 52,  revelationType: "Makkiyyah",  juz: [13] },
  { number: 15,  name: "الحجر",         nameTransliteration: "Al-Hijr",           nameMalay: "Batu Berbentuk",             ayahCount: 99,  revelationType: "Makkiyyah",  juz: [14] },
  { number: 16,  name: "النحل",         nameTransliteration: "An-Nahl",           nameMalay: "Lebah",                      ayahCount: 128, revelationType: "Makkiyyah",  juz: [14] },
  { number: 17,  name: "الإسراء",       nameTransliteration: "Al-Isra'",          nameMalay: "Perjalanan Malam",           ayahCount: 111, revelationType: "Makkiyyah",  juz: [15] },
  { number: 18,  name: "الكهف",         nameTransliteration: "Al-Kahf",           nameMalay: "Gua",                        ayahCount: 110, revelationType: "Makkiyyah",  juz: [15, 16] },
  { number: 19,  name: "مريم",          nameTransliteration: "Maryam",            nameMalay: "Maryam",                     ayahCount: 98,  revelationType: "Makkiyyah",  juz: [16] },
  { number: 20,  name: "طه",            nameTransliteration: "Ta-Ha",             nameMalay: "Ta Ha",                      ayahCount: 135, revelationType: "Makkiyyah",  juz: [16] },
  { number: 21,  name: "الأنبياء",      nameTransliteration: "Al-Anbiya'",        nameMalay: "Para Nabi",                  ayahCount: 112, revelationType: "Makkiyyah",  juz: [17] },
  { number: 22,  name: "الحج",          nameTransliteration: "Al-Hajj",           nameMalay: "Haji",                       ayahCount: 78,  revelationType: "Madaniyyah", juz: [17] },
  { number: 23,  name: "المؤمنون",      nameTransliteration: "Al-Mu'minun",       nameMalay: "Orang-orang Mukmin",         ayahCount: 118, revelationType: "Makkiyyah",  juz: [18] },
  { number: 24,  name: "النور",         nameTransliteration: "An-Nur",            nameMalay: "Cahaya",                     ayahCount: 64,  revelationType: "Madaniyyah", juz: [18] },
  { number: 25,  name: "الفرقان",       nameTransliteration: "Al-Furqan",         nameMalay: "Pembeza",                    ayahCount: 77,  revelationType: "Makkiyyah",  juz: [18, 19] },
  { number: 26,  name: "الشعراء",       nameTransliteration: "Ash-Shu'ara'",      nameMalay: "Para Penyair",               ayahCount: 227, revelationType: "Makkiyyah",  juz: [19] },
  { number: 27,  name: "النمل",         nameTransliteration: "An-Naml",           nameMalay: "Semut",                      ayahCount: 93,  revelationType: "Makkiyyah",  juz: [19, 20] },
  { number: 28,  name: "القصص",         nameTransliteration: "Al-Qasas",          nameMalay: "Kisah-kisah",                ayahCount: 88,  revelationType: "Makkiyyah",  juz: [20] },
  { number: 29,  name: "العنكبوت",      nameTransliteration: "Al-'Ankabut",       nameMalay: "Labah-labah",                ayahCount: 69,  revelationType: "Makkiyyah",  juz: [20, 21] },
  { number: 30,  name: "الروم",         nameTransliteration: "Ar-Rum",            nameMalay: "Bangsa Rom",                 ayahCount: 60,  revelationType: "Makkiyyah",  juz: [21] },
  { number: 31,  name: "لقمان",         nameTransliteration: "Luqman",            nameMalay: "Luqman",                     ayahCount: 34,  revelationType: "Makkiyyah",  juz: [21] },
  { number: 32,  name: "السجدة",        nameTransliteration: "As-Sajdah",         nameMalay: "Sujud",                      ayahCount: 30,  revelationType: "Makkiyyah",  juz: [21] },
  { number: 33,  name: "الأحزاب",       nameTransliteration: "Al-Ahzab",          nameMalay: "Golongan-golongan Bersekutu", ayahCount: 73, revelationType: "Madaniyyah", juz: [21, 22] },
  { number: 34,  name: "سبأ",           nameTransliteration: "Saba'",             nameMalay: "Kaum Saba",                  ayahCount: 54,  revelationType: "Makkiyyah",  juz: [22] },
  { number: 35,  name: "فاطر",          nameTransliteration: "Fatir",             nameMalay: "Pencipta",                   ayahCount: 45,  revelationType: "Makkiyyah",  juz: [22] },
  { number: 36,  name: "يس",            nameTransliteration: "Ya-Sin",            nameMalay: "Ya Sin",                     ayahCount: 83,  revelationType: "Makkiyyah",  juz: [22, 23] },
  { number: 37,  name: "الصافات",       nameTransliteration: "As-Saffat",         nameMalay: "Yang Berbaris-baris",        ayahCount: 182, revelationType: "Makkiyyah",  juz: [23] },
  { number: 38,  name: "ص",             nameTransliteration: "Sad",               nameMalay: "Sad",                        ayahCount: 88,  revelationType: "Makkiyyah",  juz: [23] },
  { number: 39,  name: "الزمر",         nameTransliteration: "Az-Zumar",          nameMalay: "Rombongan-rombongan",        ayahCount: 75,  revelationType: "Makkiyyah",  juz: [23, 24] },
  { number: 40,  name: "غافر",          nameTransliteration: "Ghafir",            nameMalay: "Yang Maha Pengampun",        ayahCount: 85,  revelationType: "Makkiyyah",  juz: [24] },
  { number: 41,  name: "فصلت",          nameTransliteration: "Fussilat",          nameMalay: "Yang Dijelaskan",            ayahCount: 54,  revelationType: "Makkiyyah",  juz: [24, 25] },
  { number: 42,  name: "الشورى",        nameTransliteration: "Ash-Shura",         nameMalay: "Musyawarah",                 ayahCount: 53,  revelationType: "Makkiyyah",  juz: [25] },
  { number: 43,  name: "الزخرف",        nameTransliteration: "Az-Zukhruf",        nameMalay: "Perhiasan",                  ayahCount: 89,  revelationType: "Makkiyyah",  juz: [25] },
  { number: 44,  name: "الدخان",        nameTransliteration: "Ad-Dukhan",         nameMalay: "Asap",                       ayahCount: 59,  revelationType: "Makkiyyah",  juz: [25] },
  { number: 45,  name: "الجاثية",       nameTransliteration: "Al-Jathiyah",       nameMalay: "Yang Berlutut",              ayahCount: 37,  revelationType: "Makkiyyah",  juz: [25] },
  { number: 46,  name: "الأحقاف",       nameTransliteration: "Al-Ahqaf",          nameMalay: "Bukit-bukit Pasir",          ayahCount: 35,  revelationType: "Makkiyyah",  juz: [26] },
  { number: 47,  name: "محمد",          nameTransliteration: "Muhammad",          nameMalay: "Nabi Muhammad",              ayahCount: 38,  revelationType: "Madaniyyah", juz: [26] },
  { number: 48,  name: "الفتح",         nameTransliteration: "Al-Fath",           nameMalay: "Kemenangan",                 ayahCount: 29,  revelationType: "Madaniyyah", juz: [26] },
  { number: 49,  name: "الحجرات",       nameTransliteration: "Al-Hujurat",        nameMalay: "Bilik-bilik",                ayahCount: 18,  revelationType: "Madaniyyah", juz: [26] },
  { number: 50,  name: "ق",             nameTransliteration: "Qaf",               nameMalay: "Qaf",                        ayahCount: 45,  revelationType: "Makkiyyah",  juz: [26] },
  { number: 51,  name: "الذاريات",      nameTransliteration: "Adh-Dhariyat",      nameMalay: "Angin yang Menerbangkan",    ayahCount: 60,  revelationType: "Makkiyyah",  juz: [26, 27] },
  { number: 52,  name: "الطور",         nameTransliteration: "At-Tur",            nameMalay: "Bukit Sinai",                ayahCount: 49,  revelationType: "Makkiyyah",  juz: [27] },
  { number: 53,  name: "النجم",         nameTransliteration: "An-Najm",           nameMalay: "Bintang",                    ayahCount: 62,  revelationType: "Makkiyyah",  juz: [27] },
  { number: 54,  name: "القمر",         nameTransliteration: "Al-Qamar",          nameMalay: "Bulan",                      ayahCount: 55,  revelationType: "Makkiyyah",  juz: [27] },
  { number: 55,  name: "الرحمن",        nameTransliteration: "Ar-Rahman",         nameMalay: "Yang Maha Pemurah",          ayahCount: 78,  revelationType: "Madaniyyah", juz: [27] },
  { number: 56,  name: "الواقعة",       nameTransliteration: "Al-Waqi'ah",        nameMalay: "Hari Kiamat",                ayahCount: 96,  revelationType: "Makkiyyah",  juz: [27] },
  { number: 57,  name: "الحديد",        nameTransliteration: "Al-Hadid",          nameMalay: "Besi",                       ayahCount: 29,  revelationType: "Madaniyyah", juz: [27] },
  { number: 58,  name: "المجادلة",      nameTransliteration: "Al-Mujadila",       nameMalay: "Wanita yang Membantah",      ayahCount: 22,  revelationType: "Madaniyyah", juz: [28] },
  { number: 59,  name: "الحشر",         nameTransliteration: "Al-Hashr",          nameMalay: "Pengusiran",                 ayahCount: 24,  revelationType: "Madaniyyah", juz: [28] },
  { number: 60,  name: "الممتحنة",      nameTransliteration: "Al-Mumtahanah",     nameMalay: "Wanita yang Diuji",          ayahCount: 13,  revelationType: "Madaniyyah", juz: [28] },
  { number: 61,  name: "الصف",          nameTransliteration: "As-Saf",            nameMalay: "Barisan",                    ayahCount: 14,  revelationType: "Madaniyyah", juz: [28] },
  { number: 62,  name: "الجمعة",        nameTransliteration: "Al-Jumu'ah",        nameMalay: "Hari Jumaat",                ayahCount: 11,  revelationType: "Madaniyyah", juz: [28] },
  { number: 63,  name: "المنافقون",     nameTransliteration: "Al-Munafiqun",      nameMalay: "Orang-orang Munafik",        ayahCount: 11,  revelationType: "Madaniyyah", juz: [28] },
  { number: 64,  name: "التغابن",       nameTransliteration: "At-Taghabun",       nameMalay: "Hari Dinampakkan Kesalahan", ayahCount: 18,  revelationType: "Madaniyyah", juz: [28] },
  { number: 65,  name: "الطلاق",        nameTransliteration: "At-Talaq",          nameMalay: "Talak",                      ayahCount: 12,  revelationType: "Madaniyyah", juz: [28] },
  { number: 66,  name: "التحريم",       nameTransliteration: "At-Tahrim",         nameMalay: "Pengharaman",                ayahCount: 12,  revelationType: "Madaniyyah", juz: [28] },
  { number: 67,  name: "الملك",         nameTransliteration: "Al-Mulk",           nameMalay: "Kerajaan",                   ayahCount: 30,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 68,  name: "القلم",         nameTransliteration: "Al-Qalam",          nameMalay: "Pena",                       ayahCount: 52,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 69,  name: "الحاقة",        nameTransliteration: "Al-Haqqah",         nameMalay: "Hari Kiamat yang Pasti",     ayahCount: 52,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 70,  name: "المعارج",       nameTransliteration: "Al-Ma'arij",        nameMalay: "Tempat-tempat Naik",         ayahCount: 44,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 71,  name: "نوح",           nameTransliteration: "Nuh",               nameMalay: "Nabi Nuh",                   ayahCount: 28,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 72,  name: "الجن",          nameTransliteration: "Al-Jinn",           nameMalay: "Jin",                        ayahCount: 28,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 73,  name: "المزمل",        nameTransliteration: "Al-Muzzammil",      nameMalay: "Yang Berselimut",            ayahCount: 20,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 74,  name: "المدثر",        nameTransliteration: "Al-Muddaththir",    nameMalay: "Yang Berselimut (Jubah)",    ayahCount: 56,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 75,  name: "القيامة",       nameTransliteration: "Al-Qiyamah",        nameMalay: "Hari Kiamat",                ayahCount: 40,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 76,  name: "الإنسان",       nameTransliteration: "Al-Insan",          nameMalay: "Manusia",                    ayahCount: 31,  revelationType: "Madaniyyah", juz: [29] },
  { number: 77,  name: "المرسلات",      nameTransliteration: "Al-Mursalat",       nameMalay: "Yang Diutus",                ayahCount: 50,  revelationType: "Makkiyyah",  juz: [29] },
  { number: 78,  name: "النبأ",         nameTransliteration: "An-Naba'",          nameMalay: "Berita Besar",               ayahCount: 40,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 79,  name: "النازعات",      nameTransliteration: "An-Nazi'at",        nameMalay: "Yang Mencabut",              ayahCount: 46,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 80,  name: "عبس",           nameTransliteration: "'Abasa",            nameMalay: "Ia Bermuka Masam",           ayahCount: 42,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 81,  name: "التكوير",       nameTransliteration: "At-Takwir",         nameMalay: "Penggulungan",               ayahCount: 29,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 82,  name: "الانفطار",      nameTransliteration: "Al-Infitar",        nameMalay: "Terbelah",                   ayahCount: 19,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 83,  name: "المطففين",      nameTransliteration: "Al-Mutaffifin",     nameMalay: "Yang Curang dalam Timbangan", ayahCount: 36, revelationType: "Makkiyyah",  juz: [30] },
  { number: 84,  name: "الانشقاق",      nameTransliteration: "Al-Inshiqaq",       nameMalay: "Terbelah",                   ayahCount: 25,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 85,  name: "البروج",        nameTransliteration: "Al-Buruj",          nameMalay: "Gugusan Bintang",            ayahCount: 22,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 86,  name: "الطارق",        nameTransliteration: "At-Tariq",          nameMalay: "Yang Datang di Malam Hari",  ayahCount: 17,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 87,  name: "الأعلى",        nameTransliteration: "Al-A'la",           nameMalay: "Yang Maha Tinggi",           ayahCount: 19,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 88,  name: "الغاشية",       nameTransliteration: "Al-Ghashiyah",      nameMalay: "Hari Pembalasan",            ayahCount: 26,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 89,  name: "الفجر",         nameTransliteration: "Al-Fajr",           nameMalay: "Fajar",                      ayahCount: 30,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 90,  name: "البلد",         nameTransliteration: "Al-Balad",          nameMalay: "Negeri",                     ayahCount: 20,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 91,  name: "الشمس",         nameTransliteration: "Ash-Shams",         nameMalay: "Matahari",                   ayahCount: 15,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 92,  name: "الليل",         nameTransliteration: "Al-Layl",           nameMalay: "Malam",                      ayahCount: 21,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 93,  name: "الضحى",         nameTransliteration: "Ad-Duha",           nameMalay: "Waktu Dhuha",                ayahCount: 11,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 94,  name: "الشرح",         nameTransliteration: "Ash-Sharh",         nameMalay: "Melapangkan",                ayahCount: 8,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 95,  name: "التين",         nameTransliteration: "At-Tin",            nameMalay: "Buah Tin",                   ayahCount: 8,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 96,  name: "العلق",         nameTransliteration: "Al-'Alaq",          nameMalay: "Segumpal Darah",             ayahCount: 19,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 97,  name: "القدر",         nameTransliteration: "Al-Qadr",           nameMalay: "Kemuliaan",                  ayahCount: 5,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 98,  name: "البينة",        nameTransliteration: "Al-Bayyinah",       nameMalay: "Bukti yang Nyata",           ayahCount: 8,   revelationType: "Madaniyyah", juz: [30] },
  { number: 99,  name: "الزلزلة",       nameTransliteration: "Az-Zalzalah",       nameMalay: "Kegoncangan",                ayahCount: 8,   revelationType: "Madaniyyah", juz: [30] },
  { number: 100, name: "العاديات",      nameTransliteration: "Al-'Adiyat",        nameMalay: "Yang Berlari Kencang",       ayahCount: 11,  revelationType: "Makkiyyah",  juz: [30] },
  { number: 101, name: "القارعة",       nameTransliteration: "Al-Qari'ah",        nameMalay: "Hari Kiamat yang Menggempur", ayahCount: 11, revelationType: "Makkiyyah",  juz: [30] },
  { number: 102, name: "التكاثر",       nameTransliteration: "At-Takathur",       nameMalay: "Bermegah-megah",             ayahCount: 8,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 103, name: "العصر",         nameTransliteration: "Al-'Asr",           nameMalay: "Masa",                       ayahCount: 3,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 104, name: "الهمزة",        nameTransliteration: "Al-Humazah",        nameMalay: "Pengumpat",                  ayahCount: 9,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 105, name: "الفيل",         nameTransliteration: "Al-Fil",            nameMalay: "Gajah",                      ayahCount: 5,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 106, name: "قريش",          nameTransliteration: "Quraysh",           nameMalay: "Suku Quraisy",               ayahCount: 4,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 107, name: "الماعون",       nameTransliteration: "Al-Ma'un",          nameMalay: "Barang-barang Berguna",      ayahCount: 7,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 108, name: "الكوثر",        nameTransliteration: "Al-Kawthar",        nameMalay: "Nikmat yang Banyak",         ayahCount: 3,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 109, name: "الكافرون",      nameTransliteration: "Al-Kafirun",        nameMalay: "Orang-orang Kafir",          ayahCount: 6,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 110, name: "النصر",         nameTransliteration: "An-Nasr",           nameMalay: "Pertolongan",                ayahCount: 3,   revelationType: "Madaniyyah", juz: [30] },
  { number: 111, name: "المسد",         nameTransliteration: "Al-Masad",          nameMalay: "Sabut",                      ayahCount: 5,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 112, name: "الإخلاص",       nameTransliteration: "Al-Ikhlas",         nameMalay: "Keikhlasan",                 ayahCount: 4,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 113, name: "الفلق",         nameTransliteration: "Al-Falaq",          nameMalay: "Waktu Subuh",                ayahCount: 5,   revelationType: "Makkiyyah",  juz: [30] },
  { number: 114, name: "الناس",         nameTransliteration: "An-Nas",            nameMalay: "Manusia",                    ayahCount: 6,   revelationType: "Makkiyyah",  juz: [30] },
];

/**
 * Get a surah by its number (1–114).
 * Returns undefined if the number is out of range.
 */
export function getSurahByNumber(n: number): Surah | undefined {
  if (n < 1 || n > 114) return undefined;
  return SURAHS[n - 1];
}

/**
 * Get all surahs that span a given juz number (1–30).
 */
export function getSurahsByJuz(juz: number): Surah[] {
  return SURAHS.filter((s) => s.juz.includes(juz));
}

/**
 * Search surahs by surah number, Arabic name, transliteration, or Malay name.
 * The search is case-insensitive and matches partial strings.
 */
export function searchSurahs(query: string): Surah[] {
  const q = query.trim().toLowerCase();
  if (!q) return SURAHS;

  const asNumber = parseInt(q, 10);
  return SURAHS.filter((s) => {
    if (!isNaN(asNumber) && s.number === asNumber) return true;
    if (s.name.includes(q)) return true;
    if (s.nameTransliteration.toLowerCase().includes(q)) return true;
    if (s.nameMalay.toLowerCase().includes(q)) return true;
    return false;
  });
}
