# Google Sheets Backend Setup for DGIF

To support the latest features (Moderation, Admin Notifications, and Auto-Replies), please replace your current Google Apps Script code with the following.

## 1. Prepare your Spreadsheet
Ensure your "Reflections" or "Comments" sheet has these columns:
- **Timestamp** (Col A)
- **Name** (Col B)
- **Text** (Col C)
- **Approved** (Col D) - *Type "TRUE" here to make a reflection visible on the site.*

## 2. Updated Apps Script Code

```javascript
const ADMIN_EMAIL = "your-email@gmail.com"; // Change this to your email

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = data.slice(1);
  
  var result = rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, i) {
      obj[header] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (data.type === 'comment') {
    var sheet = ss.getSheets()[0]; // Reflections sheet
    sheet.appendRow([
      new Date(),
      data.name,
      data.text,
      false // Default Approved to false for moderation
    ]);
    return sendResponse({ status: 'success', message: 'Comment submitted for moderation' });
  } 
  
  if (data.type === 'application') {
    var sheet = ss.getSheets()[1] || ss.insertSheet("Applications"); // Applications sheet
    
    // Add headers if new sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Phone", "Financial Need", "Essay", "Academic Records", "Identity", "Financial", "Reference"]);
    }

    sheet.appendRow([
      new Date(),
      data.fullName,
      data.phone,
      data.financialNeed,
      data.essay,
      data.academicRecordsName || "Uploaded",
      data.identityDocumentName || "Uploaded",
      data.financialDocumentsName || "Uploaded",
      data.referenceLetterName || "Uploaded"
    ]);

    // ADMIN NOTIFICATION
    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        subject: "New Scholarship Application: " + data.fullName,
        body: "A new application has been received from " + data.fullName + ".\n\nPhone: " + data.phone + "\n\nView the spreadsheet for details."
      });
    } catch(err) {
      console.log("Email failed: " + err);
    }

    return sendResponse({ status: 'success' });
  }
}

function sendResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deployment
1. Go to **Deploy > New Deployment**.
2. Select **Web App**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Copy the **Web App URL** and ensure it matches your `VITE_GOOGLE_SHEETS_URL` in the foundation settings.
