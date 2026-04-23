// Paste kode ini ke Google Apps Script
// Buka: script.google.com → Project baru → Code.gs

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data  = JSON.parse(e.postData.contents);

  sheet.appendRow([
    sheet.getLastRow(),                       // No (auto)
    data.nama,                                // Nama Pembeli
    data.makanan,                             // Jenis Makanan
    Number(data.jumlah),                      // Jumlah
    Number(data.harga),                       // Harga Satuan
    Number(data.total),                       // Total Harga
    new Date().toLocaleString("id-ID"),       // Timestamp
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows  = sheet.getDataRange().getValues();

  const data = rows.slice(1).map((row) => ({
    no:        row[0],
    nama:      row[1],
    makanan:   row[2],
    jumlah:    row[3],
    harga:     row[4],
    total:     row[5],
    timestamp: row[6],
  }));

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
