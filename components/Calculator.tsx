
import React, { useState, useMemo } from 'react';
import type { Language } from '../types';

const translations = {
  en: {
    title: 'Trading Calculator',
    accountBalance: 'Account Balance ($)',
    riskPercentage: 'Risk (%)',
    stopLossPips: 'Stop Loss (pips)',
    calculate: 'Calculate',
    results: 'Results',
    lotSize: 'Lot Size',
    riskAmount: 'Amount to Risk',
    potentialProfit: 'Potential Profit (at 1:2 R:R)',
  },
  km: {
    title: 'ម៉ាស៊ីនគិតលេខជួញដូរ',
    accountBalance: 'សមតុល្យគណនី ($)',
    riskPercentage: 'ហានិភ័យ (%)',
    stopLossPips: 'បញ្ឈប់ការខាតបង់ (pips)',
    calculate: 'គណនា',
    results: 'លទ្ធផល',
    lotSize: 'ទំហំឡូត៍',
    riskAmount: 'ចំនួនទឹកប្រាក់ត្រូវប្រថុយ',
    potentialProfit: 'ប្រាក់ចំណេញសក្តានុពល (នៅ 1:2 R:R)',
  },
};

const Calculator: React.FC<{ language: Language }> = ({ language }) => {
  const [balance, setBalance] = useState('1000');
  const [risk, setRisk] = useState('2');
  const [slPips, setSlPips] = useState('50');
  const t = translations[language];

  const results = useMemo(() => {
    const balanceNum = parseFloat(balance);
    const riskNum = parseFloat(risk);
    const slPipsNum = parseFloat(slPips);

    if (isNaN(balanceNum) || isNaN(riskNum) || isNaN(slPipsNum) || slPipsNum <= 0) {
      return null;
    }

    const riskAmount = balanceNum * (riskNum / 100);
    // For Gold (XAU/USD), 1 pip = $0.1 for 0.01 lot. So 1 lot pip value is $10.
    const pipValuePerLot = 10;
    const lossPerLot = slPipsNum * pipValuePerLot;
    const lotSize = riskAmount / lossPerLot;
    const potentialProfit = riskAmount * 2; // Assuming 1:2 Risk/Reward

    return {
      lotSize: lotSize.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      potentialProfit: potentialProfit.toFixed(2),
    };
  }, [balance, risk, slPips]);

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

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary space-y-4">
      <h2 className="text-xl font-bold text-gold-400 border-b-2 border-gold-800 pb-2">{t.title}</h2>
      <div className="space-y-4">
        <InputField label={t.accountBalance} value={balance} onChange={(e) => setBalance(e.target.value)} />
        <InputField label={t.riskPercentage} value={risk} onChange={(e) => setRisk(e.target.value)} />
        <InputField label={t.stopLossPips} value={slPips} onChange={(e) => setSlPips(e.target.value)} />
      </div>

      {results && (
        <div className="bg-dark-tertiary p-4 rounded-md mt-4 space-y-2">
            <h3 className="font-semibold text-gold-500 mb-2">{t.results}</h3>
            <div className="flex justify-between text-sm">
                <span className="text-gray-300">{t.lotSize}:</span>
                <span className="font-bold text-white">{results.lotSize}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-300">{t.riskAmount}:</span>
                <span className="font-bold text-red-400">${results.riskAmount}</span>
            </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-300">{t.potentialProfit}:</span>
                <span className="font-bold text-green-400">${results.potentialProfit}</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
