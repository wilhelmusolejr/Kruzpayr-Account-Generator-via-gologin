import fs from "fs";
import csv from "csv-parser";
import { parse } from "json2csv";

function readCSV(file) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(file)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

function writeCSV(file, data) {
  return new Promise((resolve, reject) => {
    try {
      const csvData = parse(data, {
        fields: Object.keys(data[0]), // Keeps headers intact
        quote: "", // Prevents unnecessary quotes
        delimiter: ",", // Uses a comma as the separator
        header: true, // Ensures the header is included
        quoteEmpty: false, // Prevents empty fields from being quoted
        escapedQuote: "", // Ensures no escaping of quotes
      });

      fs.writeFileSync(file, csvData, "utf8");
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export { writeCSV, readCSV };
