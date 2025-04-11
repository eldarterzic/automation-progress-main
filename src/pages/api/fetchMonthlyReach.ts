import { google } from 'googleapis';
import path from 'path';

const SPREADSHEET_ID = '1smR_W8wWpePaSxqmquJK6MIshIjzXU5JmXrovTZ0vH8'; // Replace with your Google Spreadsheet ID
const SHEET_NAME = 'Use case metadata'; // Replace with the name of the sheet containing Monthly Reach data

const SERVICE_ACCOUNT_KEY_PATH = path.resolve(
  process.cwd(),
  'data-driven-usecase-mapper-93b84d14c4a4.json' // Replace with the correct path to your service account key
);

export default async function handler(req, res) {
  try {
    console.log("Fetching Monthly Reach data from Google Sheets...");
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_NAME,
    });

    console.log("response", response.data.values);

    // Disable caching
    res.setHeader('Cache-Control', 'no-store');

    res.status(200).json(response.data.values || []);
  } catch (error) {
    console.error('Error fetching Monthly Reach data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
  }
}