import React, { useState } from 'react';
import type { Language, User } from '../types';
import { api } from '../services/api';

const translations = {
  en: {
    title: 'Welcome to RexSignal',
    subtitleLogin: 'Login to your account',
    subtitleSignup: 'Create a new account',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    signup: 'Sign Up',
    toggleToSignup: "Don't have an account? Sign Up",
    toggleToLogin: "Already have an account? Login",
    loginError: 'Invalid credentials. Please try again.',
    registerError: 'Registration failed. Please try again.',
    userExistsError: 'A user with that name or email already exists.',
  },
  km: {
    title: 'សូមស្វាគមន៍មកកាន់ RexSignal',
    subtitleLogin: 'ចូលគណនីរបស់អ្នក',
    subtitleSignup: 'បង្កើតគណនីថ្មី',
    username: 'ឈ្មោះ​អ្នកប្រើប្រាស់',
    email: 'អ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    login: 'ចូល',
    signup: 'ចុះឈ្មោះ',
    toggleToSignup: 'មិនមានគណនី? ចុះឈ្មោះ',
    toggleToLogin: 'មានគណនីហើយ? ចូល',
    loginError: 'ព័ត៌មានសម្ងាត់មិនត្រឹមត្រូវទេ។ សូម​ព្យាយាម​ម្តង​ទៀត។',
    registerError: 'ការចុះឈ្មោះបានបរាជ័យ។ សូម​ព្យាយាម​ម្តង​ទៀត។',
    userExistsError: 'អ្នកប្រើប្រាស់ដែលមានឈ្មោះ ឬអ៊ីមែលនេះមានរួចហើយ។',
  },
};

interface LoginProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ language, onLogin, setLanguage }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      setError(null);
      try {
        const user = await api.login(username, password);
        if (user) {
          onLogin(user);
        } else {
          setError(t.loginError);
        }
      } catch (err) {
        setError(t.loginError);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      setLoading(true);
      setError(null);
      try {
        const newUser = await api.register(username, email, password);
        if (newUser) {
          onLogin(newUser); // Auto-login after successful registration
        } else {
          setError(t.userExistsError);
        }
      } catch (err) {
        setError(t.registerError);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4 z-20">
        <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-sm rounded-l-md ${
            language === 'en' ? 'bg-gold-600 text-white' : 'bg-dark-tertiary text-gray-300'
            }`}
        >
            EN
        </button>
        <button
            onClick={() => setLanguage('km')}
            className={`px-3 py-1 text-sm rounded-r-md ${
            language === 'km' ? 'bg-gold-600 text-white' : 'bg-dark-tertiary text-gray-300'
            }`}
        >
            KH
        </button>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-dark-secondary rounded-2xl shadow-2xl border border-dark-tertiary">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gold-400">📊 {t.title}</h1>
          <p className="mt-2 text-gray-400">{isLoginView ? t.subtitleLogin : t.subtitleSignup}</p>
        </div>

        {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        
        {isLoginView ? (
          <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                  <label htmlFor="username" className="text-sm font-bold text-gray-400 block mb-2">{t.username}</label>
                  <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 bg-dark-tertiary border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-gold-500" placeholder={t.username} required />
              </div>
              <div>
                  <label htmlFor="password" className="text-sm font-bold text-gray-400 block mb-2">{t.password}</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-dark-tertiary border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-gold-500" placeholder={t.password} required />
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 disabled:bg-gray-600 transition">
                  {loading ? '...' : t.login}
              </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                  <label htmlFor="reg-username" className="text-sm font-bold text-gray-400 block mb-2">{t.username}</label>
                  <input id="reg-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 bg-dark-tertiary border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-gold-500" placeholder={t.username} required />
              </div>
               <div>
                  <label htmlFor="reg-email" className="text-sm font-bold text-gray-400 block mb-2">{t.email}</label>
                  <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-dark-tertiary border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-gold-500" placeholder="you@example.com" required />
              </div>
              <div>
                  <label htmlFor="reg-password" className="text-sm font-bold text-gray-400 block mb-2">{t.password}</label>
                  <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-dark-tertiary border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-gold-500" placeholder={t.password} required />
              </div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition">
                  {loading ? '...' : t.signup}
              </button>
          </form>
        )}
        
        <p className="text-center text-sm text-gray-400">
            <button onClick={() => { setIsLoginView(!isLoginView); setError(null); }} className="font-medium text-gold-400 hover:text-gold-300">
                {isLoginView ? t.toggleToSignup : t.toggleToLogin}
            </button>
        </p>

      </div>
    </div>
  );
};

export default Login;