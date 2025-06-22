'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import { HiMenu, HiX } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '@/app/slices/userSlice';
import { useRouter } from 'next/navigation';
import ReminderGift from '../../modal/reminder/page';
import { Heart } from 'lucide-react';
import { clearCart } from '@/app/slices/cartSlice';
import { clearWishlist } from '@/app/slices/wishlistSlice';

function Navbar() {
  const { user } = useSelector((state) => state.userState);
  const cartCount = useSelector((state) => state.cartState.items.length);
  const wishlistCount = useSelector((state) => state.wishlistState.items.length);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [giftDropdownOpen, setGiftDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  const logoutHandler = () => {
    dispatch(userLogout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    setUserDropdownOpen(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-[80px] flex flex-col justify-center">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image src={logo} alt="Logo" width={130} className="h-auto" />
            </div>

            {/* Desktop Search + Menu */}
            <div className="hidden md:flex items-center gap-8 flex-1 justify-end">
              {/* Search */}
              <div className="flex items-center border border-gray-200 rounded-md px-4 h-[50px] w-[320px] bg-gray-50">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none text-base text-gray-600 placeholder-gray-400"
                />
                <CiSearch size={22} className="text-gray-400" />
              </div>

              {/* Links */}
              <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
                <li className="cursor-pointer hover:text-[#822BE2] transition-colors">Services</li>

                {/* Gift Combo */}
                <li className="relative cursor-pointer" onClick={() => setGiftDropdownOpen(!giftDropdownOpen)}>
                  <div className="flex items-center hover:text-[#822BE2] transition-colors">
                    Gift Combo
                    <svg className={`ml-1 w-4 h-4 transition-transform ${giftDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {giftDropdownOpen && (
                    <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-56 text-sm z-50">
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleNavigation('/surprisegift')}>Surprise Gift Delivery</li>
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">Customizable Gift</li>
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={openModal}>Reminder Gift</li>
                    </ul>
                  )}
                </li>

                <li className="cursor-pointer hover:text-[#822BE2] transition-colors">About Us</li>
                <li className="cursor-pointer hover:text-[#822BE2] transition-colors" onClick={() => handleNavigation('/user/checkout')}>
                  <div className="relative">
                    <MdOutlineShoppingCart size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
                    )}
                  </div>
                </li>
                <li className="cursor-pointer hover:text-[#822BE2] transition-colors" onClick={() => handleNavigation('/user/wishlist')}>
                  <div className="relative">
                    <Heart size={22} className="text-[#822BE2]" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-1.5 py-0.5">{wishlistCount}</span>
                    )}
                  </div>
                </li>

                {/* User */}
                <li className="relative cursor-pointer">
                  {user ? (
                    <div onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center text-[#822BE2] font-medium">
                      {user.firstName}
                      <svg className={`ml-1 w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ) : (
                    <span onClick={() => handleNavigation('/login')} className="hover:text-[#822BE2] transition-colors">Login</span>
                  )}

                  {userDropdownOpen && (
                    <ul className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 text-sm z-50">
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleNavigation('/user/profile')}>Profile</li>
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">Wishlists</li>
                      <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleNavigation('/user/history')}>History</li>
                      <li className="px-4 py-3 hover:bg-red-50 cursor-pointer text-red-500 transition-colors" onClick={logoutHandler}>Logout</li>
                    </ul>
                  )}
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                {isMenuOpen ? <HiX size={26} className="text-gray-600" /> : <HiMenu size={26} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-4 text-sm bg-white border-t border-gray-200">
            <div className="border border-gray-200 rounded-md flex items-center px-4 h-[50px] bg-gray-50">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-base text-gray-600 placeholder-gray-400"
              />
              <CiSearch size={22} className="text-gray-400" />
            </div>

            <div className="space-y-3">
              <div className="cursor-pointer hover:text-[#822BE2] transition-colors py-2">Services</div>

              {/* Gift Combo */}
              <div className="cursor-pointer hover:text-[#822BE2] transition-colors py-2" onClick={() => setGiftDropdownOpen(!giftDropdownOpen)}>
                Gift Combo
                {giftDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-3">
                    <div className="hover:text-[#822BE2] transition-colors py-1.5" onClick={() => handleNavigation('/surprisegift')}>Surprise Gift Delivery</div>
                    <div className="hover:text-[#822BE2] transition-colors py-1.5">Customizable Gift</div>
                    <div className="hover:text-[#822BE2] transition-colors py-1.5" onClick={openModal}>Reminder Gift</div>
                  </div>
                )}
              </div>

              <div className="cursor-pointer hover:text-[#822BE2] transition-colors py-2">About Us</div>
              <div className="cursor-pointer hover:text-[#822BE2] transition-colors py-2" onClick={() => handleNavigation('/user/checkout')}>Cart</div>

              {user ? (
                <>
                  <div className="hover:text-[#822BE2] transition-colors py-2" onClick={() => handleNavigation('/user/profile')}>Profile</div>
                  <div className="hover:text-[#822BE2] transition-colors py-2">Wishlists</div>
                  <div className="hover:text-[#822BE2] transition-colors py-2" onClick={() => handleNavigation('/user/history')}>History</div>
                  <div className="text-red-500 hover:text-red-600 transition-colors py-2" onClick={logoutHandler}>Logout</div>
                </>
              ) : (
                <div className="hover:text-[#822BE2] transition-colors py-2" onClick={() => handleNavigation('/login')}>Login</div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Reminder Gift Modal */}
      {showModal && <ReminderGift onClose={closeModal} />}
    </>
  );
}

export default Navbar;
