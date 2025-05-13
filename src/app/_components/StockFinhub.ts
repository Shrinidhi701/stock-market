// @ts-ignore
import finnhub from 'finnhub';
import { finhubConfig } from "@/app/_config/finhub";

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finhubConfig.apiKey;
export const finnhubClient = new finnhub.DefaultApi()

export const symbolLookup = async (symbol: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/search?q=${symbol.trim().toUpperCase()}&exchange=US&token=${finhubConfig.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result && data.result.length > 0) {
      const exactMatch = data.result.find(
        (entry: any) => entry.symbol.toUpperCase() === symbol.toUpperCase()
      );
      return exactMatch?.description || data.result[0].description || 'Unknown Company';
    } else {
      throw new Error('No results found');
    }
  } catch (err) {
    console.error('Symbol lookup failed:', err);
    throw err;
  }
};