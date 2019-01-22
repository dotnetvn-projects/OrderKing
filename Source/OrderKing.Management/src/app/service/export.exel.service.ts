import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, headerArray: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {header: headerArray});

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.r; C <= range.e.r; ++C) {
      const address = XLSX.utils.encode_col(C) + '1'; // <-- first row, column number C
      if (!worksheet[address]) {
         continue;
      }
      worksheet[address].v = worksheet[address].v.toUpperCase();
      worksheet[address].width = 200;
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  // public exportAsExcelFile1(json: any[], excelFileName: string, headersArray: any[]): void {
//   //Excel Title, Header, Data
//   const header = headersArray;
//   const data = json;
//   //Create workbook and worksheet
//   let workbook = new Workbook();
//   let worksheet = workbook.addWorksheet(excelFileName);
//   //Add Header Row
//   let headerRow = worksheet.addRow(header);
//   // Cell Style : Fill and Border
//   headerRow.eachCell((cell, number) => {
//     cell.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: { argb: 'FFFFFF00' },
//       bgColor: { argb: 'FF0000FF' }
//     }
//     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
//   })
//   // Add Data and Conditional Formatting
//   data.forEach((element) => {
//     let eachRow = [];
//     headersArray.forEach((headers) => {
//       eachRow.push(element[headers])
//     })
//     if (element.isDeleted === "Y") {
//       let deletedRow = worksheet.addRow(eachRow);
//       deletedRow.eachCell((cell, number) => {
//         cell.font = { name: 'Calibri', family: 4, size: 11, bold: false, strike: true };
//       })
//     } else {
//       worksheet.addRow(eachRow);
//     }
//   })
//   worksheet.getColumn(3).width = 15;
//   worksheet.getColumn(4).width = 20;
//   worksheet.getColumn(5).width = 30;
//   worksheet.getColumn(6).width = 30;
//   worksheet.getColumn(7).width = 10;
//   worksheet.addRow([]);
//   //Generate Excel File with given name
//   workbook.xlsx.writeBuffer().then((data) => {
//     let blob = new Blob([data], { type: EXCEL_TYPE });
//     fs.saveAs(blob, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//   })
// }

}



