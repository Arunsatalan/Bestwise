"use client";
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navBar/page'
import Image from 'next/image';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineEdit } from "react-icons/ai";
import { FaCcVisa, FaCcPaypal } from "react-icons/fa";
import { SiMastercard } from "react-icons/si";
import { IoMdStar } from "react-icons/io";
import Footer from '../../components/footer/page'
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart,
  addToCart,
  setCartItems
} from '../../slices/cartSlice';
import { toast } from 'react-hot-toast';

function page() {
    const { user } = useSelector(state => state.userState);
    const { cartItems } = useSelector(state => state.cartState);
    const dispatch = useDispatch();

    // Local state for checkout
    const [shippingAddress, setShippingAddress] = useState(user?.address || '');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 0 ? 10 : 0;
    const total = subtotal + shippingFee;

    // Handle quantity changes
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        dispatch(updateCartItemQuantity({ id: itemId, quantity: newQuantity }));
    };

    // Handle remove item
    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
        toast.success('Item removed from cart!');
    };

    // Handle address editing
    const handleAddressEdit = () => {
        setIsEditingAddress(true);
    };

    // Handle save address changes
    const handleSaveAddress = async () => {
        if (!shippingAddress.trim()) {
            setError('Please enter a valid shipping address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call to update address
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update user address in Redux (in real app, this would be an API call)
            dispatch({
                type: 'UPDATE_USER_ADDRESS',
                payload: shippingAddress
            });

            setIsEditingAddress(false);
            setSuccess('Address updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update address. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        if (!shippingAddress.trim()) {
            setError('Please enter a shipping address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Simulate order creation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create order (in real app, this would be an API call)
            const orderData = {
                items: cartItems,
                shippingAddress,
                subtotal,
                shippingFee,
                total,
                userId: user?.id,
                orderDate: new Date().toISOString()
            };

            console.log('Order created:', orderData);

            // Clear cart after successful order
            dispatch(clearCart());
            
            setSuccess('Order placed successfully! Redirecting...');
            toast.success('Order placed successfully!');
            setTimeout(() => {
                // Redirect to order confirmation or dashboard
                window.location.href = '/user/history';
            }, 2000);
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change
    const handleAddressChange = (e) => {
        setShippingAddress(e.target.value);
        setError(''); // Clear error when user starts typing
    };

    // Handle key press for address input
    const handleAddressKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveAddress();
        }
    };

    // Show empty cart state
    if (cartItems.length === 0) {
        return (
            <>
                <div className='px-4 sm:px-6 md:px-8 lg:px-20 xl:px-20 flex-col items-center'>
                    <Navbar />
                    <div className='font-extra-large font-semibold mt-[15px] text-center sm:text-left'>Your Cart</div>
                    
                    <div className='flex flex-col items-center justify-center min-h-[400px]'>
                        <div className='text-center'>
                            <div className='text-6xl mb-4'>🛒</div>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Your cart is empty</h2>
                            <p className='text-gray-600 mb-6'>Add some products to your cart to continue shopping</p>
                            <button 
                                onClick={() => window.location.href = '/'}
                                className='bg-[#822BE2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors'
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
        <div className='px-4 sm:px-6 md:px-8 lg:px-20 xl:px-20 flex-col items-center'>
            <Navbar />
            <div className='font-extra-large font-semibold mt-[15px] text-center sm:text-left'> 
                Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className='w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                    <p className='text-red-600 text-center'>{error}</p>
                </div>
            )}
            {success && (
                <div className='w-full mt-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <p className='text-green-600 text-center'>{success}</p>
                </div>
            )}

            <div className='flex flex-col lg:flex-row w-full mt-[15px] gap-6'>
                <div className='flex-col w-full lg:w-[65%] items-center'>
                    {/* Cart Items */}
                    {cartItems.map((item, index) => (
                        <div key={item.id || index} className='w-full flex flex-col sm:flex-row justify-center mb-[30px] sm:mb-[50px] gap-4 sm:gap-0'>
                            <div className="relative w-full sm:w-[15%] flex justify-center">
                                <Image
                                    src={item.image || "/mug.jpg"}
                                    alt={item.name || "Product"}
                                    width={130}
                                    height={120}
                                    className="rounded-lg object-cover w-[120px] h-[110px] sm:w-[130px] sm:h-[120px]"
                                />
                            </div>

                            <div className="w-full sm:w-[60%] flex flex-col justify-center px-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{item.title || item.name}</h3>
                                <p className="text-gray-600 mb-2">Price: US ${item.price}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm text-gray-500">Quantity:</span>
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 border-x">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold text-purple-600">
                                    Total: US ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>

                            <div className="w-full sm:w-[25%] flex flex-col justify-center items-center gap-4">
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <RiDeleteBin6Line size={20} />
                                    <span className="text-sm">Remove</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col w-full lg:w-[35%] mt-6 lg:mt-0">
                    <div className='w-full p-4 sm:p-5 border-2 border-[#D9D9D9] rounded-[10px]'>
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center sm:text-left">Order Summary</h2>
                        <div className="flex justify-between px-2 sm:px-5 py-[2px]">
                            <p className="text-[14px] sm:text-[16px] text-[#5C5C5C]">Total Items</p>
                            <p className="text-[14px] sm:text-[16px] font-semibold text-[#333333]">{cartItems.length}</p>
                        </div>
                        <div className="flex justify-between px-2 sm:px-5 py-[2px]">
                            <p className="text-[14px] sm:text-[16px] text-[#5C5C5C]">Shipping Fees</p>
                            <p className="text-[14px] sm:text-[16px] font-semibold text-[#333333]">US ${shippingFee.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between px-2 sm:px-5 py-[2px]">
                            <p className="text-[14px] sm:text-[16px] text-[#5C5C5C]">Subtotal</p>
                            <p className="text-[14px] sm:text-[16px] font-semibold text-[#333333]">US ${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-gray-300 mt-3 pt-3">
                            <div className="flex justify-between px-2 sm:px-5">
                                <p className="text-[16px] sm:text-[18px] font-bold text-[#333333]">Total</p>
                                <p className="text-[16px] sm:text-[18px] font-bold text-[#822BE2]">US ${total.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                                <button
                                    onClick={handleAddressEdit}
                                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors"
                                >
                                    <AiOutlineEdit size={16} />
                                    <span className="text-sm">Edit</span>
                                </button>
                            </div>

                            {isEditingAddress ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={shippingAddress}
                                        onChange={handleAddressChange}
                                        onKeyPress={handleAddressKeyPress}
                                        placeholder="Enter your shipping address"
                                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                        rows="3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveAddress}
                                            disabled={isLoading}
                                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => setIsEditingAddress(false)}
                                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-gray-700">
                                        {shippingAddress || 'No address provided. Please add a shipping address.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Methods</h3>
                            <div className="flex gap-3">
                                <div className="flex-1 p-3 border border-gray-300 rounded-md text-center cursor-pointer hover:border-purple-500 transition-colors">
                                    <FaCcVisa className="text-3xl mx-auto mb-2 text-blue-600" />
                                    <span className="text-sm text-gray-600">Visa</span>
                                </div>
                                <div className="flex-1 p-3 border border-gray-300 rounded-md text-center cursor-pointer hover:border-purple-500 transition-colors">
                                    <FaCcPaypal className="text-3xl mx-auto mb-2 text-blue-500" />
                                    <span className="text-sm text-gray-600">PayPal</span>
                                </div>
                                <div className="flex-1 p-3 border border-gray-300 rounded-md text-center cursor-pointer hover:border-purple-500 transition-colors">
                                    <SiMastercard className="text-3xl mx-auto mb-2 text-red-600" />
                                    <span className="text-sm text-gray-600">Mastercard</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading || !shippingAddress.trim()}
                            className="w-full mt-6 bg-[#822BE2] text-white py-3 px-6 rounded-md font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : `Proceed to Checkout - US $${total.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default page;
