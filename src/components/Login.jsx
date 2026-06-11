import React, { useState } from 'react';
import { 
  DollarSign, ShieldAlert, Key, ArrowRight, Mail, UserPlus, Unlock, CheckCircle, 
  Sun, Moon, Eye, EyeOff, ShieldCheck, TrendingUp, Bot, Zap, Bell, Globe, Star, Check, User, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';

// Comprehensive list of all world countries with flag emojis
const WORLD_COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' }
];

export default function Login({ onLogin, onBackToHome, darkMode, setDarkMode, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // High-fidelity signup states
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [country, setCountry] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Simulated Interactive OAuth states
  const [activeOAuthProvider, setActiveOAuthProvider] = useState(null); // null, 'google', 'facebook', 'apple'
  const [oauthStep, setOauthStep] = useState('choose'); // 'choose', 'loading'
  const [simulatedEmail, setSimulatedEmail] = useState('');



  // Email validation state for real-time checkmark
  const isEmailValid = email.includes('@') && email.includes('.');

  // Dynamic Password Strength Calculator
  const getPasswordStrength = () => {
    if (!password) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3', text: 'text-rose-500' };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3', text: 'text-rose-500' };
    if (password.length < 8) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3', text: 'text-amber-500' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full', text: 'text-emerald-500' };
  };
  const strength = getPasswordStrength();

  const getAuthErrorMessage = (authError) => {
    const errorCode = authError?.code || authError?.name;
    const message = authError?.message || '';
    const normalizedMessage = message.toLowerCase();

    if (errorCode === 'invalid_credentials' || 
        errorCode === 'invalid_grant' || 
        normalizedMessage.includes('invalid login credentials') || 
        normalizedMessage.includes('invalid credentials') || 
        normalizedMessage.includes('invalid_grant') || 
        normalizedMessage.includes('invalid password') || 
        normalizedMessage.includes('user not found') ||
        normalizedMessage.includes('no user')) {
      return 'Invalid email or password. If this is a new account, use Sign Up first.';
    }

    if (errorCode === 'email_not_confirmed' || normalizedMessage.includes('email not confirmed')) {
      return 'Please confirm your email from the Supabase verification email before logging in.';
    }

    if (normalizedMessage.includes('email provider is disabled')) {
      return 'Email/password login is disabled in Supabase. Enable it in Authentication > Providers > Email.';
    }

    return message || 'Authentication failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
    }

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    if (mode !== 'otp' && !password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!country) {
        setError('Please select your country.');
        return;
      }
      if (!agreeToTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (authError) {
          setError(getAuthErrorMessage(authError));
          setLoading(false);
        } else {
          setSuccessMsg('🎉 Login successful! Redirecting to your dashboard...');
          setTimeout(() => {
            onLogin(data?.user?.email || email.trim());
          }, 1000);
        }
      } else if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName.trim(),
              country: country,
            },
          }
        });

        if (signUpError) {
          setError(getAuthErrorMessage(signUpError));
          setLoading(false);
        } else {
          if (data?.session) {
            setSuccessMsg('🎉 Registration successful! Redirecting to your dashboard...');
            setTimeout(() => {
              onLogin(data?.user?.email || email.trim());
            }, 1000);
          } else {
            setSuccessMsg('✉️ Verification email sent! Open the email and click the link to confirm your account and sign in.');
            setLoading(false);
          }
        }
      } else if (mode === 'otp') {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (otpError) {
          setError(getAuthErrorMessage(otpError));
          setLoading(false);
        } else {
          setSuccessMsg('✉️ Magic Link sent! Click the entry link in your email to log in instantly.');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Connection parameters failed. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    setError('');
    setSuccessMsg('');
    setActiveOAuthProvider(provider);
    setOauthStep('choose');
    setSimulatedEmail('');
  };

  const handleSimulatedSubmit = (e) => {
    if (e) e.preventDefault();
    if (!simulatedEmail) return;
    
    setOauthStep('loading');
    setTimeout(() => {
      // Save authenticated session and simulated email to local storage
      localStorage.setItem('xchange_loggedin', 'true');
      localStorage.setItem('xchange_profile_name', simulatedEmail.split('@')[0] || 'User');
      localStorage.setItem('xchange_profile_email', simulatedEmail);
      
      // Close authorization modal and sign in
      setActiveOAuthProvider(null);
      // We pass the email up so App.jsx can register it
      onLogin(simulatedEmail);
    }, 1500);
  };

  const handleRealOAuth = async (provider) => {
    setActiveOAuthProvider(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      console.warn('Real Supabase OAuth redirect failed:', err);
      setError('OAuth provider redirection failed. Verify redirect settings.');
    }
  };

  const renderOAuthModal = () => (
    <AnimatePresence>
      {activeOAuthProvider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070b19]/60 backdrop-blur-md">
          {/* Modal Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveOAuthProvider(null)}
            className="absolute inset-0 cursor-pointer"
          />

          {/* Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white text-slate-800 rounded-[24px] shadow-2xl overflow-hidden border border-slate-200 font-sans z-10"
          >
            {/* Browser Header Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div onClick={() => setActiveOAuthProvider(null)} className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1 text-[9px] font-semibold text-slate-400 select-none w-52 truncate text-center flex items-center justify-center gap-1">
                <span className="text-emerald-605">🔒</span>
                <span>
                  {activeOAuthProvider === 'google' && 'https://accounts.google.com/o/oauth2'}
                  {activeOAuthProvider === 'facebook' && 'https://www.facebook.com/dialog/oauth'}
                  {activeOAuthProvider === 'apple' && 'https://appleid.apple.com/auth'}
                </span>
              </div>
              <div className="w-6" />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {oauthStep === 'choose' ? (
                <>
                  {/* Brand Header */}
                  <div className="text-center space-y-3 mb-6">
                    {activeOAuthProvider === 'google' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Sign in with Google</h3>
                      </>
                    )}

                    {activeOAuthProvider === 'facebook' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                          <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Log in with Facebook</h3>
                      </>
                    )}

                    {activeOAuthProvider === 'apple' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm">
                          <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.71-1.16 1.86-1.01 2.97 1.1.09 2.23-.6 2.94-1.42z"/>
                          </svg>
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Sign in with Apple ID</h3>
                      </>
                    )}
                    <p className="text-[10px] font-semibold text-slate-400 mt-2">Enter your email to simulate a login to <span className="font-bold text-slate-700">FinVerse</span></p>
                  </div>

                  {/* Interactive Selection Body */}
                  <div className="space-y-4">
                    <form onSubmit={handleSimulatedSubmit} className="space-y-3">
                      <div className="relative">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={simulatedEmail}
                          onChange={(e) => setSimulatedEmail(e.target.value)}
                          placeholder="example@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          activeOAuthProvider === 'facebook' ? 'bg-[#1877F2] hover:bg-[#166fe5] shadow-blue-500/20' : 
                          activeOAuthProvider === 'apple' ? 'bg-slate-900 hover:bg-slate-950' :
                          'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        }`}
                      >
                        <span>Continue</span>
                      </button>
                    </form>

                    <div className="relative my-4 text-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-150" /></div>
                      <span className="relative bg-white px-2.5 text-[8px] uppercase tracking-wider text-slate-400 font-black">or</span>
                    </div>

                    <button
                      onClick={() => handleRealOAuth(activeOAuthProvider)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-extrabold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>⚡ Connect Real Supabase OAuth</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveOAuthProvider(null)}
                      className="w-full py-3 rounded-xl border border-slate-250 hover:bg-slate-50 text-xs font-extrabold text-slate-600 transition-all cursor-pointer mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                /* Loading Step */
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-600 rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Authorizing secure connection...</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">
                      Redirecting back to <span className="text-purple-600 font-black">FinVerse</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // ==================== LIGHT MODE RENDER (SPLIT PANE) ====================
  if (!darkMode) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 font-sans selection:bg-purple-500/20 overflow-x-hidden relative">
        
        {/* Background ambient orbs - ultra-high-performance radial gradients (No expensive blur filter paint cost!) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none transform-gpu" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none transform-gpu" />

        {/* Main split-pane frame container - scaled to max-w-5xl with hardware GPU rendering */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-white/70 backdrop-blur-lg border border-slate-200/80 rounded-[36px] p-6 sm:p-8 lg:p-9 shadow-2xl relative transform-gpu will-change-transform">
          
          {/* 1. LEFT PANE - BRANDING & ANIMS */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-10">
            
            {/* Logo brand header */}
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center">
                {/* Rotating background gradient glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 opacity-20 blur-[6px] animate-pulse" />
                
                {/* High-fidelity SVG logo with custom inline animations */}
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-11 h-11 relative z-10 drop-shadow-[0_4px_10px_rgba(147,51,234,0.35)]"
                >
                  <defs>
                    <linearGradient id="logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Central Dollar Sign - pulsing gently */}
                  <text
                    x="50%"
                    y="55%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="font-black fill-[url(#logo-grad)] text-[38px] select-none"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    $
                  </text>
                  
                  {/* Rotating arrows group - slowly spinning clockwise */}
                  <g 
                    style={{ 
                      animation: 'spin 12s linear infinite', 
                      transformOrigin: 'center' 
                    }}
                  >
                    {/* Top-Right Arc */}
                    <path
                      d="M 22 40 A 32 32 0 0 1 78 30"
                      fill="none"
                      stroke="url(#logo-grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    {/* Top-Right Arrowhead */}
                    <path
                      d="M 72 24 L 80 30 L 75 38"
                      fill="none"
                      stroke="url(#logo-grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Bottom-Left Arc */}
                    <path
                      d="M 78 60 A 32 32 0 0 1 22 70"
                      fill="none"
                      stroke="url(#logo-grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                    {/* Bottom-Left Arrowhead */}
                    <path
                      d="M 28 76 L 20 70 L 25 62"
                      fill="none"
                      stroke="url(#logo-grad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
                  FinVerse
                </span>
                <span className="font-semibold text-xs block text-purple-600 uppercase tracking-widest font-bold mt-1">
                  Currency Converter
                </span>
              </div>
            </div>

            {/* Core Message & Orbit Sphere representation */}
            <div className="space-y-6 relative">
              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-slate-900">
                  Convert. Compare. <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-650 bg-clip-text text-transparent">Conquer.</span>
                </h2>
                <p className="text-slate-500 text-sm font-semibold">Your Global Finance Companion</p>
              </div>

              {/* Orbit & Planet Visual Arena - slightly larger h-64 with GPU acceleration */}
              <div className="relative w-full h-64 flex items-center justify-center overflow-hidden py-10 rounded-3xl bg-slate-100/50 border border-slate-200/80 transform-gpu will-change-transform">
                
                {/* Pedestal base glow rings */}
                <div className="absolute bottom-2 w-64 h-10 bg-gradient-to-t from-purple-500/10 to-blue-500/5 blur-sm rounded-full pointer-events-none" />
                <div className="absolute bottom-4 w-52 h-5 border border-purple-500/20 rounded-full pointer-events-none" />

                {/* Central Glowing Planet Sphere */}
                <div className="absolute w-24 h-24 bg-gradient-to-tr from-purple-600 via-indigo-650 to-blue-500 rounded-full shadow-xl shadow-purple-500/20 flex items-center justify-center z-10 transform-gpu will-change-transform">
                  <Globe className="w-12 h-12 text-white/20 animate-spin transform-gpu will-change-transform" style={{ animationDuration: '20s' }} />
                </div>

                {/* Orbiting Ring lines */}
                <div className="absolute w-44 h-44 border border-slate-300 rounded-full animate-spin pointer-events-none transform-gpu will-change-transform" style={{ animationDuration: '6s' }} />
                <div className="absolute w-52 h-24 border border-purple-500/10 rounded-full animate-pulse pointer-events-none rotate-45" />

                {/* Floating Token Badges */}
                <div className="absolute top-6 left-16 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 text-xs shadow-sm animate-bounce" style={{ animationDelay: '0.2s' }}>$</div>
                <div className="absolute top-8 right-20 w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-650 text-xs shadow-sm animate-pulse" style={{ animationDelay: '0.8s' }}>€</div>
                <div className="absolute bottom-8 right-24 w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-600 text-xs shadow-sm animate-bounce" style={{ animationDelay: '1.2s' }}>£</div>
                <div className="absolute bottom-12 left-20 w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-600 text-xs shadow-sm animate-pulse">¥</div>
                <div className="absolute top-20 right-8 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-600 text-xs shadow-sm animate-bounce" style={{ animationDelay: '0.5s' }}>₿</div>

                {/* 3D Stack of Gold Coins on the left side */}
                <div className="absolute bottom-4 left-10 flex flex-col -space-y-2 z-20">
                  <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-sm transform -skew-x-12" />
                  <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-sm transform -skew-x-12" />
                  <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-sm transform -skew-x-12 animate-pulse" />
                </div>

                {/* Floating Glassmorphic Rate Card with neon trend graph */}
                <motion.div 
                  drag
                  dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
                  className="absolute bottom-4 right-6 z-30 bg-white/95 backdrop-blur-md border border-purple-200/50 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2 w-52 cursor-grab hover:scale-105 transition-transform duration-300 transform-gpu will-change-transform"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[8px] font-black text-white">🇺🇸</div>
                      <div className="w-6 h-6 rounded-full bg-orange-500 border border-white flex items-center justify-center text-[8px] font-black text-white">🇮🇳</div>
                    </div>
                    <span className="text-[8px] font-extrabold uppercase text-slate-500">USD / INR</span>
                  </div>

                  {/* SVG trend graph line */}
                  <div className="h-10 w-full relative overflow-hidden">
                    <svg className="w-full h-full text-purple-600 animate-pulse" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chart-glow-light" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0 25 Q 15 5, 30 20 T 60 12 T 80 22 T 100 5 L 100 30 L 0 30 Z" 
                        fill="url(#chart-glow-light)" 
                      />
                      <path 
                        d="M 0 25 Q 15 5, 30 20 T 60 12 T 80 22 T 100 5" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-[8px] border-t border-slate-200 pt-1.5 mt-0.5">
                    <span className="font-extrabold text-slate-700">1 USD = 83.45</span>
                    <span className="text-emerald-600 flex items-center gap-0.5 font-black text-[8px]">
                      <TrendingUp className="w-2.5 h-2.5" /> +0.5%
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Features Grid highlights (6 cards) - scaled gap to gap-3 */}
            <div className="grid grid-cols-3 gap-3">
              
              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <TrendingUp className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">Rates</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Live exchange</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <Bot className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">AI Advisor</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Smart advice</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <ShieldCheck className="w-4 h-4 text-emerald-650 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">Secure</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Data safe</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">Crypto</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">100+ coins</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <Bell className="w-4 h-4 text-orange-500 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">Alerts</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Instant alerts</p>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-3 bg-slate-100/50 border border-slate-200/80 rounded-xl hover:border-slate-300/80 hover:bg-slate-200/20 transition-all">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-800 leading-tight">Global</h4>
                  <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Worldwide</p>
                </div>
              </div>

            </div>



          </div>

          {/* 2. RIGHT PANE - AUTH FORM */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-[28px] p-6 sm:p-8 lg:p-9 shadow-xl relative">
            
            {/* Form Top Utility Bar */}
            <div className="flex items-center justify-between mb-6">
              {/* Back to Home Button */}
              {onBackToHome ? (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-extrabold transition-all cursor-pointer text-slate-600 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              ) : (
                <div />
              )}

              {/* Theme Switcher */}
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setDarkMode(true)}
                  className="p-1 rounded-full flex items-center gap-1.5 cursor-pointer bg-slate-200/80 border border-slate-300 shadow-sm transition-all"
                  title="Switch to Dark Mode"
                >
                  <div className="flex items-center justify-center p-1 rounded-full bg-white text-purple-650 transition-all">
                    <Sun className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="flex items-center justify-center p-1 rounded-full text-slate-500 hover:text-white transition-all">
                    <Moon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome tags */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {mode === 'signup' ? 'Create Your Account' : 'Welcome Back! 👋'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {mode === 'signup' ? 'Sign up to get started with FinVerse' : 'Login to continue your journey'}
              </p>
            </div>

            {/* Capsule Tab Toggle bar */}
            <div className="bg-slate-100 p-1 border border-slate-200/50 rounded-2xl flex gap-1 mb-5">
              <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  mode === 'signup' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Core Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name field (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-250 focus:border-purple-500 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all duration-300"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-250 focus:border-purple-500 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all duration-300"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  
                  {/* Real-time Validation Checkmark */}
                  {isEmailValid && (
                    <Check className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5 animate-pulse shrink-0 font-black" />
                  )}
                </div>
              </div>

              {/* Password field (Hidden in Magic Link mode) */}
              {mode !== 'otp' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setMode('otp'); setError(''); setSuccessMsg(''); }}
                        className="text-[9px] font-extrabold text-purple-655 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-250 focus:border-purple-500 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all duration-300"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    
                    {/* Password toggle icon */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {mode === 'signup' && (
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-semibold">Must be at least 8 characters</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold ${strength.text}`}>{strength.label}</span>
                        <div className="flex gap-0.5 w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password field (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-250 focus:border-purple-500 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all duration-300"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Country Selection field (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Country</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-slate-250 focus:border-purple-500 rounded-xl pl-10 pr-8 py-3 text-[13px] font-bold text-slate-800 outline-none transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select your country</option>
                      {WORLD_COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-450 font-bold text-[9px]">
                      ▼
                    </div>
                  </div>
                </div>
              )}

              {/* Remember me (login only) */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember_light"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <label htmlFor="remember_light" className="text-[10px] font-extrabold text-slate-500 cursor-pointer hover:text-slate-700">
                      Remember Me
                    </label>
                  </div>
                </div>
              )}

              {/* Terms and Conditions checkbox (signup only) */}
              {mode === 'signup' && (
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="agree_terms_light"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="agree_terms_light" className="text-[10px] font-extrabold text-slate-500 cursor-pointer hover:text-slate-700">
                    I agree to the <span className="text-purple-600 hover:underline">Terms of Service</span> and <span className="text-purple-600 hover:underline">Privacy Policy</span>
                  </label>
                </div>
              )}

              {/* Success and Error notifications */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold shadow-sm"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-sm animate-pulse"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/15 hover:scale-[1.01] hover:shadow-purple-500/25 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Login'}
                      {mode === 'signup' && 'Create Account'}
                    </span>
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </>
                )}
              </button>
            </form>

            {/* Social Logins Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                or continue with
              </span>
            </div>

            {/* Social Sign-In grid */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm text-slate-700 hover:text-slate-900"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>
              <button
                onClick={() => handleOAuthLogin('facebook')}
                className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm text-slate-700 hover:text-slate-900"
              >
                <svg className="w-4 h-4 shrink-0 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={() => handleOAuthLogin('apple')}
                className="py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm text-slate-700 hover:text-slate-900"
              >
                <svg className="w-4 h-4 shrink-0 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.71-1.16 1.86-1.01 2.97 1.1.09 2.23-.6 2.94-1.42z"/>
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>

            {/* Security details footer */}
            <div className="mt-7 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-650" />
              <span>Secure Login: Protected with end-to-end encryption</span>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==================== DARK MODE RENDER (SPLIT PANE) ====================
  return (
    <div className="min-h-screen bg-[#070b19] text-white flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      
      {/* Background ambient orbs - ultra-high-performance radial gradients (No expensive blur filter paint cost!) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none transform-gpu" />

      {/* Main split-pane frame container - hardware GPU rendering with optimized blur */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center bg-slate-950/30 backdrop-blur-lg border border-white/5 rounded-[36px] p-6 sm:p-8 lg:p-9 shadow-2xl relative transform-gpu will-change-transform">
        
        {/* 1. LEFT PANE - BRANDING & ANIMS */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-10">
          
          {/* Logo brand header */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              {/* Rotating background gradient glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 opacity-20 blur-[6px] animate-pulse" />
              
              {/* High-fidelity SVG logo with custom inline animations */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-11 h-11 relative z-10 drop-shadow-[0_4px_10px_rgba(147,51,234,0.35)]"
              >
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                
                {/* Central Dollar Sign - pulsing gently */}
                <text
                  x="50%"
                  y="55%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="font-black fill-[url(#logo-grad)] text-[38px] select-none"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                >
                  $
                </text>
                
                {/* Rotating arrows group - slowly spinning clockwise */}
                <g 
                  style={{ 
                    animation: 'spin 12s linear infinite', 
                    transformOrigin: 'center' 
                  }}
                >
                  {/* Top-Right Arc */}
                  <path
                    d="M 22 40 A 32 32 0 0 1 78 30"
                    fill="none"
                    stroke="url(#logo-grad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Top-Right Arrowhead */}
                  <path
                    d="M 72 24 L 80 30 L 75 38"
                    fill="none"
                    stroke="url(#logo-grad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Bottom-Left Arc */}
                  <path
                    d="M 78 60 A 32 32 0 0 1 22 70"
                    fill="none"
                    stroke="url(#logo-grad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Bottom-Left Arrowhead */}
                  <path
                    d="M 28 76 L 20 70 L 25 62"
                    fill="none"
                    stroke="url(#logo-grad)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent block leading-none">
                FinVerse
              </span>
              <span className="font-semibold text-xs block text-purple-400 mt-1 uppercase tracking-widest font-bold">
                Currency Converter
              </span>
            </div>
          </div>

          {/* Core Message & Orbit Sphere representation */}
          <div className="space-y-6 relative">
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Convert. Compare. <span className="bg-gradient-to-r from-purple-450 via-blue-405 to-indigo-400 bg-clip-text text-transparent animate-pulse">Conquer.</span>
              </h2>
              <p className="text-slate-400 text-sm font-semibold">Your Global Finance Companion</p>
            </div>

            {/* Orbit & Planet Visual Arena - scaled to h-64 with GPU acceleration */}
            <div className="relative w-full h-64 flex items-center justify-center overflow-hidden py-10 rounded-3xl bg-slate-900/10 border border-white/5 transform-gpu will-change-transform">
              
              {/* Pedestal base glow rings */}
              <div className="absolute bottom-2 w-64 h-10 bg-gradient-to-t from-purple-600/30 to-blue-500/10 blur-sm rounded-full pointer-events-none" />
              <div className="absolute bottom-4 w-52 h-5 border border-purple-500/20 rounded-full pointer-events-none" />

              {/* Central Glowing Planet Sphere */}
              <div className="absolute w-24 h-24 bg-gradient-to-tr from-purple-600 via-indigo-650 to-blue-500 rounded-full shadow-2xl shadow-purple-500/30 flex items-center justify-center z-10 transform-gpu will-change-transform">
                <Globe className="w-12 h-12 text-white/20 animate-spin transform-gpu will-change-transform" style={{ animationDuration: '20s' }} />
              </div>

              {/* Orbiting Ring lines */}
              <div className="absolute w-44 h-44 border border-white/10 rounded-full animate-spin pointer-events-none transform-gpu will-change-transform" style={{ animationDuration: '6s' }} />
              <div className="absolute w-52 h-24 border border-purple-500/20 rounded-full animate-pulse pointer-events-none rotate-45" />

              {/* Floating Token Badges */}
              <div className="absolute top-6 left-16 w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-450 text-xs shadow-md shadow-emerald-500/5 animate-bounce" style={{ animationDelay: '0.2s' }}>$</div>
              <div className="absolute top-8 right-20 w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs shadow-md shadow-indigo-500/5 animate-pulse" style={{ animationDelay: '0.8s' }}>€</div>
              <div className="absolute bottom-8 right-24 w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-xs shadow-md shadow-purple-500/5 animate-bounce" style={{ animationDelay: '1.2s' }}>£</div>
              <div className="absolute bottom-12 left-20 w-8 h-8 rounded-full bg-teal-500/15 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-xs shadow-md shadow-teal-500/5 animate-pulse">¥</div>
              <div className="absolute top-20 right-8 w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-xs shadow-md shadow-amber-500/5 animate-bounce" style={{ animationDelay: '0.5s' }}>₿</div>

              {/* 3D Stack of Gold Coins on the left side */}
              <div className="absolute bottom-4 left-10 flex flex-col -space-y-2 z-20">
                <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-md transform -skew-x-12" />
                <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-md transform -skew-x-12" />
                <div className="w-9 h-3.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full border border-amber-600/30 shadow-md transform -skew-x-12 animate-pulse" />
              </div>

              {/* Floating Glassmorphic Rate Card with neon trend graph */}
              <motion.div 
                drag
                dragConstraints={{ top: -40, bottom: 40, left: -40, right: 40 }}
                className="absolute bottom-4 right-6 z-30 bg-[#0e1330]/90 backdrop-blur-md border border-purple-500/20 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2 w-52 cursor-grab hover:scale-105 transition-transform duration-300 transform-gpu will-change-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-600 border border-slate-900 flex items-center justify-center text-[8px] font-black">🇺🇸</div>
                    <div className="w-6 h-6 rounded-full bg-orange-500 border border-slate-900 flex items-center justify-center text-[8px] font-black">🇮🇳</div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase text-slate-400">USD / INR</span>
                </div>

                {/* SVG trend graph line */}
                <div className="h-10 w-full relative overflow-hidden">
                  <svg className="w-full h-full text-cyan-400 animate-pulse" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-glow-dark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 25 Q 15 5, 30 20 T 60 12 T 80 22 T 100 5 L 100 30 L 0 30 Z" 
                      fill="url(#chart-glow-dark)" 
                    />
                    <path 
                      d="M 0 25 Q 15 5, 30 20 T 60 12 T 80 22 T 100 5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[8px] border-t border-white/5 pt-1.5 mt-0.5">
                  <span className="font-extrabold text-slate-350">1 USD = 83.45 INR</span>
                  <span className="text-emerald-450 flex items-center gap-0.5 font-black">
                    <TrendingUp className="w-2.5 h-2.5" /> +0.5%
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Features Grid highlights (6 cards) - gap-3 */}
          <div className="grid grid-cols-3 gap-3">
            
            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">Rates</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Live exchange</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <Bot className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">AI Advisor</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Smart advice</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">Secure</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Data safe</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">Crypto</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">100+ coins</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <Bell className="w-4 h-4 text-orange-500 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">Alerts</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Instant alerts</p>
              </div>
            </div>

            <div className="flex flex-col gap-1 p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.03] transition-all">
              <Globe className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <h4 className="text-[10px] font-bold text-slate-200">Global</h4>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-none">Worldwide</p>
              </div>
            </div>

          </div>



        </div>

        {/* 2. RIGHT PANE - AUTH FORM */}
        <div className="lg:col-span-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 sm:p-8 lg:p-9 shadow-xl relative">
          
          {/* Form Top Utility Bar */}
          <div className="flex items-center justify-between mb-6">
            {/* Back to Home Button */}
            {onBackToHome ? (
              <button
                type="button"
                onClick={onBackToHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900/90 border border-white/5 text-[10px] font-extrabold transition-all cursor-pointer text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            ) : (
              <div />
            )}

            {/* Theme Switcher */}
            <div className="flex items-center gap-2">
              <div 
                onClick={() => setDarkMode(false)}
                className="p-1 rounded-full flex items-center gap-1.5 cursor-pointer bg-slate-950/80 border border-white/5 shadow-sm transition-all"
                title="Switch to Light Mode"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full text-slate-500 hover:text-white transition-all">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-center p-1.5 rounded-full bg-slate-800 text-purple-400 transition-all">
                  <Moon className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome tags */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-300 bg-clip-text text-transparent leading-tight">
              {mode === 'signup' ? 'Create Your Account' : 'Welcome Back! 👋'}
            </h3>
            <p className="text-xs text-slate-450 font-semibold mt-1">
              {mode === 'signup' ? 'Sign up to get started with FinVerse' : 'Login to continue your journey'}
            </p>
          </div>

          {/* Capsule Tab Toggle bar */}
          <div className="bg-slate-950/80 p-1 border border-white/5 rounded-2xl flex gap-1 mb-5">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-gradient-to-r from-purple-650 to-blue-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-gradient-to-r from-purple-655 to-blue-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Core Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name field (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 focus:border-purple-555 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-white outline-none transition-all duration-300"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 focus:border-purple-555 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-white outline-none transition-all duration-300"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                
                {/* Real-time Validation Checkmark */}
                {isEmailValid && (
                  <Check className="w-4 h-4 text-emerald-450 absolute right-3.5 top-3.5 animate-pulse shrink-0 font-black" />
                )}
              </div>
            </div>

            {/* Password field (Hidden in Magic Link mode) */}
            {mode !== 'otp' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('otp'); setError(''); setSuccessMsg(''); }}
                      className="text-[9px] font-extrabold text-purple-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 focus:border-purple-555 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-white outline-none transition-all duration-300"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  
                  {/* Password toggle icon */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-all cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {mode === 'signup' && (
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-semibold">Must be at least 8 characters</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold ${strength.text}`}>{strength.label}</span>
                      <div className="flex gap-0.5 w-12 h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password field (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 focus:border-purple-555 rounded-xl pl-10 pr-10 py-3 text-[13px] font-bold text-white outline-none transition-all duration-300"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white transition-all cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Country Selection field (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Country</label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 focus:border-purple-555 rounded-xl pl-10 pr-8 py-3 text-[13px] font-bold text-white outline-none transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your country</option>
                    {WORLD_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-450 font-bold text-[9px]">
                    ▼
                  </div>
                </div>
              </div>
            )}

            {/* Remember me (login only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-slate-950 text-purple-650 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-[10px] font-extrabold text-slate-400 cursor-pointer hover:text-slate-205">
                    Remember Me
                  </label>
                </div>
              </div>
            )}

            {/* Terms and Conditions checkbox (signup only) */}
            {mode === 'signup' && (
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="agree_terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="rounded border-white/10 bg-slate-950 text-purple-650 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="agree_terms" className="text-[10px] font-extrabold text-slate-400 cursor-pointer hover:text-slate-205">
                  I agree to the <span className="text-purple-400 hover:underline">Terms of Service</span> and <span className="text-purple-400 hover:underline">Privacy Policy</span>
                </label>
              </div>
            )}

            {/* Success and Error notifications */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-xs font-bold"
                >
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-pulse"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-450" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/15 hover:scale-[1.01] hover:shadow-purple-500/25 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3.5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Login'}
                    {mode === 'signup' && 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative bg-[#0a0f21] px-3 text-[10px] uppercase tracking-wider text-slate-550 font-extrabold">
              or continue with
            </span>
          </div>

          {/* Social Sign-In grid */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleOAuthLogin('google')}
              className="py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-300 hover:text-white"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span className="hidden sm:inline">Google</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('facebook')}
              className="py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-300 hover:text-white"
            >
              <svg className="w-4 h-4 shrink-0 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </button>
            <button
              onClick={() => handleOAuthLogin('apple')}
              className="py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 text-slate-300 hover:text-white"
            >
              <svg className="w-4 h-4 shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.51-.62.71-1.16 1.86-1.01 2.97 1.1.09 2.23-.6 2.94-1.42z"/>
              </svg>
              <span className="hidden sm:inline">Apple</span>
            </button>
          </div>

          {/* Security details footer */}
          <div className="mt-7 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Secure Login: Your data is protected with end-to-end encryption</span>
          </div>

        </div>

      </div>

      {renderOAuthModal()}
    </div>
  );
}


