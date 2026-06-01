import { getJuzukFromPage, getSurahFromPage } from "./pageMapping.js";
import { STATUS_MAP } from "./statusColors.js";

export class MaqraGrid {
  constructor(statusMap = {}) {
    // Fill in default "belum" status if missing
    this.statusMap = {};
    for (let p = 1; p <= 604; p++) {
      this.statusMap[p] = statusMap[p] || "belum";
    }

    this.pages = this.generatePages();
    this.frontier = this.computeFrontier();
    this.tally = this.computeTally();
    this.progressPercent = this.computeProgressPercent();
  }

  generatePages() {
    const list = [];
    for (let p = 1; p <= 604; p++) {
      const s = this.statusMap[p];
      list.push({
        page: p,
        status: s,
        juzuk: getJuzukFromPage(p),
        surah: getSurahFromPage(p),
        css: STATUS_MAP[s]?.css || "belum"
      });
    }
    return list;
  }

  computeFrontier() {
    let frontier = 0;
    // Find the highest page that has been active (not "belum")
    for (let p = 604; p >= 1; p--) {
      if (this.statusMap[p] !== "belum") {
        frontier = p;
        break;
      }
    }
    return frontier;
  }

  computeTally() {
    const counts = {};
    for (const key in STATUS_MAP) {
      counts[key] = 0;
    }
    for (let p = 1; p <= 604; p++) {
      const s = this.statusMap[p];
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }

  computeProgressPercent() {
    // Standard progress calculates total non-belum/non-bacaan pages,
    // or simply based on frontier. Let's do memorized pages (hafazan, talaqqi, murajaah, syahadah, iqra, tilawah)
    const memorizedKeys = ["hafazan", "talaqqi", "murajaah", "syahadah", "iqra", "tilawah"];
    let count = 0;
    for (let p = 1; p <= 604; p++) {
      if (memorizedKeys.includes(this.statusMap[p])) {
        count++;
      }
    }
    return Math.round((count / 604) * 1000) / 10;
  }

  // Update a single page's status and return a new MaqraGrid instance
  updatePageStatus(page, status) {
    const newMap = { ...this.statusMap, [page]: status };
    return new MaqraGrid(newMap);
  }
}
