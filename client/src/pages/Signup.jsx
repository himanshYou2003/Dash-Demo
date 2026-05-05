import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strengthScore, setStrengthScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    setStrengthScore(score);
  }, [password]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (strengthScore < 5) {
      setError('Please use a stronger password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await API.post('/api/register', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strengthScore <= 2) return 'Weak';
    if (strengthScore <= 4) return 'Good';
    return 'Secure';
  };

  const getStrengthColor = () => {
    if (strengthScore <= 2) return 'bg-[#FF6B6B]';
    if (strengthScore <= 4) return 'bg-[#F6D88F]';
    return 'bg-[#6BCB77]';
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F7F5F2] overflow-x-hidden p-4 sm:p-6">
      <div className="absolute top-10 right-10 opacity-10 sm:opacity-20">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="2" strokeDasharray="10 5"/>
        </svg>
      </div>

      <div className="w-full max-w-[420px] bg-white p-8 sm:p-10 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#E5E5E5] relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-[26px] font-bold text-[#1F1F1F] mb-2 tracking-tight">Request Access</h1>
          <p className="text-[14px] text-[#6B6B6B] leading-relaxed">
            Create your account to join the workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl">
            <p className="text-[#FF6B6B] text-[13px] text-center font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-[12px] font-semibold text-[#1F1F1F] mb-2 ml-1 uppercase tracking-wider cursor-pointer">Email Address</label>
            <input
              autoFocus
              type="email"
              className="w-full h-[52px] px-4 bg-white border border-[#E5E5E5] rounded-[14px] text-[#1F1F1F] placeholder:text-[#B0B0B0] focus:ring-0 transition-all text-sm"
              placeholder="e.g. agent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[12px] font-semibold text-[#1F1F1F] uppercase tracking-wider cursor-pointer">Password</label>
              <span className={`text-[11px] font-bold uppercase tracking-tighter transition-colors duration-300 ${strengthScore <= 2 ? 'text-[#FF6B6B]' : strengthScore <= 4 ? 'text-[#F4B266]' : 'text-[#6BCB77]'}`}>
                {getStrengthLabel()}
              </span>
            </div>
            <input
              type="password"
              className="w-full h-[52px] px-4 bg-white border border-[#E5E5E5] rounded-[14px] text-[#1F1F1F] placeholder:text-[#B0B0B0] focus:ring-0 transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-3 flex gap-1 h-[3px] w-full bg-[#ECECEC] rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-500 ease-out ${getStrengthColor()}`}
                 style={{ width: `${(strengthScore / 5) * 100}%` }}
               ></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[54px] bg-[#F4B266] hover:bg-[#E9A354] text-white font-bold rounded-[14px] shadow-sm transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#ECECEC] text-center">
          <p className="text-[14px] text-[#6B6B6B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F4B266] font-bold hover:text-[#E9A354] transition-colors cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
