import React, { useState } from 'react';
import { Video, FileText, Zap, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import UserMenu from './auth/UserMenu';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  YT Snap-to-PDF
                </h1>
                <p className="text-gray-600 text-sm">Convert video frames to beautiful PDFs</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Feature Icons - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-indigo-500" />
                  <span>Extract Frames</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Smart Selection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span>Generate PDF</span>
                </div>
              </div>

              {/* Authentication Section */}
              <div className="flex items-center">
                {loading ? (
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                ) : user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:block">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Header;