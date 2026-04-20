
import { Comment } from '../../types';

const GOOGLE_SHEETS_URL = (import.meta as any).env.VITE_GOOGLE_SHEETS_URL;

/**
 * Google Apps Script code to be used with this service:
 * 
 * function doGet(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   var data = sheet.getDataRange().getValues();
 *   var headers = data[0];
 *   var rows = data.slice(1);
 *   
 *   var result = rows.map(function(row) {
 *     var obj = {};
 *     headers.forEach(function(header, i) {
 *       obj[header] = row[i];
 *     });
 *     return obj;
 *   });
 *   
 *   return ContentService.createTextOutput(JSON.stringify(result))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 * 
 * function doPost(e) {
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
 *   var data = JSON.parse(e.postData.contents);
 *   
 *   sheet.appendRow([
 *     new Date(),
 *     data.name,
 *     data.text
 *   ]);
 *   
 *   return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
 *     .setMimeType(ContentService.MimeType.JSON);
 * }
 */

export const googleSheetsService = {
  async fetchComments(): Promise<Comment[]> {
    if (!GOOGLE_SHEETS_URL) {
      console.warn('VITE_GOOGLE_SHEETS_URL is not defined');
      return [];
    }

    try {
      const response = await fetch(GOOGLE_SHEETS_URL);
      const data = await response.json();
      
      return data
        .filter((item: any) => {
          // Flexible check for "Approved" column
          const approved = item.approved ?? item.Approved ?? item.isApproved ?? true; 
          return approved === true || approved === 'TRUE' || approved === 'true' || approved === 'Yes' || approved === 'checked';
        })
        .map((item: any, index: number) => {
        const timestamp = item.timestamp || item.Timestamp || item.TIMESTAMP;
        const name = item.name || item.Name || item.NAME;
        const text = item.text || item.Text || item.TEXT;

        return {
          id: index.toString(),
          name: name || 'Anonymous',
          text: text || '',
          date: timestamp ? new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'Recent'
        };
      }).reverse(); // Show newest first
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      throw error;
    }
  },

  async postComment(name: string, text: string): Promise<void> {
    if (!GOOGLE_SHEETS_URL) {
      throw new Error('VITE_GOOGLE_SHEETS_URL is not defined');
    }

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ type: 'comment', name, text }),
      });
    } catch (error) {
      console.error('Error posting to Google Sheets:', error);
      throw error;
    }
  },

  async submitApplication(applicationData: any): Promise<void> {
    if (!GOOGLE_SHEETS_URL) {
      throw new Error('VITE_GOOGLE_SHEETS_URL is not defined');
    }

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ type: 'application', ...applicationData }),
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }
};
