// Base Strategy Interface
class ImportParsingStrategy {
  parse(rawContent) {
    throw new Error("Parse method must be implemented");
  }
}

// JSON Parsing Strategy
export class JsonImportStrategy extends ImportParsingStrategy {
  parse(rawContent) {
    try {
      const data = JSON.parse(rawContent);
      return Array.isArray(data) ? data : [data];
    } catch (e) {
      throw new Error("Fail JSON tidak sah: " + e.message);
    }
  }
}

// CSV Parsing Strategy (Simple RFC 4180 parsing)
export class CsvImportStrategy extends ImportParsingStrategy {
  parse(rawContent) {
    const lines = rawContent.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/^["']|["']$/g, ""));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || "";
      });
      records.push(obj);
    }
    return records;
  }
}
