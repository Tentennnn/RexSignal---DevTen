
import React from 'react';
import type { Language, HistoricalSignal } from '../types';

const translations = {
  en: {
    title: 'Signal History',
    type: 'Type',
    entry: 'Entry',
    sl: 'SL',
    tp: 'TP',
    result: 'Result',
    pips: 'Pips',
    time: 'Time',
  },
  km: {
    title: 'ប្រវត្តិសញ្ញា',
    type: 'ប្រភេទ',
    entry: 'តម្លៃចូល',
    sl: 'SL',
    tp: 'TP',
    result: 'លទ្ធផល',
    pips: 'Pips',
    time: 'ពេលវេលា',
  },
};

const mockHistory: HistoricalSignal[] = [
    { id: 1, type: 'BUY', entry: 2335.50, sl: 2330.50, tp: 2345.50, result: 'WIN', pips: 100, timestamp: '2024-07-28 14:30 UTC' },
    { id: 2, type: 'SELL', entry: 2352.00, sl: 2357.00, tp: 2342.00, result: 'WIN', pips: 100, timestamp: '2024-07-28 09:15 UTC' },
    { id: 3, type: 'BUY', entry: 2340.10, sl: 2335.10, tp: 2345.10, result: 'LOSS', pips: -50, timestamp: '2024-07-27 18:00 UTC' },
    { id: 4, type: 'SELL', entry: 2365.80, sl: 2370.80, tp: 2350.80, result: 'WIN', pips: 150, timestamp: '2024-07-27 11:45 UTC' },
    { id: 5, type: 'BUY', entry: 2325.00, sl: 2320.00, tp: 2345.00, result: 'PENDING', pips: 0, timestamp: '2024-07-29 08:00 UTC' },
];

const SignalHistory: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];

  const getResultClasses = (result: HistoricalSignal['result']) => {
    switch (result) {
      case 'WIN': return 'bg-green-500/20 text-green-400';
      case 'LOSS': return 'bg-red-500/20 text-red-400';
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary">
      <h2 className="text-xl font-bold text-gold-400 border-b-2 border-gold-800 pb-2 mb-4">{t.title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-dark-tertiary">
            <tr>
              <th scope="col" className="px-4 py-3">{t.type}</th>
              <th scope="col" className="px-4 py-3">{t.entry}</th>
              <th scope="col" className="px-4 py-3">{t.sl}</th>
              <th scope="col" className="px-4 py-3">{t.tp}</th>
              <th scope="col" className="px-4 py-3">{t.result}</th>
              <th scope="col" className="px-4 py-3">{t.pips}</th>
              <th scope="col" className="px-4 py-3">{t.time}</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((signal) => (
              <tr key={signal.id} className="border-b border-dark-tertiary hover:bg-dark-tertiary/50">
                <td className="px-4 py-3">
                    <span className={`font-bold ${signal.type === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                        {signal.type}
                    </span>
                </td>
                <td className="px-4 py-3">{signal.entry.toFixed(2)}</td>
                <td className="px-4 py-3">{signal.sl.toFixed(2)}</td>
                <td className="px-4 py-3">{signal.tp.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getResultClasses(signal.result)}`}>
                    {signal.result}
                  </span>
                </td>
                <td className={`px-4 py-3 font-medium ${signal.pips > 0 ? 'text-green-500' : signal.pips < 0 ? 'text-red-500' : ''}`}>
                    {signal.pips > 0 ? `+${signal.pips}` : signal.pips}
                </td>
                <td className="px-4 py-3 text-gray-400">{signal.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SignalHistory;
