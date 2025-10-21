import React, { useState, useMemo, useEffect } from 'react';
import type { Language, User, AnalysisRecord, Signal } from '../types';
import { api } from '../services/api';

const translations = {
  en: {
    title: 'Admin Dashboard',
    manageUsers: 'Manage Users',
    userAnalysis: 'User AI Signal Analysis',
    noUserSelected: 'Select a user to view their analysis history.',
    loadingData: 'Loading data...',
    user: 'User',
    email: 'Email',
    key: 'Key',
    status: 'Status',
    actions: 'Actions',
    generateKey: 'New Key',
    grantVIP: 'Grant VIP',
    revokeVIP: 'Revoke VIP',
    updateSignal: 'Update Signal',
    close: 'Close',
    saveChanges: 'Save Changes',
    editingSignalFor: 'Editing Signal for',
    // Signal fields
    signal: 'Signal',
    confidence: 'Confidence',
    entry: 'Entry',
    sl: 'Stop Loss',
    tp1: 'Take Profit 1',
    tp2: 'Take Profit 2',
    summary: 'Summary',
  },
  km: {
    title: 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល',
    manageUsers: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
    userAnalysis: 'ការវិភាគសញ្ញា AI របស់អ្នកប្រើប្រាស់',
    noUserSelected: 'ជ្រើសរើសអ្នកប្រើប្រាស់ដើម្បីមើលប្រវត្តិវិភាគរបស់ពួកគេ។',
    loadingData: 'កំពុងផ្ទុកទិន្នន័យ...',
    user: 'អ្នក​ប្រើ',
    email: 'អ៊ីមែល',
    key: 'កូនសោ',
    status: 'ស្ថានភាព',
    actions: 'សកម្មភាព',
    generateKey: 'កូនសោថ្មី',
    grantVIP: 'ផ្តល់ VIP',
    revokeVIP: 'ដក VIP',
    updateSignal: 'ធ្វើបច្ចុប្បន្នភាពសញ្ញា',
    close: 'បិទ',
    saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
    editingSignalFor: 'កំពុងកែសម្រួលសញ្ញាសម្រាប់',
    // Signal fields
    signal: 'សញ្ញា',
    confidence: 'ទំនុកចិត្ត',
    entry: 'តម្លៃចូល',
    sl: 'បញ្ឈប់ការខាតបង់',
    tp1: 'TP 1',
    tp2: 'TP 2',
    summary: 'សង្ខេប',
  },
};

const UpdateSignalModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  signal: AnalysisRecord | null;
  user: User | null;
  onSave: (updatedSignal: AnalysisRecord) => void;
  language: Language;
}> = ({ isOpen, onClose, signal, user, onSave, language }) => {
  const [editedSignal, setEditedSignal] = useState<AnalysisRecord | null>(signal);
  const t = translations[language];

  React.useEffect(() => {
    setEditedSignal(signal);
  }, [signal]);

  if (!isOpen || !editedSignal || !user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumber = ['confidence', 'entry', 'stopLoss', 'takeProfit1', 'takeProfit2'].includes(name);
    setEditedSignal(prev => prev ? { ...prev, [name]: isNumber ? parseFloat(value) : value } : null);
  };

  const handleSave = () => {
    if (editedSignal) {
      onSave(editedSignal);
      onClose();
    }
  };
  
  const Input = ({ label, name, type = "number", value }: { label: string, name: keyof Signal, type?: string, value: any }) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={handleInputChange} className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-secondary rounded-lg shadow-2xl border border-gold-800 w-full max-w-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gold-400">{t.editingSignalFor} <span className="text-white">{user.name}</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.signal}</label>
              <select name="signal" value={editedSignal.signal} onChange={handleInputChange} className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white">
                  <option>BUY</option>
                  <option>SELL</option>
                  <option>WAIT</option>
              </select>
          </div>
          <Input label={t.confidence} name="confidence" value={editedSignal.confidence} />
          <Input label={t.entry} name="entry" value={editedSignal.entry} />
          <Input label={t.sl} name="stopLoss" value={editedSignal.stopLoss} />
          <Input label={t.tp1} name="takeProfit1" value={editedSignal.takeProfit1} />
          <Input label={t.tp2} name="takeProfit2" value={editedSignal.takeProfit2} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.summary}</label>
            <textarea name="summary" value={editedSignal.summary} rows={3} onChange={handleInputChange} className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white" />
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-dark-tertiary text-gray-300 hover:bg-gray-700">{t.close}</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-gold-600 text-white font-bold hover:bg-gold-700">{t.saveChanges}</button>
        </div>
      </div>
    </div>
  );
};


