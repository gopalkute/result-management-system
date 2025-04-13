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

const excelToStudents = function (filePath, branch) {
   const workbook = xlsx.readFile(filePath);
   const sheetName = workbook.SheetNames[0];
   const sheet = workbook.Sheets[sheetName];

   const jsonData = xlsx.utils.sheet_to_json(sheet);

   // Format the data
   const students = jsonData.map((row) => ({
      prn: row.PRN.toString(),
      name: row.Name,
      email: row.Email,
      password: row.Password, // This will be hashed later
      branch: branch,
   }));

   return students;
};

export { excelToJSON, excelToStudents };
