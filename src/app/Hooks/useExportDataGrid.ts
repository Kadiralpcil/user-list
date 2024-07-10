import { DataGridTypes } from "devextreme-react/data-grid";
import { exportDataGrid as exportDataGridPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportDataGridExcel } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";

export default function useExportDataGrid() {
  const onExporting = (e: DataGridTypes.ExportingEvent, fileName: string) => {
    if (e.format === "pdf") {
      const doc = new jsPDF();

      exportDataGridPdf({
        jsPDFDocument: doc,
        component: e.component,
        indent: 5,
      }).then(() => {
        doc.save(fileName + ".pdf");
      });
    } else if (e.format === "excel") {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Main sheet");

      exportDataGridExcel({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            fileName + ".xlsx"
          );
        });
      });
    }
  };

  return onExporting;
}