const AdminDashboard: React.FC<{ language: Language }> = ({ language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signalToEdit, setSignalToEdit] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const t = translations[language];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const fetchedUsers = await api.getAllUsers();
      const fetchedAnalyses = await api.getAllAnalyses();
      setUsers(fetchedUsers);
      setAnalyses(fetchedAnalyses);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleUserAction = async (userId: string, action: 'toggleVIP' | 'newKey') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    let updatedUser: User | undefined;

    if (action === 'toggleVIP') {
      updatedUser = await api.updateUser(userId, { status: user.status === 'VIP' ? 'Free' : 'VIP' });
    }
    if (action === 'newKey') {
      updatedUser = await api.updateUser(userId, { key: `key_${Math.random().toString(36).substr(2, 9)}` });
    }

    if(updatedUser) {
      setUsers(users.map(u => u.id === userId ? updatedUser! : u));
    }
  };

  const handleOpenUpdateModal = (signal: AnalysisRecord) => {
    setSignalToEdit(signal);
    setIsModalOpen(true);
  }

  const handleSaveChanges = async (updatedSignal: AnalysisRecord) => {
    const savedSignal = await api.updateAnalysis(updatedSignal.id, updatedSignal);
    if (savedSignal) {
        setAnalyses(analyses.map(a => a.id === savedSignal.id ? savedSignal : a));
    }
  };

  const selectedUserAnalyses = useMemo(() => {
    if (!selectedUserId) return [];
    return analyses.filter(a => a.userId === selectedUserId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedUserId, analyses]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-400">
        <p>{t.loadingData}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gold-400">{t.title}</h1>
      
      {/* User Management */}
      <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary">
        <h2 className="text-xl font-bold text-gold-500 mb-4">{t.manageUsers}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-dark-primary">
              <tr>
                <th className="px-4 py-3">{t.user}</th>
                <th className="px-4 py-3">{t.email}</th>
                <th className="px-4 py-3">{t.key}</th>
                <th className="px-4 py-3">{t.status}</th>
                <th className="px-4 py-3 text-center">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} 
                  className={`border-b border-dark-tertiary hover:bg-dark-tertiary/50 cursor-pointer ${selectedUserId === user.id ? 'bg-gold-900/50' : ''}`}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3 font-mono text-gray-400">{user.key}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'VIP' ? 'bg-gold-500/20 text-gold-400' : 'bg-gray-500/20 text-gray-300'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); handleUserAction(user.id, 'newKey')}} className="text-blue-400 hover:text-blue-300 text-xs font-bold">{t.generateKey}</button>
                    {user.name.toLowerCase() !== 'admin' && (
                        user.status === 'VIP' ? (
                        <button onClick={(e) => { e.stopPropagation(); handleUserAction(user.id, 'toggleVIP')}} className="text-red-500 hover:text-red-400 text-xs font-bold">{t.revokeVIP}</button>
                        ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleUserAction(user.id, 'toggleVIP')}} className="text-green-500 hover:text-green-400 text-xs font-bold">{t.grantVIP}</button>
                        )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Analysis History */}
      <div className="bg-dark-secondary p-6 rounded-lg shadow-2xl border border-dark-tertiary">
        <h2 className="text-xl font-bold text-gold-500 mb-4">{t.userAnalysis}</h2>
        {selectedUserId ? (
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-dark-primary">
                <tr>
                    <th>{t.signal}</th>
                    <th>{t.entry}</th>
                    <th>{t.sl}</th>
                    <th>{t.tp1}</th>
                    <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedUserAnalyses.map(analysis => (
                    <tr key={analysis.id} className="border-b border-dark-tertiary">
                        <td className="py-2"><span className={`font-bold text-xs p-1 rounded ${analysis.signal === 'BUY' ? 'bg-green-500/20 text-green-400' : analysis.signal === 'SELL' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>{analysis.signal}</span></td>
                        <td>{analysis.entry.toFixed(2)}</td>
                        <td>{analysis.stopLoss.toFixed(2)}</td>
                        <td>{analysis.takeProfit1.toFixed(2)}</td>
                        <td><button onClick={() => handleOpenUpdateModal(analysis)} className="text-gold-400 hover:text-gold-300 text-xs font-bold">{t.updateSignal}</button></td>
                    </tr>
                ))}
              </tbody>
             </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">{t.noUserSelected}</p>
        )}
      </div>

      <UpdateSignalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        signal={signalToEdit}
        user={users.find(u => u.id === signalToEdit?.userId) || null}
        onSave={handleSaveChanges}
        language={language}
      />
    </div>
  );
};

export default AdminDashboard;