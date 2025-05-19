import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlineSearch } from 'react-icons/ai';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { MdOutlineTrackChanges } from 'react-icons/md';
import { RiDashboardLine, RiLogoutBoxLine, RiLoginBoxLine, RiUserAddLine } from 'react-icons/ri';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, translations } = useLanguage();
  const t = (key) => translations[language][key];
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching:', searchTerm);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white shadow-lg z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <img 
                src="/uploads/pic.jpg" 
                alt="" 
                className="h-10 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="hover:text-blue-200 flex items-center space-x-1">
                <AiOutlineHome className="text-xl" />
                <span>{t('home')}</span>
              </Link>
              <Link to="/about" className="hover:text-blue-200 flex items-center space-x-1">
                <AiOutlineInfoCircle className="text-xl" />
                <span>About Us</span>
              </Link>
              
              {/* Only show these links if user is not admin or super_admin */}
              {(!user || (user.role !== 'admin' && user.role !== 'super_admin')) && (
                <>
                  <Link to="/submit-complaint" className="hover:text-blue-200 flex items-center space-x-1">
                    <BiMessageSquareDetail className="text-xl" />
                    <span>Submit Complaint</span>
                  </Link>
                  <Link to="/track-complaint" className="hover:text-blue-200 flex items-center space-x-1">
                    <MdOutlineTrackChanges className="text-xl" />
                    <span>Track Complaint</span>
                  </Link>
                </>
              )}
              
              {/* Show dashboard link for admin and super_admin */}
              {user && (user.role === 'admin' || user.role === 'super_admin') && (
                <Link 
                  to={user.role === 'super_admin' ? '/super-admin' : '/admin'} 
                  className="hover:text-blue-200 flex items-center space-x-1"
                >
                  <RiDashboardLine className="text-xl" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
          

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search')}
                className="px-3 py-1 rounded text-gray-800 w-40 focus:outline-none focus:w-48 transition-all"
              />
              <AiOutlineSearch className="absolute right-2 top-2 text-gray-500" />
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 border-l pl-4">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded text-sm ${language === 'en' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('rw')}
                className={`px-2 py-1 rounded text-sm ${language === 'rw' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
              >
                RW
              </button>
            </div>

            {/* User Menu */}
            {user ? (
              <>
                <span>Welcome, {user.username}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded flex items-center space-x-1"
                >
                  <RiLogoutBoxLine className="text-xl" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 flex items-center space-x-1"
                >
                  <RiLoginBoxLine className="text-xl" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded flex items-center space-x-1"
                >
                  <RiUserAddLine className="text-xl" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;