
import React from 'react';
import type { Language } from '../types';

const translations = {
  en: {
    title: 'Exclusive VIP Signals',
    description: 'Unlock high-accuracy signals, detailed analysis, and direct support from our expert traders. Join our VIP community for premium benefits.',
    feature1: 'Higher Win-Rate Signals',
    feature2: 'Real-time Push Notifications',
    feature3: 'Dedicated Telegram Channel',
    feature4: 'In-depth Market Breakdowns',
    upgrade: 'Upgrade to VIP Now',
    note: 'This section requires a paid membership. Backend integration is needed to manage users and access.',
  },
  km: {
    title: 'សញ្ញា VIP ផ្តាច់មុខ',
    description: 'ដោះសោសញ្ញាដែលមានភាពត្រឹមត្រូវខ្ពស់ ការវិភាគលម្អិត និងការគាំទ្រដោយផ្ទាល់ពីអ្នកជំនាញរបស់យើង។ ចូលរួមសហគមន៍ VIP របស់យើងដើម្បីទទួលបានអត្ថប្រយោជន៍ពិសេស។',
    feature1: 'សញ្ញាដែលមានអត្រាឈ្នះខ្ពស់ជាង',
    feature2: 'ការជូនដំណឹងភ្លាមៗ',
    feature3: 'ឆានែល Telegram ពិសេស',
    feature4: 'ការវិភាគទីផ្សារស៊ីជម្រៅ',
    upgrade: 'ដំឡើងទៅ VIP ឥឡូវនេះ',
    note: 'ផ្នែកនេះទាមទារសមាជិកភាពបង់ប្រាក់។ ការរួមបញ្ចូល Backend គឺត្រូវការជាចាំបាច់ដើម្បីគ្រប់គ្រងអ្នកប្រើប្រាស់និងការចូលប្រើប្រាស់។',
  },
};

const VipSection: React.FC<{ language: Language }> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="container mx-auto p-6 text-center">
      <div className="max-w-2xl mx-auto bg-dark-secondary rounded-lg shadow-2xl p-8 border-2 border-gold-600 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gold-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gold-500 rounded-full opacity-20"></div>

        <div className="relative z-10">
          <div className="mb-4">
            <span className="text-5xl" role="img" aria-label="crown">👑</span>
          </div>
          <h2 className="text-3xl font-bold text-gold-400 mb-4">{t.title}</h2>
          <p className="text-gray-300 mb-8">{t.description}</p>
          
          <ul className="text-left space-y-3 mb-8 inline-block">
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.feature1}</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.feature2}</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.feature3}</li>
            <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.feature4}</li>
          </ul>

          <div>
            <button className="bg-gold-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gold-700 transition-all duration-300 text-lg shadow-lg">
              {t.upgrade}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-8 italic">{t.note}</p>
        </div>
      </div>
    </div>
  );
};

export default VipSection;
