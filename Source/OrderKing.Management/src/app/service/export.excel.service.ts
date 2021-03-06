import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ExportExcelModel } from '../model/export.excel.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private datePipe: DatePipe) {
  }


  generateExcel(model: ExportExcelModel) {
    const title = model.Title;
    const header = model.Headers;
    const data = model.Data;

     // Create workbook and worksheet
     const workbook = new Workbook();
     const worksheet = workbook.addWorksheet('Dữ liệu');

    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    worksheet.addRow([]);

    worksheet.addRow(['Ngày xuất file : ' + this.datePipe.transform(new Date(), 'medium')]);

    // Add Image
    const logo = workbook.addImage({
      base64: model.Logo,
      extension: 'jpeg',
    });

    // worksheet.addImage(logo, 'E1:F3');
    worksheet.mergeCells('A1:D2');

    // Blank Row
    worksheet.addRow([]);
    // Add Header Row
    const headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.font = { size: 12, bold: true };
    });

    // Add Data and Conditional Formatting
    data.forEach(d => {
       worksheet.addRow(d);
   });

    for (let i = 0; i < model.ColumnWidths.length; i ++) {
      worksheet.getColumn(i + 1).width = model.ColumnWidths[i];
    }

    // tslint:disable-next-line:no-shadowed-variable
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, model.FileName);
    });
  }

  // generateExcel1() {

  //   // Excel Title, Header, Data
  //   const title = 'Car Sell Report';
  //   const header = ['Year', 'Month', 'Make', 'Model', 'Quantity', 'Pct'];
  //   const data = [
  //     [2007, 1, 'Volkswagen ', 'Volkswagen Passat', 1267, 10],
  //     [2007, 1, 'Toyota ', 'Toyota Rav4', 819, 6.5],
  //     [2007, 1, 'Toyota ', 'Toyota Avensis', 787, 6.2],
  //     [2007, 1, 'Volkswagen ', 'Volkswagen Golf', 720, 5.7],
  //     [2007, 1, 'Toyota ', 'Toyota Corolla', 691, 5.4],
  //     [2007, 1, 'Peugeot ', 'Peugeot 307', 481, 3.8],
  //     [2008, 1, 'Toyota ', 'Toyota Prius', 217, 2.2],
  //     [2008, 1, 'Skoda ', 'Skoda Octavia', 216, 2.2],
  //     [2008, 1, 'Peugeot ', 'Peugeot 308', 135, 1.4],
  //     [2008, 2, 'Ford ', 'Ford Mondeo', 624, 5.9],
  //     [2008, 2, 'Volkswagen ', 'Volkswagen Passat', 551, 5.2],
  //     [2008, 2, 'Volkswagen ', 'Volkswagen Golf', 488, 4.6],
  //     [2008, 2, 'Volvo ', 'Volvo V70', 392, 3.7],
  //     [2008, 2, 'Toyota ', 'Toyota Auris', 342, 3.2],
  //     [2008, 2, 'Volkswagen ', 'Volkswagen Tiguan', 340, 3.2],
  //     [2008, 2, 'Toyota ', 'Toyota Avensis', 315, 3],
  //     [2008, 2, 'Nissan ', 'Nissan Qashqai', 272, 2.6],
  //     [2008, 2, 'Nissan ', 'Nissan X-Trail', 271, 2.6],
  //     [2008, 2, 'Mitsubishi ', 'Mitsubishi Outlander', 257, 2.4],
  //     [2008, 2, 'Toyota ', 'Toyota Rav4', 250, 2.4],
  //     [2008, 2, 'Ford ', 'Ford Focus', 235, 2.2],
  //     [2008, 2, 'Skoda ', 'Skoda Octavia', 225, 2.1],
  //     [2008, 2, 'Toyota ', 'Toyota Yaris', 222, 2.1],
  //     [2008, 2, 'Honda ', 'Honda CR-V', 219, 2.1],
  //     [2008, 2, 'Audi ', 'Audi A4', 200, 1.9],
  //     [2008, 2, 'BMW ', 'BMW 3-serie', 184, 1.7],
  //     [2008, 2, 'Toyota ', 'Toyota Prius', 165, 1.6],
  //     [2008, 2, 'Peugeot ', 'Peugeot 207', 144, 1.4]
  //   ];
  //   // Create workbook and worksheet
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Car Data');
  //   // Add Row and formatting
  //   const titleRow = worksheet.addRow([title]);
  //   titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
  //   worksheet.addRow([]);
  //   const subTitleRow = worksheet.addRow(['Date : ']);
  //   // Add Image
  //   const logo = workbook.addImage({
  //    // base64: logoFile.logoBase64,
  //     extension: 'png',
  //   });
  //   worksheet.addImage(logo, 'E1:F3');
  //   worksheet.mergeCells('A1:D2');

  //   // Blank Row
  //   worksheet.addRow([]);
  //   // Add Header Row
  //   const headerRow = worksheet.addRow(header);

  //   // Cell Style : Fill and Border
  //   headerRow.eachCell((cell, number) => {
  //     cell.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: 'FFFFFF00' },
  //       bgColor: { argb: 'FF0000FF' }
  //     };
  //     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  //   });
  //   // worksheet.addRows(data);
  //   // Add Data and Conditional Formatting
  //   data.forEach(d => {
  //     const row = worksheet.addRow(d);
  //     const qty = row.getCell(5);
  //     let color = 'FF99FF99';
  //     if (+qty.value < 500) {
  //       color = 'FF9999';
  //     }
  //     qty.fill = {
  //       type: 'pattern',
  //       pattern: 'solid',
  //       fgColor: { argb: color }
  //     };
  //   }
  //   );
  //   worksheet.getColumn(3).width = 30;
  //   worksheet.getColumn(4).width = 30;

  //   // tslint:disable-next-line:no-shadowed-variable
  //   workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
  //     const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //     fs.saveAs(blob, 'CarData.xlsx');
  //   });
  // }
}
