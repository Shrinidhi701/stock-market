import { NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'csv-parse/sync';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const stockName = req.headers.get('stockName') || "";
  const results: Array<Object> = [];
  const fileUrl = 'https://nsearchives.nseindia.com/content/equities/namechange.csv';
  try {
    const response = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/csv',
        'Referer': 'https://www.nseindia.com/',
        'Origin': 'https://www.nseindia.com'
      }
    });
    const csvText = Buffer.from(response.data, 'binary').toString('utf-8');
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    for (const row of records) {
      const prev = row['NCH_PREV_NAME']?.toLowerCase() || '';
      const current = row['NCH_NEW_NAME']?.toLowerCase() || '';
      if (
        prev.includes(stockName.toLowerCase()) ||
        current.includes(stockName.toLowerCase())
      ) {
        results.push({
          symbol: row['NCH_SYMBOL'],
          prev_name: row['NCH_PREV_NAME'],
          new_name: row['NCH_NEW_NAME'],
          change_date: row['NCH_DT'],
        });
      }
    }
    if (results.length === 0) {
      return NextResponse.json({ message: 'No matching stock found' }, { status: 404 });
    }
    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error parsing CSV:", error.message);
    return NextResponse.json(
      { error: 'Failed to fetch or parse CSV', details: error.message },
      { status: 500 }
    );
  }
}
