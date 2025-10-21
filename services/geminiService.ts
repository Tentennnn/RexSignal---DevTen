
import type { Signal, MarketSummaryData } from '../types';

interface ImageAnalysisParams {
    imageData: { mimeType: string; data: string };
    balance: string;
    lotSize: string;
    risk: string;
    leverage: string;
}

export const getSignalRecommendationFromImage = async (params: ImageAnalysisParams): Promise<Signal> => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getSignalFromImage', payload: params }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API call failed with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching signal from image via API route:", error);
        throw new Error("Failed to get signal from image.");
    }
};


export const getMarketSummaryData = async (): Promise<MarketSummaryData> => {
    try {
         const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'getMarketSummary' }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API call failed with status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching market summary via API route:", error);
        throw new Error("Failed to get market summary.");
    }
};
