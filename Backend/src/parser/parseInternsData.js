import ExcelJs from 'exceljs'
import csvtojson from 'csvtojson'

const parseCSV = async function(filePath) {
      return csvtojson().fromFile(filePath)
}

const parseExcel = async function (filePath) {
    const workBook = new ExcelJs.Workbook()

    await workBook.xlsx.readFile(filePath)
    const sheet = workBook.worksheets[0]

    if(!sheet) return []

    const headers = sheet.getRow(1).values.slice(1)

    const data = []

    sheet.eachRow((row,index) => {
      if(index === 1) return;

      const obj = {}

      headers.forEach((h, i) => {
            obj[h] = row.getCell(i + 1).value;
      });
      data.push(obj)
    })

    return data
}

const parseFileToJson = async function(extension, internsFile){
    let data;

    if(extension === ".csv") {
        data = await parseCSV(internsFile)
    } else if(extension === ".xlsx"){
        data = await parseExcel(internsFile)
    }
    return data;
}

export default parseFileToJson;
