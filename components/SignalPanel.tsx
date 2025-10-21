import React, { useState, useRef, useEffect, useMemo } from 'react';
import { getSignalRecommendationFromImage } from '../services/geminiService';
import { api } from '../services/api';
import type { Language, Signal, User } from '../types';

const translations = {
  en: {
    title: 'AI Signal Analysis',
    generating: 'Generating Signal...',
    error: 'Failed to fetch signal. Please try again.',
    confidence: 'Confidence',
    entry: 'Entry Price',
    stopLoss: 'Stop Loss',
    takeProfit: 'Take Profit',
    analysis: 'Indicator Analysis',
    buy: 'BUY',
    sell: 'SELL',
    wait: 'WAIT',
    uploadTitle: 'Analyze a Screenshot',
    uploadPrompt: 'Drag & drop or click to upload',
    uploadDesc: 'PNG or JPG',
    removeImage: 'Remove',
    analyzeScreenshot: 'Analyze Screenshot',
    step1Title: 'Step 1: Your Trading Setup',
    step2Title: 'Step 2: Upload Your Chart',
    accountBalance: 'Account Balance ($)',
    lotSize: 'Lot Size',
    riskPercentage: 'Risk (%)',
    leverage: 'Leverage',
    leverage2000: '1:2000',
    leverageUnlimited: 'Unlimited',
    next: 'Next',
    back: 'Back',
    analysisAgain: 'Analyze Another Screenshot',
    disclaimerTitle: 'AI Signal Disclaimer',
    disclaimerText: 'Please be aware that the AI-generated trading signal is for informational purposes only and is not financial advice. AI analysis is not 100% accurate and can make mistakes. Always conduct your own research and risk management before making any trades. Use this tool at your own risk.',
    disclaimerCancel: 'Cancel',
    disclaimerConfirm: 'I Understand & Analyze',
    aiRationale: 'AI Rationale',
    priceTargets: 'Price Targets',
    confidenceLevels: {
      veryHigh: 'Very High',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    // Usage Limit translations
    cooldown: 'On Cooldown. Analyze again in:',
    limitReached: 'You have reached your daily analysis limit.',
    usage: 'Usage Today:',
  },
  km: {
    title: 'การวิភាគสัญญาน AI',
    generating: 'កំពុងបង្កើតសញ្ញា...',
    error: 'ការទាញយកសញ្ញាបរាជ័យ។ សូម​ព្យាយាម​ម្តង​ទៀត។',
    confidence: 'ទំនុកចិត្ត',
    entry: 'តម្លៃចូល',
    stopLoss: 'បញ្ឈប់ការខាតបង់',
    takeProfit: 'យកប្រាក់ចំណេញ',
    analysis: 'ការវិភាគសូចនាករ',
    buy: 'ទិញ',
    sell: 'លក់',
    wait: 'រង់ចាំ',
    uploadTitle: 'វិភាគរូបថតអេក្រង់',
    uploadPrompt: 'អូសនិងទម្លាក់ឬចុចដើម្បីផ្ទុកឡើង',
    uploadDesc: 'PNG ឬ JPG',
    removeImage: 'លុបចេញ',
    analyzeScreenshot: 'វិភាគរូបថតអេក្រង់',
    step1Title: 'ជំហានទី១៖ ការរៀបចំការជួញដូររបស់អ្នក',
    step2Title: 'ជំហានទី២៖ បង្ហោះតារាងរបស់អ្នក',
    accountBalance: 'សមតុល្យគណនី ($)',
    lotSize: 'ទំហំឡូត៍',
    riskPercentage: 'ហានិភ័យ (%)',
    leverage: 'អានុភាព',
    leverage2000: '1:2000',
    leverageUnlimited: 'គ្មានដែនកំណត់',
    next: 'បន្ទាប់',
    back: 'ត្រឡប់ក្រោយ',
    analysisAgain: 'វិភាគរូបថតអេក្រង់ផ្សេងទៀត',
    disclaimerTitle: 'ការបដិសេធសញ្ញា AI',
    disclaimerText: 'សូមជ្រាបថា សញ្ញាជួញដូរដែលបង្កើតដោយ AI គឺសម្រាប់គោលបំណងផ្តល់ព័ត៌មានតែប៉ុណ្ណោះ ហើយមិនមែនជាដំបូន្មានផ្នែកហិរញ្ញវត្ថុទេ។ ការវិភាគរបស់ AI មិនត្រឹមត្រូវ 100% ទេ ហើយអាចមានកំហុស។ តែងតែធ្វើការស្រាវជ្រាវ និងគ្រប់គ្រងហានិភ័យដោយខ្លួនឯងមុននឹងធ្វើការជួញដូរណាមួយ។ ប្រើឧបករណ៍នេះដោយហានិភ័យផ្ទាល់ខ្លួនរបស់អ្នក។',
    disclaimerCancel: 'បោះបង់',
    disclaimerConfirm: 'ខ្ញុំយល់ព្រម & វិភាគ',
    aiRationale: 'ហេតុផលរបស់ AI',
    priceTargets: 'តម្លៃគោលដៅ',
    confidenceLevels: {
      veryHigh: 'ខ្ពស់ណាស់',
      high: 'ខ្ពស់',
      medium: 'មធ្យម',
      low: 'ទាប'
    },
    // Usage Limit translations
    cooldown: 'កំពុងរង់ចាំ។ វិភាគម្តងទៀតក្នុងរយៈពេល៖',
    limitReached: 'អ្នកបានដល់ដែនកំណត់នៃការវិភាគប្រចាំថ្ងៃរបស់អ្នកแล้ว។',
    usage: 'ការប្រើប្រាស់ថ្ងៃនេះ៖',
  },
};


// --- Sub-components for better organization ---

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 space-y-4">
        <div className="flex justify-center items-center">
             <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gold-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <p className="text-gold-300 animate-pulse">{message}</p>
    </div>
);

