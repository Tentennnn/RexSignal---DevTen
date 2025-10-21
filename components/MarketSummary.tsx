import React, { useState, useEffect } from 'react';
import { getMarketSummaryData } from '../services/geminiService';
import type { Language, MarketSummaryData, MarketEvent } from '../types';

const translations = {
  en: {
    title: 'Market Summary',
    news: 'Market News',
    dxy: 'US Dollar Index (DXY)',
    events: 'Key Events',
    loading: 'Loading summary...',
    error: 'Failed to load summary.',
    lastUpdated: 'Last Updated',
  },
  km: {
    title: 'សង្ខេបទីផ្សារ',
    news: 'ព័ត៌មានទីផ្សារ',
    dxy: 'សន្ទស្សន៍ដុល្លារអាមេរិក (DXY)',
    events: 'ព្រឹត្តិការណ៍សំខាន់ៗ',
    loading: 'កំពុងទាញយកសេចក្តីសង្ខេប...',
    error: 'ការទាញយកសេចក្តីសង្ខេបបានបរាជ័យ។',
    lastUpdated: 'បានปรับปรุงចុងក្រោយ',
  },
};

const ImpactIcon: React.FC<{ impact: MarketEvent['impact'] }> = ({ impact }) => {
  const iconMap = {
    high: { icon: '🔥', color: 'text-red-400', bg: 'bg-red-900/50' },
    medium: { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-900/50' },
    low: { icon: '💤', color: 'text-blue-400', bg: 'bg-blue-900/50' },
  };
  const { icon, color, bg } = iconMap[impact] || iconMap.low;

  return (
    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${bg}`}>
      <span className={`text-xl ${color}`}>{icon}</span>
    </div>
  );
};

const MarketSummary: React.FC<{ language: Language }> = ({ language }) => {
  const [summary, setSummary] = useState<MarketSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMarketSummaryData();
        setSummary(data);
      } catch (e) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary space-y-4">
      <div className="mb-1">
          <h2 className="text-xl font-bold text-gold-400 border-b-2 border-gold-800 pb-2">{t.title}</h2>
          {summary && !loading && (
             <p className="text-xs text-gray-500 mt-1">
                {t.lastUpdated}: {new Date(summary.lastUpdated).toLocaleString(language === 'km' ? 'km-KH' : 'en-US')}
            </p>
          )}
      </div>

      {loading && <div className="text-center p-4 text-gray-400">{t.loading}</div>}
      {error && <div className="text-center p-4 text-red-500">{error}</div>}

      {summary && (
        <div className="space-y-5 animate-fade-in text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-gold-500">{t.news}</h3>
            <p className="text-gray-300 leading-relaxed">{summary.news}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gold-500">{t.dxy}</h3>
            <p className="text-gray-300 leading-relaxed">{summary.dxy}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gold-500">{t.events}</h3>
            <ul className="space-y-3">
              {summary.events.map((event, index) => (
                <li key={index} className="flex items-center space-x-4 bg-dark-tertiary p-3 rounded-lg transition-colors hover:bg-dark-primary">
                  <ImpactIcon impact={event.impact} />
                  <div>
                    <p className="font-medium text-gray-200">{event.name}</p>
                    <p className="text-xs text-gray-400">{event.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketSummary;
