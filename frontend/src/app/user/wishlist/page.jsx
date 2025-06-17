"use client";
import React from 'react';
import Navbar from '../../components/navBar/page';
import Footer from '../../components/footer/page';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../../slices/wishlistSlice';
import { addToCart } from '../../slices/cartSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function WishlistPage() {
  const { wishlistItems } = useSelector((state) => state.wishlistState);
  const dispatch = useDispatch();

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (product) => {
    dispatch(removeFromWishlist(product._id));
    toast.success(`${product.title} removed from wishlist!`);
  };

  // Handle move to cart
  const handleMoveToCart = (product) => {
    const cartItem = {
      id: product._id,
      _id: product._id,
      title: product.title,
      price: product.price,
      image: "/mug.jpg", // Using default image for now
      quantity: 1
    };
    
    dispatch(addToCart(cartItem));
    dispatch(removeFromWishlist(product._id));
    toast.success(`${product.title} moved to cart!`);
  };

  // Show empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <>
        <div className='px-4 sm:px-6 md:px-8 lg:px-20 xl:px-20 flex-col items-center'>
          <Navbar />
          <div className='font-extra-large font-semibold mt-[15px] text-center sm:text-left'>My Wishlist</div>
          
          <div className='flex flex-col items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='text-6xl mb-4'>💖</div>
              <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Your wishlist is empty</h2>
              <p className='text-gray-600 mb-6'>Start adding products to your wishlist to save them for later</p>
              <button 
                onClick={() => window.location.href = '/'}
                className='bg-[#822BE2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors'
              >
                Start Shopping
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
          My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8'>
          {wishlistItems.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0 border-1 border-[#D9D9D9] rounded-[10px]">
                <div className="relative">
                  <Image
                    src="/mug.jpg"
                    alt={product.title}
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2 bg-red-100 rounded-full p-1">
                    <Heart className="text-red-500 w-3 h-3 sm:w-4 sm:h-4 fill-red-500" />
                  </div>
                </div>
                <div className="p-3">
                  <Link href={`/productDetail/${product._id}`}>
                    <h3 className="font-medium text-sm sm:text-base truncate hover:text-purple-600 transition-colors mb-2">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="font-semibold text-purple-600 text-sm sm:text-base mb-2">US ${product.price}</p>
                  
                  {/* Rating */}
                  <div className="flex text-yellow-400 text-xs sm:text-sm mb-3">
                    {Array.from({ length: 5 }, (_, i) => {
                      const fullStars = Math.floor(product.rating || 0);
                      const hasHalfStar = (product.rating || 0) - fullStars >= 0.5;

                      if (i < fullStars) {
                        return <AiFillStar key={i} />;
                      } else if (i === fullStars && hasHalfStar) {
                        return <AiTwotoneStar key={i} />;
                      } else {
                        return <AiOutlineStar key={i} />;
                      }
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-1"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Move to Cart
                    </Button>
                    <Button 
                      onClick={() => handleRemoveFromWishlist(product)}
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Clear All Button */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={() => {
                wishlistItems.forEach(product => dispatch(removeFromWishlist(product._id)));
                toast.success('Wishlist cleared!');
              }}
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Items
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default WishlistPage; 