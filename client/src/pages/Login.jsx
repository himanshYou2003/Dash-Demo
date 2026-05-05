import { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';
import illustration from '../assets/Transhumans - Experiments.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.email);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#F7F5F2] overflow-x-hidden p-4 sm:p-6">
      <div className="absolute top-5 left-5 opacity-10 sm:opacity-20">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
          <path d="M10 50Q30 10 50 50T90 50" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="20" cy="20" r="5" fill="#F4B266"/>
        </svg>
      </div>
      <div className="absolute bottom-10 right-5 opacity-10 sm:opacity-20">
        <svg width="100" height="100" viewBox="0 0 150 150" fill="none">
          <rect x="20" y="20" width="40" height="40" rx="4" stroke="#2A2A2A" strokeWidth="2"/>
          <circle cx="80" cy="80" r="30" stroke="#F6D88F" strokeWidth="4" strokeDasharray="8 8"/>
        </svg>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 max-w-6xl w-full relative z-10">
        <div className="w-full max-w-[420px] bg-white p-6 xs:p-8 sm:p-10 rounded-[20px] sm:rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-[#E5E5E5]">
          <div className="mb-8 sm:mb-10 text-left">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1F1F1F] mb-2 tracking-tight">Agent Login</h1>
            <p className="text-[13px] sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[280px]">
              Hey, Enter your details to get sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl">
              <p className="text-[#FF6B6B] text-[12px] sm:text-[13px] text-center font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#1F1F1F] mb-1.5 ml-1 uppercase tracking-wider cursor-pointer">Email Address</label>
              <input
                autoFocus
                type="email"
                className="w-full h-[48px] sm:h-[54px] px-4 bg-white border border-[#E5E5E5] rounded-[12px] sm:rounded-[14px] text-[#1F1F1F] placeholder:text-[#B0B0B0] focus:ring-0 transition-all text-sm sm:text-base"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="block text-[12px] font-semibold text-[#1F1F1F] mb-1.5 ml-1 uppercase tracking-wider cursor-pointer">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-[48px] sm:h-[54px] px-4 bg-white border border-[#E5E5E5] rounded-[12px] sm:rounded-[14px] text-[#1F1F1F] placeholder:text-[#B0B0B0] focus:ring-0 transition-all text-sm sm:text-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[40px] sm:top-[46px] text-[11px] font-bold text-[#6B6B6B] hover:text-[#F4B266] transition-colors cursor-pointer"
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <div className="flex justify-start">
              <button type="button" className="text-[12px] sm:text-[13px] text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors underline underline-offset-4 decoration-[#ECECEC] cursor-pointer">
                Having trouble in sign in?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[48px] sm:h-[54px] bg-[#F4B266] hover:bg-[#E9A354] text-white font-bold rounded-[12px] sm:rounded-[14px] shadow-[0_4px_15px_rgba(244,178,102,0.2)] transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base sm:text-lg cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#ECECEC] text-center">
            <p className="text-[13px] sm:text-[14px] text-[#6B6B6B]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#F4B266] font-bold hover:text-[#E9A354] transition-colors cursor-pointer">
                Request Now
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="relative w-full max-w-[480px]">
             <img 
               src={illustration} 
               alt="Illustration" 
               className="w-full h-auto object-contain pointer-events-none drop-shadow-2xl"
             />
             <div className="absolute -top-10 -right-10 w-16 h-16 bg-[#F6D88F] rounded-2xl -z-10 rotate-12"></div>
             <div className="absolute -bottom-10 -left-10 w-14 h-14 border-4 border-[#F4B266] rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
