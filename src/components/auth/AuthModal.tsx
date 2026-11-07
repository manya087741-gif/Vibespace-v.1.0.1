import React, { useState } from 'react';
import { 
  X, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon, Calendar, 
  Sparkles, Check, ArrowRight, ShieldCheck, KeyRound, Smartphone, 
  RotateCcw, AlertCircle, Plus, CheckCircle2 
} from 'lucide-react';
import { User, AuthAccount } from '../../types';
import { socialStore } from '../../utils/socialStore';
import { sound } from '../../utils/audioSynth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  initialMode?: 'login' | 'signup' | 'otp' | 'forgot' | 'switch_accounts';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot' | 'switch_accounts'>(initialMode);
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sign Up State
  const [signupFullName, setSignupFullName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupBirthday, setSignupBirthday] = useState('2000-01-15');
  const [signupGender, setSignupGender] = useState('female');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupAccountType, setSignupAccountType] = useState<'personal' | 'creator' | 'business'>('creator');
  const [signupError, setSignupError] = useState<string | null>(null);

  // OTP Login State
  const [otpContact, setOtpContact] = useState('+91 98765 43210');
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpSent, setOtpSent] = useState(true);
  const [otpError, setOtpError] = useState<string | null>(null);

  // Forgot Password State
  const [forgotContact, setForgotContact] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Switch Accounts
  const authAccounts = socialStore.getAuthAccounts();

  // Username live availability checker
  const isUsernameAvailable = signupUsername.length >= 3 
    ? socialStore.checkUsernameAvailability(signupUsername) 
    : true;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your email, username, or phone number');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your account password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = socialStore.loginUser(loginIdentifier, loginPassword, rememberMe);
      setIsLoading(false);
      if (res.success && res.user) {
        sound.playSparkle();
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setLoginError(res.message);
      }
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!signupFullName.trim() || !signupUsername.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('Please fill out all required fields.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match. Please re-enter.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = socialStore.registerUser({
        fullName: signupFullName,
        username: signupUsername,
        email: signupEmail,
        phone: signupPhone || '+91 98765 00000',
        birthday: signupBirthday,
        gender: signupGender,
        accountType: signupAccountType,
      });
      setIsLoading(false);
      if (res.success && res.user) {
        sound.playSparkle();
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setSignupError(res.message);
      }
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = socialStore.loginWithOtp(otpContact, entered);
      setIsLoading(false);
      if (res.success && res.user) {
        sound.playSparkle();
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setOtpError(res.message);
      }
    }, 600);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = clean;
    setOtpCode(updated);
    // Auto-focus next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotStep === 'request') {
      if (!forgotContact) return;
      sound.playHeartPop();
      setForgotStep('reset');
    } else {
      if (!forgotNewPassword || forgotNewPassword.length < 6) return;
      sound.playSparkle();
      socialStore.changePassword('demo', forgotNewPassword);
      setForgotSuccess(true);
      setTimeout(() => {
        setMode('login');
        setForgotStep('request');
        setForgotSuccess(false);
      }, 1500);
    }
  };

  const handleSwitchAccount = (accountId: string) => {
    sound.playSparkle();
    const switchedUser = socialStore.switchAuthAccount(accountId);
    if (onSuccess) onSuccess(switchedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/app-icon.png"
              alt="VibeSpace"
              className="w-7 h-7 rounded-xl object-cover ring-1 ring-violet-500/40"
            />
            <div>
              <h3 className="text-sm font-bold text-white">
                {mode === 'login' && 'Log In to VibeSpace'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'otp' && 'Fast OTP Verification'}
                {mode === 'forgot' && 'Reset Secure Password'}
                {mode === 'switch_accounts' && 'Switch Account'}
              </h3>
              <p className="text-[10px] text-slate-400">Zero-Data-Leak Authentication</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playHeartPop();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (if not in forgot or switch mode) */}
        {(mode === 'login' || mode === 'signup' || mode === 'otp') && (
          <div className="p-2 border-b border-slate-800/80 bg-slate-950/60 flex gap-1">
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('login');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('otp');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'otp'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OTP Login ⚡
            </button>
            <button
              onClick={() => {
                sound.playHeartPop();
                setMode('signup');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 1. LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Identifier */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">
                  Email, Username, or Mobile
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="manya087741@gmail.com or @alex_thorne"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs pl-10"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setMode('forgot');
                    }}
                    className="text-[10px] text-violet-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-700 bg-slate-950 text-violet-600 focus:ring-0"
                  />
                  <span className="text-[11px] text-slate-300">Remember credentials on this device</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/50 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick One-Tap Account Switcher Section */}
              {authAccounts.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Logged-in Accounts on Device
                    </span>
                    <button
                      type="button"
                      onClick={() => setMode('switch_accounts')}
                      className="text-[10px] text-violet-400 hover:underline"
                    >
                      Manage All
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {authAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        onClick={() => handleSwitchAccount(acc.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          acc.isCurrent
                            ? 'bg-violet-950/40 border-violet-500/40'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={acc.avatar}
                            alt={acc.fullName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-white font-semibold block leading-tight">{acc.fullName}</span>
                            <span className="text-slate-400 text-[10px] font-mono">@{acc.username}</span>
                          </div>
                        </div>

                        {acc.isCurrent ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="text-violet-400 text-xs font-semibold">Switch →</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* 2. OTP LOGIN MODE */}
          {mode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950 border border-violet-500/30 text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 mx-auto flex items-center justify-center mb-1">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">6-Digit Instant OTP Login</h4>
                <p className="text-[11px] text-slate-300">
                  Verification code sent to <strong className="text-white font-mono">{otpContact}</strong>
                </p>
                <span className="text-[10px] text-emerald-400 font-mono block">
                  Demo Code: 123456
                </span>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* 6-box OTP Input */}
              <div className="flex justify-center gap-2 py-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    className="w-10 h-12 text-center text-lg font-mono font-bold bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Didn't receive code?</span>
                {otpTimer > 0 ? (
                  <span className="font-mono text-slate-400">Resend in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playHeartPop();
                      setOtpTimer(45);
                    }}
                    className="text-violet-400 font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* Verify & Enter Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {isLoading ? (
                  <span>Verifying Hardware Token...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Continue</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. SIGN UP MODE */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {signupError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="e.g., Alex Thorne"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Username + Live Availability */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-slate-300">Username *</label>
                  {signupUsername.length >= 3 && (
                    <span className={`text-[10px] font-mono flex items-center gap-1 ${
                      isUsernameAvailable ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isUsernameAvailable ? <Check className="w-3 h-3" /> : '✗'}
                      {isUsernameAvailable ? 'Available' : 'Taken'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    placeholder="creator_handle"
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Mobile Number</label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Birthday & Gender */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Date of Birth</label>
                  <input
                    type="date"
                    value={signupBirthday}
                    onChange={(e) => setSignupBirthday(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Gender</label>
                  <select
                    value={signupGender}
                    onChange={(e) => setSignupGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non_binary">Non-Binary</option>
                    <option value="prefer_not">Prefer Not to Say</option>
                  </select>
                </div>
              </div>

              {/* Account Type Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Account Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['personal', 'creator', 'business'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSignupAccountType(type)}
                      className={`p-2 rounded-xl border text-center transition-all capitalize ${
                        signupAccountType === type
                          ? 'bg-violet-600/30 border-violet-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Password *</label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {isLoading ? (
                  <span>Creating Encrypted Account...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 4. FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 mx-auto flex items-center justify-center mb-1">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Reset Account Password</h4>
                <p className="text-[11px] text-slate-400">
                  Enter your registered contact to receive an OTP reset code.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-emerald-300 font-bold text-xs">Password reset successfully!</p>
                  <span className="text-[10px] text-slate-400 block">Redirecting to login...</span>
                </div>
              ) : forgotStep === 'request' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Email Address or Mobile Number
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotContact}
                      onChange={(e) => setForgotContact(e.target.value)}
                      placeholder="manya087741@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors"
                  >
                    Send Verification Code →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">6-Digit Code</label>
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Save & Rotate Cryptographic Keys
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-slate-400 hover:text-white text-xs text-center block"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* 5. SWITCH ACCOUNTS MODE (Instagram Bottom Sheet Style) */}
          {mode === 'switch_accounts' && (
            <div className="space-y-3">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Accounts active on this device
              </span>

              <div className="space-y-2">
                {authAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => handleSwitchAccount(acc.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      acc.isCurrent
                        ? 'bg-violet-950/40 border-violet-500/50 shadow-md'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
                      />
                      <div>
                        <span className="text-white font-bold block">{acc.fullName}</span>
                        <span className="text-slate-400 text-[11px] font-mono">@{acc.username}</span>
                      </div>
                    </div>

                    {acc.isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-violet-400 font-semibold text-xs">Switch</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Account Button */}
              <button
                onClick={() => {
                  sound.playHeartPop();
                  setMode('signup');
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Plus className="w-4 h-4 text-violet-400" />
                <span>Log into an Existing or New Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
