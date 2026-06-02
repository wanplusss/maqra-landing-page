const EMPTY_DB = {
  students: [],
  school: {
    slug: "al-furqan",
    name: "Maahad Tahfiz Al-Furqan",
    address: "",
    description: "",
    phone: "",
    email: "",
    founded: 2024,
    qrCode: ""
  },
  teachers: [],
  admin: { email: "", password: "", name: "" },
  superadmin: { email: "", password: "", name: "" },
  schools: [],
  tasmik_records: [],
  announcements: [],
  student_targets: {}
};

export function getMockDb() {
  const data = localStorage.getItem("maqra_db");
  if (data) return JSON.parse(data);
  return structuredClone(EMPTY_DB);
}

export function saveMockDb(db) {
  localStorage.setItem("maqra_db", JSON.stringify(db));
}
