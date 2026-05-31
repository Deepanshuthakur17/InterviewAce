
const PDFParser = require('pdf2json');
const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => {
  console.error(errData.parserError);
  process.exit(1);
});
pdfParser.on("pdfParser_dataReady", pdfData => {
  console.log(JSON.stringify(pdfParser.getRawTextContent()));
});
pdfParser.loadPDF('D:\\InterviewAce\\temp_resume_0520d95e-36fb-4cd1-b063-d5f75ae820c3.pdf');
    