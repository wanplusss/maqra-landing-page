/**
 * @typedef {Object} TasmikRecord
 * @property {string} id - Unique log entry ID
 * @property {string} studentId - Student identifier
 * @property {string} date - Timestamp string of the session
 * @property {string} kategori - Category ('Nazirah' | "Saba'" | 'Sabqi' | 'Manzil' | 'Talaqqi' | 'Murajaah AM' | 'Syahadah' | "Iqra'" | 'Tilawah')
 * @property {string} gred - Performance grade ('Mumtaz' | 'Jayyid Jiddan' | 'Jayyid' | 'Sederhana' | 'Maqbul')
 * @property {number} from - Start page of the session
 * @property {number} to - End page of the session
 * @property {number} juzuk - Juz' index derived from page number
 * @property {string} surah - Surah name derived from page number
 * @property {string} ulasan - Teacher's narrative feedback
 * @property {string} masalah - Weakness identifier (e.g. makhraj, tajwid errors)
 * @property {string} cadangan - Teacher recommendations for study targets
 * @property {string} guru - Full teacher name who verified this session
 */
export const TasmikRecordInterface = {};
