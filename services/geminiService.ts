import { GoogleGenAI, Type } from "@google/genai";
import type { Signal, MarketSummaryData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const signalSchema = {
    type: Type.OBJECT,
    properties: {
        signal: { type: Type.STRING, enum: ["BUY", "SELL", "WAIT"] },
        confidence: { type: Type.NUMBER, description: "Confidence level from 0 to 100" },
        currentPrice: { type: Type.NUMBER, description: "The current market price the analysis is based on." },
        timeframe: { type: Type.STRING, enum: ["Scalp", "Intraday", "Swing"], description: "The suggested trading timeframe." },
        summary: { type: Type.STRING, description: "A brief summary of the trading rationale." },
        analysis: {
            type: Type.OBJECT,
            properties: {
                ictConcept: { type: Type.STRING, description: "Analysis using Inner Circle Trader (ICT) concepts like Fair Value Gaps, Order Blocks, and Liquidity." },
                rsi: { type: Type.STRING, description: "Analysis of the Relative Strength Index." },
                ema: { type: Type.STRING, description: "Analysis of Exponential Moving Averages." },
                macd: { type: Type.STRING, description: "Analysis of the MACD indicator." },
                supportResistance: { type: Type.STRING, description: "Analysis of key support and resistance levels." },
            },
            required: ["ictConcept", "rsi", "ema", "macd", "supportResistance"],
        },
        entry: { type: Type.NUMBER, description: "Suggested entry price." },
        stopLoss: { type: Type.NUMBER, description: "Suggested stop loss price." },
        takeProfit1: { type: Type.NUMBER, description: "Suggested first take profit price." },
        takeProfit2: { type: Type.NUMBER, description: "Suggested second take profit price." },
    },
    required: ["signal", "confidence", "currentPrice", "timeframe", "summary", "analysis", "entry", "stopLoss", "takeProfit1", "takeProfit2"],
};

interface ImageAnalysisParams {
    imageData: { mimeType: string; data: string };
    balance: string;
    lotSize: string;
    risk: string;
    leverage: string;
}

export const getSignalRecommendationFromImage = async ({ imageData, balance, lotSize, risk, leverage }: ImageAnalysisParams): Promise<Signal> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: imageData.mimeType,
                data: imageData.data,
            },
        };

        const textPart = {
            text: `You are an expert Forex analyst for XAU/USD (Gold). Analyze the provided trading chart screenshot and provide a detailed trading signal.

            **Crucially, tailor your recommendation based on the following user-provided trading parameters:**
            - Account Balance: $${balance}
            - Desired Lot Size: ${lotSize}
            - Account Leverage: ${leverage}
            - Risk Percentage per trade: ${risk}%
    
            Your analysis should be comprehensive, including analysis of Inner Circle Trader (ICT) concepts (like Fair Value Gaps, Order Blocks, Liquidity), RSI, EMA, MACD, and key support/resistance levels. Your summary should be based SOLELY on the image. Identify a realistic current price from the screenshot for your analysis. Ensure the suggested stop-loss aligns with the user's risk percentage. Your response must be in JSON format.`
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: signalSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Signal;
    } catch (error) {
        console.error("Error fetching signal from image:", error);
        throw new Error("Failed to get signal from image using Gemini API.");
    }
};


export const getMarketSummaryData = async (): Promise<MarketSummaryData> => {
    try {
        const today = new Date().toUTCString();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Act as a financial news analyst for Gold (XAU/USD). Provide a brief, up-to-date market summary for today, ${today}. Include an analysis of the US Dollar Index (DXY) and list any key upcoming economic events for the rest of the day/week, specifying their impact level (high, medium, low). Your response must be in JSON format and include a 'lastUpdated' field with the current UTC timestamp.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        news: { type: Type.STRING, description: "Today's market summary for XAU/USD." },
                        dxy: { type: Type.STRING, description: "Today's analysis of the DXY." },
                        events: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    impact: { type: Type.STRING, enum: ["high", "medium", "low"] },
                                    date: { type: Type.STRING },
                                },
                                required: ["name", "impact", "date"],
                            },
                        },
                        lastUpdated: { type: Type.STRING, description: "The UTC timestamp of when this data was generated." }
                    },
                    required: ["news", "dxy", "events", "lastUpdated"],
                },
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MarketSummaryData;
    } catch (error) {
        console.error("Error fetching market summary:", error);
        throw new Error("Failed to get market summary from Gemini API.");
    }
};