const SignalResultDisplay: React.FC<{ signal: Signal; language: Language; onAnalyzeAgain: () => void }> = ({ signal, language, onAnalyzeAgain }) => {
    const t = translations[language];

    const getConfidenceInfo = (value: number) => {
        if (value >= 85) return { text: t.confidenceLevels.veryHigh, color: "from-green-500 to-green-400", textColor: "text-green-300" };
        if (value >= 70) return { text: t.confidenceLevels.high, color: "from-lime-500 to-lime-400", textColor: "text-lime-300" };
        if (value >= 50) return { text: t.confidenceLevels.medium, color: "from-yellow-500 to-yellow-400", textColor: "text-yellow-300" };
        return { text: t.confidenceLevels.low, color: "from-red-600 to-red-500", textColor: "text-red-300" };
    };
    
    const confidenceInfo = getConfidenceInfo(signal.confidence);

    const signalInfo = {
        BUY: {
            bg: 'from-green-600 to-green-800',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />,
            text: t.buy,
            textColor: 'text-green-300'
        },
        SELL: {
            bg: 'from-red-600 to-red-800',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />,
            text: t.sell,
            textColor: 'text-red-300'
        },
        WAIT: {
            bg: 'from-gray-600 to-gray-800',
            icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5m-7.5 3h7.5m3-6.75H5.25c-1.12 0-2.063.914-2.063 2.063v7.874c0 1.149.943 2.063 2.063 2.063h13.5c1.12 0 2.063-.914-2.063-2.063V8.313c0-1.149-.943-2.063-2.063-2.063H16.5M13.5 12h-3m-3.375-3.375c.621 0 1.125.504 1.125 1.125s-.504 1.125-1.125 1.125-1.125-.504-1.125-1.125.504-1.125 1.125-1.125z" />,
            text: t.wait,
            textColor: 'text-gray-300'
        }
    };
    
    const currentSignal = signalInfo[signal.signal];

    const indicatorIcons: Record<string, React.ReactNode> = {
        ictConcept: <path fillRule="evenodd" d="M3.75 3A1.75 1.75 0 002 4.75v14.5A1.75 1.75 0 003.75 21h16.5A1.75 1.75 0 0022 19.25V4.75A1.75 1.75 0 0020.25 3H3.75zM20 7.5h-2.5V9.75a.75.75 0 01-1.5 0V7.5H13.5v2.25a.75.75 0 01-1.5 0V7.5H9.5v2.25a.75.75 0 01-1.5 0V7.5H5.5V19h14.5V7.5z" clipRule="evenodd" />,
        rsi: <path d="M10.06 10.06c.14-.14.22-.33.22-.53s-.08-.39-.22-.53a.75.75 0 00-1.06 1.06zM12 11.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM14.47 10.06a.75.75 0 00-1.06-1.06c-.14.14-.22.33-.22.53s.08.39.22.53a.75.75 0 001.06 0z" />,
        ema: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />,
        macd: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125-1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
        supportResistance: <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    };

    const indicatorDisplayMap: Record<string, string> = {
        ictConcept: 'ICT Concept',
        rsi: 'RSI',
        ema: 'EMA',
        macd: 'MACD',
        supportResistance: 'Support & Resistance'
    };


    return (
        <div className="space-y-6 animate-fade-in">
             <div className={`bg-gradient-to-br ${currentSignal.bg} p-4 rounded-lg flex items-center justify-between shadow-lg border border-white/10`}>
                <div className="flex items-center space-x-4">
                    <div className="bg-black/20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
                            {currentSignal.icon}
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-white">{currentSignal.text} SIGNAL</h3>
                        <p className={currentSignal.textColor}>XAU/USD @ ${signal.currentPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-white/70 uppercase">Timeframe</p>
                    <p className="font-semibold text-white bg-black/20 px-3 py-1 rounded-full text-sm mt-1">{signal.timeframe}</p>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-400">{t.confidence}</span>
                    <span className={`text-lg font-bold ${confidenceInfo.textColor}`}>{confidenceInfo.text} ({signal.confidence}%)</span>
                </div>
                <div className="w-full bg-dark-tertiary rounded-full h-4 overflow-hidden border-2 border-gray-700 shadow-inner">
                    <div className={`bg-gradient-to-r ${confidenceInfo.color} h-full rounded-full transition-all duration-500 ease-out`} style={{ width: `${signal.confidence}%` }} />
                </div>
            </div>
    
            <div className="bg-dark-tertiary p-4 rounded-lg border border-gray-700/50">
                <h3 className="font-semibold text-gold-400 mb-2">{t.aiRationale}</h3>
                <blockquote className="border-l-4 border-gold-600 pl-4 text-gray-300 italic">
                    <p>"{signal.summary}"</p>
                </blockquote>
            </div>
    
            <div>
                <h3 className="font-semibold mb-3">{t.priceTargets}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                     <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg">
                        <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">{t.entry}</p>
                        <p className="text-2xl font-mono font-bold text-white mt-1">{signal.entry.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-900/50 border border-red-700 p-3 rounded-lg">
                        <p className="text-sm font-bold uppercase text-red-300 tracking-wider">{t.stopLoss}</p>
                        <p className="text-2xl font-mono font-bold text-white mt-1">{signal.stopLoss.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-900/50 border border-green-700 p-3 rounded-lg">
                        <p className="text-sm font-bold uppercase text-green-300 tracking-wider">{t.takeProfit}</p>
                        <div className="flex justify-around items-center mt-1">
                            <div><span className="text-xs text-green-400">TP1</span><p className="text-lg font-mono font-bold text-white">{signal.takeProfit1.toFixed(2)}</p></div>
                            <div><span className="text-xs text-green-400">TP2</span><p className="text-lg font-mono font-bold text-white">{signal.takeProfit2.toFixed(2)}</p></div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div>
              <h3 className="font-semibold mb-3">{t.analysis}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-dark-tertiary p-4 rounded-md">
                {Object.entries(signal.analysis).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-3">
                         <div className="flex-shrink-0 bg-dark-primary p-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold-400">
                                {indicatorIcons[key] || indicatorIcons.rsi}
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-200">{indicatorDisplayMap[key] || key}</h4>
                            <p className="text-gray-400">{value}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>

            <button onClick={onAnalyzeAgain} className="w-full bg-dark-tertiary text-gold-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gold-800">
                {t.analysisAgain}
            </button>
        </div>
    );
};

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};


const AnalysisStatusDisplay: React.FC<{
  status: { canAnalyze: boolean; reason: string | null; timeLeft: number | null; dailyCount: number; dailyLimit: number; };
  language: Language;
}> = ({ status, language }) => {
    const [timeLeft, setTimeLeft] = useState(status.timeLeft);
    const t = translations[language];

    useEffect(() => {
        setTimeLeft(status.timeLeft);
        if (status.reason === 'cooldown' && status.timeLeft && status.timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => (prev ? prev - 1000 : 0));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [status]);

    if (status.canAnalyze) {
        return (
            <div className="text-center text-sm p-3 bg-green-900/50 text-green-300 border border-green-700 rounded-lg">
                <p>{t.usage} {status.dailyCount}/{status.dailyLimit}</p>
            </div>
        );
    }

    return (
        <div className="text-center text-sm p-3 bg-red-900/50 text-red-300 border border-red-700 rounded-lg">
            {status.reason === 'cooldown' && timeLeft && timeLeft > 0 && (
                <p>{t.cooldown} <span className="font-mono font-bold">{formatTime(timeLeft)}</span></p>
            )}
            {status.reason === 'limit' && (
                <p>{t.limitReached} ({status.dailyCount}/{status.dailyLimit})</p>
            )}
        </div>
    );
};


const SignalPanel: React.FC<{ language: Language, user: User | null }> = ({ language, user }) => {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [screenshotStep, setScreenshotStep] = useState(1);
  const [balance, setBalance] = useState('1000');
  const [lotSize, setLotSize] = useState('0.1');
  const [risk, setRisk] = useState('2');
  const [leverage, setLeverage] = useState('1:2000');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const [analysisStatus, setAnalysisStatus] = useState<{
      canAnalyze: boolean;
      reason: 'cooldown' | 'limit' | null;
      timeLeft: number | null;
      dailyCount: number;
      dailyLimit: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadingIntervalRef = useRef<number | null>(null);
  const t = translations[language];

  const loadingMessages = useMemo(() => [
    "Warming up the AI's neural networks... 🧠",
    "Analyzing your chart's structure... 📈",
    "Scanning for key price action patterns...",
    "Cross-referencing with market sentiment... 📊",
    "Calculating risk-to-reward ratios... ⚖️",
    "Finalizing the trading signal... ✨"
  ], []);

  const checkAnalysisStatus = async () => {
    if (user) {
        try {
            const status = await api.canUserAnalyze(user.id);
            setAnalysisStatus(status);
        } catch (error) {
            console.error("Failed to check analysis status:", error);
        }
    }
  };

  useEffect(() => {
    checkAnalysisStatus();
  }, [user]);


  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    }
  }, []);

  const resetScreenshotAnalysis = () => {
    setScreenshotStep(1);
    handleRemoveImage();
  };

  const processFile = (file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string)?.split(',')[1];
        if (base64String) {
          setImageBase64(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyzeAgain = () => {
    setSignal(null);
    setError(null);
    setScreenshotStep(1);
    handleRemoveImage();
    checkAnalysisStatus(); // Re-check status after finishing a flow
  };

  const fetchSignalFromImage = async () => {
    if (!imageBase64 || !imageFile || !user) return;

    setLoading(true);
    setError(null);
    setSignal(null);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);

    let messageIndex = 0;
    setLoadingMessage(loadingMessages[messageIndex]);
    loadingIntervalRef.current = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 2500);

    try {
      const newSignal = await getSignalRecommendationFromImage({
        imageData: { mimeType: imageFile.type, data: imageBase64 },
        balance, lotSize, risk, leverage
      });
      await api.addAnalysis(user.id, newSignal);
      setSignal(newSignal);
      resetScreenshotAnalysis();
    } catch (e) {
      setError(t.error);
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);
      checkAnalysisStatus(); // Refresh status after API call
    }
  };
  
  const isStep1Valid = balance && lotSize && risk && leverage;
  const canAnalyzeNow = analysisStatus?.canAnalyze ?? false;

  const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, value, onChange}) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-gold-500 focus:border-gold-500"
        />
    </div>
  );

  const DisclaimerModal: React.FC<{onConfirm: () => void; onCancel: () => void}> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-yellow-800 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">{t.disclaimerTitle}</h3>
        <p className="text-gray-300 mb-6 text-sm">{t.disclaimerText}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-dark-tertiary text-gray-300 hover:bg-gray-700 transition-colors">{t.disclaimerCancel}</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-gold-600 text-white hover:bg-gold-700 font-semibold transition-colors">{t.disclaimerConfirm}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary space-y-6">
      <h2 className="text-xl font-bold text-gold-400 border-b-2 border-gold-800 pb-2">{t.title}</h2>
      
      {loading && <LoadingIndicator message={loadingMessage} />}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {signal && !loading && !error && (
        <SignalResultDisplay signal={signal} language={language} onAnalyzeAgain={handleAnalyzeAgain} />
      )}
      
      {!loading && !signal && (
        <>
        {analysisStatus && <AnalysisStatusDisplay status={analysisStatus} language={language} />}
          <div className="bg-dark-tertiary p-4 rounded-lg border border-gray-700/50">
            {screenshotStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                  <h3 className="font-semibold text-center text-lg text-gold-400">{t.step1Title}</h3>
                  <InputField label={t.accountBalance} value={balance} onChange={(e) => setBalance(e.target.value)} />
                  <InputField label={t.lotSize} value={lotSize} onChange={(e) => setLotSize(e.target.value)} />
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t.leverage}</label>
                    <select
                        value={leverage}
                        onChange={(e) => setLeverage(e.target.value)}
                        className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-gold-500 focus:border-gold-500"
                    >
                        <option value="1:2000">{t.leverage2000}</option>
                        <option value="Unlimited">{t.leverageUnlimited}</option>
                    </select>
                  </div>
                  <InputField label={t.riskPercentage} value={risk} onChange={(e) => setRisk(e.target.value)} />
                  <button
                    onClick={() => setScreenshotStep(2)}
                    disabled={!isStep1Valid || !canAnalyzeNow}
                    className="w-full bg-gold-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gold-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {t.next}
                  </button>
              </div>
            )}

            {screenshotStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="font-semibold text-center text-lg text-gold-400">{t.step2Title}</h3>
                {!imagePreview ? (
                  <div 
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex justify-center items-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-gold-500 bg-dark-secondary' : 'border-gray-600 hover:border-gray-500 hover:bg-dark-secondary'}`}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/png, image/jpeg" />
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                      <p className="mt-1 text-sm text-gray-400 font-semibold">{t.uploadPrompt}</p>
                      <p className="text-xs text-gray-500">{t.uploadDesc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                        <img src={imagePreview} alt="Chart preview" className="rounded-lg w-full max-h-64 object-contain"/>
                        <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs hover:bg-black/80">{t.removeImage}</button>
                    </div>
                    <button
                      onClick={() => setShowDisclaimer(true)}
                      disabled={!imageBase64 || loading || !canAnalyzeNow}
                      className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {t.analyzeScreenshot}
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => setScreenshotStep(1)} 
                  className="w-full text-sm text-gray-400 hover:text-white text-center py-1"
                >
                  {t.back}
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {showDisclaimer && (
        <DisclaimerModal
          onConfirm={() => {
            setShowDisclaimer(false);
            fetchSignalFromImage();
          }}
          onCancel={() => setShowDisclaimer(false)}
        />
      )}
    </div>
  );
};

export default SignalPanel;