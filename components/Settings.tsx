import React, { useState } from 'react';
import type { Language, User } from '../types';
import { api } from '../services/api';

const translations = {
  en: {
    title: 'Profile Settings',
    subtitle: 'Manage your account details and password.',
    name: 'Name',
    email: 'Email',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    saveChanges: 'Save Changes',
    success: 'Profile updated successfully!',
    error: 'Failed to update profile.',
    passwordMismatch: 'Passwords do not match.',
    passwordOptional: 'Leave blank to keep current password',
  },
  km: {
    title: 'ការកំណត់​ប្រវត្តិរូប',
    subtitle: 'គ្រប់គ្រងព័ត៌មានលម្អិតគណនី និងពាក្យសម្ងាត់របស់អ្នក។',
    name: 'ឈ្មោះ',
    email: 'អ៊ីមែល',
    newPassword: 'ពាក្យសម្ងាត់​ថ្មី',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី',
    saveChanges: 'រក្សាទុកការផ្លាស់ប្តូរ',
    success: 'ប្រវត្តិរូបបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!',
    error: 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប។',
    passwordMismatch: 'ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ។',
    passwordOptional: 'ទុក​ឲ្យ​នៅ​ទទេ ដើម្បី​រក្សា​ពាក្យ​សម្ងាត់​បច្ចុប្បន្ន',
  },
};

interface SettingsProps {
  language: Language;
  user: User;
  onUserUpdate: (updatedUser: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ language, user, onUserUpdate }) => {
  const t = translations[language];

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: t.passwordMismatch });
      return;
    }

    setLoading(true);

    const updates: Partial<User> = { name, email };
    if (newPassword) {
      updates.password = newPassword;
    }

    try {
      const updatedUser = await api.updateUser(user.id, updates);
      if (updatedUser) {
        onUserUpdate(updatedUser);
        setMessage({ type: 'success', text: t.success });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: t.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: t.error });
    } finally {
      setLoading(false);
    }
  };
  
  const Input = ({ label, type, value, onChange, placeholder }: { label: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
      <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
          <input
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full bg-dark-tertiary border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-gold-500 focus:border-gold-500"
          />
      </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto bg-dark-secondary rounded-lg shadow-2xl p-8 border border-dark-tertiary">
        <h1 className="text-2xl font-bold text-gold-400 mb-2">{t.title}</h1>
        <p className="text-gray-400 mb-6">{t.subtitle}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label={t.name} type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          
          <hr className="border-dark-tertiary" />
          
          <Input label={t.newPassword} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={t.passwordOptional} />
          <Input label={t.confirmPassword} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          {message && (
            <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
              {message.text}
            </div>
          )}
          
          <div>
            <button type="submit" disabled={loading} className="w-full bg-gold-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gold-700 transition-all duration-300 disabled:bg-gray-600">
              {loading ? '...' : t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;