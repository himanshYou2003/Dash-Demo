import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await API.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (isMounted) {
          setUser(response.data.user);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && (err.response?.status === 401 || err.response?.status === 403)) {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          navigate('/login');
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login', { replace: true });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F7F5F2]">
      <div className="w-6 h-6 border-2 border-[#F4B266]/30 border-t-[#F4B266] rounded-full animate-spin"></div>
    </div>
  );

  const menuItems = [
    { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { name: 'Tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { name: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1F1F1F] flex relative overflow-hidden font-['Inter']">
      
      <div className="absolute top-0 right-0 w-[50%] h-[500px] bg-gradient-to-bl from-[#F4B266]/5 to-transparent pointer-events-none -z-10"></div>

      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-r border-[#E5E5E5]/50 transition-all duration-500 ease-in-out
          ${sidebarOpen ? 'w-72' : 'w-24'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full flex flex-col p-6 items-center lg:items-stretch">
          <div className={`mb-12 flex ${sidebarOpen ? 'flex-row justify-between' : 'flex-col items-center gap-4'} w-full transition-all duration-500`}>
             <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                <div className="w-10 h-10 min-w-[40px] bg-[#1F1F1F] rounded-[14px] flex items-center justify-center text-white font-bold">A</div>
                <span className={`text-[18px] font-bold tracking-tight transition-all duration-300 ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute'}`}>Workspace</span>
             </div>
             
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F7F5F2] border border-[#E5E5E5] text-[#6B6B6B] hover:bg-[#1F1F1F] hover:text-white transition-all duration-300 cursor-pointer"
               title={sidebarOpen ? "Collapse" : "Expand"}
             >
               <svg className={`w-4 h-4 transition-transform duration-500 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
               </svg>
             </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className={`w-full flex items-center gap-4 p-3.5 rounded-[14px] transition-all duration-300 font-semibold text-[14px] cursor-pointer group relative overflow-hidden
                  ${item.name === 'Dashboard' ? 'bg-[#F4B266] text-white shadow-lg shadow-[#F4B266]/20' : 'text-[#6B6B6B] hover:bg-[#F7F5F2] hover:text-[#1F1F1F]'}
                `}
              >
                <div className="min-w-[24px] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute'}`}>
                  {item.name}
                </span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-[#ECECEC]">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-3.5 bg-[#F7F5F2] text-[#6B6B6B] font-bold rounded-[14px] hover:bg-red-500 hover:text-white transition-all duration-300 border border-[#E5E5E5] text-[13px] cursor-pointer group overflow-hidden"
            >
              <div className="min-w-[24px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </div>
              <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute'}`}>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-500 ease-in-out flex flex-col min-h-screen relative ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
        <header className="sticky top-0 z-40 w-full h-20 bg-[#F7F5F2]/60 backdrop-blur-md flex items-center justify-between px-6 sm:px-10 border-b border-[#E5E5E5]/30">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 -ml-2 text-[#6B6B6B] hover:text-[#1F1F1F] cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          
          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 cursor-pointer group">
                <div className="text-right hidden xs:block">
                  <p className="text-[13px] font-bold text-[#1F1F1F] leading-none mb-1">{user?.email.split('@')[0]}</p>
                  <p className="text-[10px] font-bold text-[#F4B266] uppercase tracking-widest">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-[12px] bg-[#F6D88F] flex items-center justify-center font-bold text-[#1F1F1F] shadow-sm transition-transform group-hover:scale-105">
                   {(user?.email?.[0] || 'U').toUpperCase()}
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="max-w-md w-full text-center space-y-10">
             <div className="relative mx-auto w-40 h-40 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-[#E5E5E5]/50 flex items-center justify-center group">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-[#F4B266] transition-transform duration-500 group-hover:rotate-12">
                   <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
             </div>
             <div className="space-y-4">
                <h2 className="text-[32px] font-black text-[#1F1F1F] tracking-tight leading-tight">Workspace Ready.</h2>
                <p className="text-[#6B6B6B] text-[15px] leading-relaxed max-w-[320px] mx-auto">
                   Your advanced environment is successfully initialized and ready for deployment.
                </p>
             </div>
             <button className="px-10 py-4 bg-[#1F1F1F] text-white font-bold rounded-[16px] hover:bg-[#F4B266] transition-all shadow-xl shadow-black/5 cursor-pointer">
                Deploy Module
             </button>
          </div>
        </div>

        <footer className="p-8 text-center sm:flex justify-between items-center text-[11px] text-[#A0A0A0] font-bold uppercase tracking-widest">
           <p>© 2024 AGENT.CORE</p>
           <div className="flex gap-8 mt-4 sm:mt-0 justify-center">
             <a href="#" className="hover:text-[#F4B266] transition-colors">Privacy</a>
             <a href="#" className="hover:text-[#F4B266] transition-colors">Safety</a>
             <a href="#" className="hover:text-[#F4B266] transition-colors">Docs</a>
           </div>
        </footer>

      </main>

      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-[#1F1F1F]/40 z-40 lg:hidden backdrop-blur-sm transition-opacity cursor-pointer"></div>
      )}
    </div>
  );
};

export default Dashboard;
