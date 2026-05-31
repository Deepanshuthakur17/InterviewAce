
const PDFParser = require('pdf2json');
const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => {
  console.error(errData.parserError);
  process.exit(1);
});
pdfParser.on("pdfParser_dataReady", pdfData => {
  console.log(JSON.stringify(pdfParser.getRawTextContent()));
});
pdfParser.loadPDF('D:\\InterviewAce\\temp_resume.pdf');
    