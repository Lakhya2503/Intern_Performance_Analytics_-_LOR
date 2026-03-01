import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { nonTechnicalDepartments, teachnicalDepartmentPara, technicalDepartments } from "../utils/constant.js";

export const generateLORService = async (data) => {
  const { name, department, endDate } = data;

  if (!name || !department || !endDate) {
    console.log(name);
    console.log(department);
    console.log(endDate);

    throw new Error("Missing required fields");
  }

  // Validate date
  const parsedDate = new Date(endDate);
  if (isNaN(parsedDate)) {
    throw new Error("Invalid endDate provided");
  }

  const formattedDate = parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
  });

  // Register fonts
  doc.registerFont("Outfit-Regular", "fonts/Outfit-Regular.ttf");
  doc.registerFont("Outfit-Bold", "fonts/Outfit-Bold.ttf");

  const buffers = [];
  doc.on("data", (chunk) => buffers.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);

        const dirPath = path.join("public", "lor_pdf");
        await fs.promises.mkdir(dirPath, { recursive: true });

        const safeName = name.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${safeName}-LOR-${Date.now()}.pdf`;
        const filePath = path.join(dirPath, fileName);

        await fs.promises.writeFile(filePath, pdfBuffer);

        resolve({ pdfBuffer, fileName });
      } catch (error) {
        reject(error);
      }
    });

    doc.on("error", reject);

    // ==============================
    // Background Template
    // ==============================
    const imagePath = path.join(
      process.cwd(),
      "public",
      "lorTemplate",
      "LOR_Template_With_CTA.png"
    );

    doc.image(imagePath, 0, 0, {
      fit: [doc.page.width, doc.page.height],
    });

    const textX = 44;
    let textY = 225;
    const contentWidth = 480;

    // ==============================
    // Date
    // ==============================
    doc
      .fillColor("black")
      .font("Outfit-Bold")
      .fontSize(13)
      .text(`Date : ${formattedDate}`, textX, textY, {
        width: contentWidth,
        align: "left",
      });

    textY += 40;

    // ==============================
    // Introduction Paragraph
    // ==============================
    const introFullText =
      `It is with great pleasure that I write this letter of recommendation for ` +
      `${name} ` +
      `who has successfully completed the internship as a ` +
      `${department} ` +
      `at Athenura.`;

    doc
      .font("Outfit-Regular")
      .fontSize(12)
      .text("It is with great pleasure that I write this letter of recommendation for ", textX, textY, { continued: true, width: contentWidth });

    doc
      .font("Outfit-Bold")
      .text(name + " ", { continued: true });

    doc
      .font("Outfit-Regular")
      .text("who has successfully completed the internship as a ", { continued: true });

    doc
      .font("Outfit-Bold")
      .text(department + " ", { continued: true });

    doc
      .font("Outfit-Regular")
      .text("at Athenura.", {
        paragraphGap: 10,
        width: contentWidth,
      });

    const introHeight = doc.heightOfString(introFullText, {
      width: contentWidth,
    });

    textY += introHeight + 20;

    // ==============================
    // Body Paragraphs
    // ==============================

 if(technicalDepartments.includes(department)){
     const paragraphs = [
      teachnicalDepartmentPara.firstPara,
      teachnicalDepartmentPara.secondPara,
      teachnicalDepartmentPara.thridPara,
      teachnicalDepartmentPara.fourthPara,
       ];

    for (const para of paragraphs) {
      doc.font("Outfit-Regular").fontSize(12);

      const paraHeight = doc.heightOfString(para, {
        width: contentWidth,
      });

      // Check page overflow BEFORE writing
      if (textY + paraHeight > doc.page.height - 100) {
        doc.addPage();
        doc.image(imagePath, 0, 0, {
          fit: [doc.page.width, doc.page.height],
        });
        textY = 50;
      }

      doc.text(para, textX, textY, {
        width: contentWidth,
        align: "justify",
      });

      textY += paraHeight + 25;
    }

} else {

     const paragraphs = [
      teachnicalDepartmentPara.firstPara,
      teachnicalDepartmentPara.secondPara,
      teachnicalDepartmentPara.thridPara,
      teachnicalDepartmentPara.fourthPara,
       ];

    for (const para of paragraphs) {
      doc.font("Outfit-Regular").fontSize(12);

      const paraHeight = doc.heightOfString(para, {
        width: contentWidth,
      });

      // Check page overflow BEFORE writing
      if (textY + paraHeight > doc.page.height - 100) {
        doc.addPage();
        doc.image(imagePath, 0, 0, {
          fit: [doc.page.width, doc.page.height],
        });
        textY = 50;
      }

      doc.text(para, textX, textY, {
        width: contentWidth,
        align: "justify",
      });

      textY += paraHeight + 25;
    }


}






    doc.end();
  });
};
