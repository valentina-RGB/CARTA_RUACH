import { GoogleSpreadsheet } from "google-spreadsheet";

export interface SheetConfig {
  spreadsheetId: string;
  apiKey: string;
  sheetName?: string;
  sheetIndex?: number;
}

export class GoogleSheetsClient {
  private doc: GoogleSpreadsheet;
  private config: SheetConfig;

  constructor(config: SheetConfig) {
    this.config = config;
    this.doc = new GoogleSpreadsheet(config.spreadsheetId, {
      apiKey: config.apiKey,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.doc.loadInfo();
      console.log(`📊 Conectado a Google Sheet: ${this.doc.title}`);
    } catch (error) {
      console.error(`❌ Error conectando a Google Sheets:`, error);
      throw new Error(`Failed to connect to Google Sheets: ${error}`);
    }
  }

  async getSheetData(sheetName?: string, sheetIndex?: number): Promise<any[]> {
    const targetSheetName = sheetName || this.config.sheetName;
    const targetSheetIndex = sheetIndex ?? this.config.sheetIndex ?? 0;

    let sheet;
    if (targetSheetName) {
      sheet = this.doc.sheetsByTitle[targetSheetName];
    }
    
    if (!sheet) {
      sheet = this.doc.sheetsByIndex[targetSheetIndex];
    }

    if (!sheet) {
      throw new Error(`No se encontró la hoja: ${targetSheetName || `índice ${targetSheetIndex}`}`);
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    console.log(`📂 Datos obtenidos de la hoja "${sheet.title}": ${rows.length} filas`);
    return rows;
  }

  getSpreadsheetInfo() {
    return {
      title: this.doc.title,
      sheetCount: this.doc.sheetCount,
      sheets: this.doc.sheetsByIndex.map(sheet => ({
        title: sheet.title,
        index: sheet.index,
        rowCount: sheet.rowCount,
        columnCount: sheet.columnCount
      }))
    };
  }
}