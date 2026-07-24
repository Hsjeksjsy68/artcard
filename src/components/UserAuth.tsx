import React from 'react';
import { User, auth, provider, signInWithPopup, signOut } from '../lib/firebase';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface UserAuthProps {
  user: User | null;
}

export function UserAuth({ user }: UserAuthProps) {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        console.log("Login cancelled by user.");
      } else {
        console.error("Error signing in:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black mb-1">{user.displayName}</span>
            <button 
              onClick={handleLogout}
              className="text-[10px] font-black text-black bg-white hover:bg-neutral-200 px-3 py-1 border-2 border-black uppercase flex items-center gap-2"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
          {user.photoURL ? (
            <img src={user.photoURL} alt="User" className="w-12 h-12 border-2 border-black" />
          ) : (
            <div className="w-12 h-12 bg-[#D4FF00] flex items-center justify-center font-black text-black border-2 border-black">
              <UserIcon />
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={handleLogin}
          className="text-sm font-black text-black bg-[#D4FF00] hover:bg-black hover:text-white px-4 py-2 border-2 border-black uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <LogIn size={16} /> Sign In
        </button>
      )}
    </div>
  );
}
