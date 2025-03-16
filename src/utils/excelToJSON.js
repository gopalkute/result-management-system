import xlsx from "xlsx";

const excelToJSON = function (filePath, branch, year, sem) {
   const workbook = xlsx.readFile(filePath);
   const sheetName = workbook.SheetNames[0];
   const sheet = workbook.Sheets[sheetName];

   // Convert sheet to JSON
   const jsonData = xlsx.utils.sheet_to_json(sheet);

   // Extract PRN, Subject Codes, and Marks and setup the result objects
   const results = jsonData.map((row) => ({
      prn: row.PRN.toString(),
      branch: branch,
      year: year,
      sem: sem,
      result: Object.keys(row)
         .filter((key) => key !== "PRN")
         .map((subject) => ({
            subject,
            grade: row[subject],
         })),
   }));

   return results;
};

export { excelToJSON };
