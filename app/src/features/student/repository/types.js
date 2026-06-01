/**
 * @typedef {Object} Student
 * @property {string} id - Unique registration ID (e.g. STU00123)
 * @property {string} name - Full student name
 * @property {string} kelas - Cohort class (e.g. Tahun 4)
 * @property {number} umur - Age in years
 * @property {number} frontier - Furthest memorized Quran page index (1-604)
 * @property {string} sex - Gender ('m' | 'f')
 * @property {string} parent - Parent contact phone number
 * @property {boolean} beginner - Whether student is in beginner Iqra' tier
 * @property {string} enroll - Enrollment date string
 * @property {number} target - Monthly target pages
 * @property {Object.<number, string>} statusMap - Page to status mapping
 */
export const StudentInterface = {};
