'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { LuShoppingCart } from "react-icons/lu";
import { FaRegHeart, FaCcVisa, FaCcPaypal, FaStar } from "react-icons/fa";
import { SiMastercard } from "react-icons/si";
import { CiStar } from "react-icons/ci";
import Navbar from '../../components/navBar/page'
import Link from 'next/link';
import { Heart, Flame } from 'lucide-react';
import Image from 'next/image';
import { getProducts } from '../../actions/productAction'
import { addToCart } from '../../slices/cartSlice';
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from 'react-icons/ai';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import CollaborativeGiftModal from '../../modal/CollaborativeGiftModal/page';

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.productsState);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCollaborativeModalOpen, setIsCollaborativeModalOpen] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState({});
  const [productImageErrors, setProductImageErrors] = useState({});


  // Fetch specific product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          console.error('Failed to fetch product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      toast.success(`${product.name} added to cart`);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch])

  // Get the main product image
  const getMainImage = () => {
    if (mainImageError) return '/placeholder.svg';
    if (product?.images && product.images.length > 0) {
      // If images array contains objects with url property
      if (typeof product.images[0] === 'object' && product.images[0].url) {
        return product.images[selectedImageIndex]?.url || product.images[0].url;
      }
      // If images array contains direct URLs
      return product.images[selectedImageIndex] || product.images[0];
    }
    return '/placeholder.svg';
  };

  // Get thumbnail images
  const getThumbnailImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.slice(0, 4).map((image, index) => {
        if (typeof image === 'object' && image.url) {
          return image.url;
        }
        return image;
      });
    }
    return [];
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 text-red-500 text-center">
        Product not found
      </div>
    );
  }

  const thumbnailImages = getThumbnailImages();

  const openCollaborativeModal = () => setIsCollaborativeModalOpen(true);
  const closeCollaborativeModal = () => setIsCollaborativeModalOpen(false);
  const acceptCollaborativeGuidelines = () => {
    setIsCollaborativeModalOpen(false);
    toast.success("Guidelines accepted. Proceed to invite friends.");
  };

  return (

    <div className='w-full justify-center flex-co px-4 sm:px-8 md:px-16 lg:px-24'>  <Navbar />
      <div className='w-full flex flex-col lg:flex-row h-auto mt-[20px]'>
        {/* Left Section - Image & Description */}
        <div className='flex-col justify-center w-full lg:w-[60%]'>
          <div className='w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-300 rounded-[10px] overflow-hidden relative'>
            <img
              src={getMainImage()}
              alt={product.name}
              className="w-full h-full object-cover rounded-[10px]"
              onError={() => {
                if (!mainImageError) setMainImageError(true);
              }}
            />
            {/* Discount Badge */}
            {product.retailPrice && product.salePrice && product.salePrice !== product.retailPrice && (
              <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {product.salePrice < product.retailPrice 
                  ? `${Math.round(((product.retailPrice - product.salePrice) / product.retailPrice) * 100)}% OFF`
                  : `${Math.round(((product.salePrice - product.retailPrice) / product.retailPrice) * 100)}% UP`
                }
              </div>
            )}
            {/* Stock Status Badge */}
            <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
              product.stockStatus === 'in-stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.stockStatus === 'in-stock' ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
          </div>
          {thumbnailImages.length > 0 && (
            <div className='flex space-x-1 pt-[10px]'>
              {thumbnailImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`w-[72px] h-[72px] rounded-[5px] overflow-hidden cursor-pointer border-2 ${selectedImageIndex === index ? 'border-purple-500' : 'border-gray-300'
                    }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={thumbnailErrors[index] ? '/placeholder.svg' : imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      if (!thumbnailErrors[index]) {
                        setThumbnailErrors(prev => ({ ...prev, [index]: true }));
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Section - Info & Actions */}
        <div className='w-full lg:w-[40%] h-auto lg:pl-[20px] mt-8 lg:mt-0'>
          <div className='flex-col justify-center space-y-[20px]'>
            {/* Product Header */}
            <div className='bg-gradient-to-r from-purple-50 to-blue-50 p-[20px] rounded-[15px] border border-purple-200'>
              <div className='flex justify-between items-start mb-[15px]'>
                <div className='flex-1'>
                  <h1 className='font-bold text-2xl text-gray-800 mb-[8px] leading-tight'>{product.name}</h1>
                  <div className='flex flex-wrap gap-[10px] items-center'>
                    {product.sku && (
                      <span className='bg-gray-100 text-gray-700 px-[8px] py-[3px] rounded-[6px] text-xs font-medium'>
                        SKU: {product.sku}
                      </span>
                    )}
                    {product.mainCategory && (
                      <span className='bg-blue-100 text-blue-700 px-[8px] py-[3px] rounded-[6px] text-xs font-medium capitalize'>
                        {product.mainCategory}
                      </span>
                    )}
                  </div>
                </div>
                <div className='ml-[15px]'>
                  <button className='bg-white hover:bg-pink-50 p-[10px] rounded-full border border-gray-200 hover:border-pink-300 transition-all'>
                    <FaRegHeart className='text-gray-600 hover:text-pink-500 text-lg' />
                  </button>
                </div>
              </div>
              
              {/* Rating Section */}
              <div className='flex items-center mb-[15px] bg-white p-[10px] rounded-[10px] border border-gray-100'>
                <div className='flex items-center pr-[12px]'>
                  {Array.from({ length: 5 }, (_, i) => (
                    i < (product.rating || 0) ? 
                    <FaStar key={i} className='text-yellow-400 text-lg' /> : 
                    <CiStar key={i} className='text-gray-300 text-lg' />
                  ))}
                </div>
                <span className='text-gray-600 font-medium'>({product.rating || 0}/5 Rating)</span>
              </div>
              
              {/* Price Section */}
              <div className='bg-white p-[15px] rounded-[12px] border border-gray-100'>
                <div className='flex items-center space-x-[12px] flex-wrap'>
                  <span className='font-bold text-3xl text-purple-600'>US ${product.salePrice || product.retailPrice}</span>
                  {product.retailPrice && product.salePrice !== product.retailPrice && (
                    <>
                      <span className='font-medium line-through text-gray-500 text-lg'>US ${product.retailPrice}</span>
                      <span className='bg-red-100 text-red-700 px-[8px] py-[4px] rounded-[6px] text-sm font-bold'>
                        Save ${Math.abs(product.retailPrice - (product.salePrice || product.retailPrice)).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quantity Section */}
            <div className='bg-white p-[20px] rounded-[15px] border-2 border-gray-200 hover:border-purple-300 transition-all'>
              <div className='flex items-center justify-between flex-wrap gap-[15px]'>
                <div className='flex items-center space-x-[20px]'>
                  <span className='font-bold text-lg text-gray-800'>Quantity</span>
                  <div className='flex items-center space-x-[12px] bg-gray-50 p-[8px] rounded-[10px] border border-gray-200'>
                    <button 
                      onClick={decreaseQuantity} 
                      className='bg-white hover:bg-purple-100 border border-gray-300 hover:border-purple-400 rounded-[8px] w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-700 hover:text-purple-600 transition-all shadow-sm'
                    >
                      -
                    </button>
                    <span className='w-[70px] h-[45px] bg-white border-2 border-purple-200 flex justify-center items-center font-bold text-lg rounded-[8px] text-purple-600'>
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQuantity} 
                      className='bg-white hover:bg-purple-100 border border-gray-300 hover:border-purple-400 rounded-[8px] w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-700 hover:text-purple-600 transition-all shadow-sm'
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className='flex items-center space-x-[15px] flex-wrap'>
                  <span className={`px-[12px] py-[6px] rounded-[8px] font-medium text-sm ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                  {product.weight && (
                    <span className='bg-blue-100 text-blue-700 px-[10px] py-[5px] rounded-[6px] text-sm font-medium border border-blue-200'>
                      Weight: {product.weight}kg
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex-col justify-center space-y-[15px] pt-[15px]'>
            <button onClick={handleAddToCart} className='flex justify-center items-center border text-[#822BE2] rounded-[8px] w-full h-[50px] gap-2 font-bold'>
              Add to cart <LuShoppingCart />
            </button>
            <button className='flex justify-center items-center border text-white bg-[#822BE2] rounded-[8px] w-full h-[50px] gap-2 font-bold'>
              Get now
            </button>
            <div className='w-full flex flex-col sm:flex-row gap-[15px]'>
              <button onClick={openCollaborativeModal} className='border text-[#822BE2] rounded-[8px] w-full sm:w-[50%] h-[50px] font-semibold'>
                Apply Collaborative
              </button>
              <button className='border text-[#822BE2] rounded-[8px] w-full sm:w-[50%] h-[50px] font-semibold'>
                Apply Surprise Gift
              </button>
            </div>
          </div>

          <div className='mt-[20px] p-[20px] border-2 border-gray-200 rounded-[12px] bg-gradient-to-br from-blue-50 to-purple-50'>
            <div className='mb-[15px]'>
              <span className='font-bold text-lg text-gray-800 flex items-center'>
                🚚 Shipping Information
              </span>
            </div>
            
            <div className='space-y-[8px] mb-[15px]'>
              <div className='flex items-center'>
                <span className='text-gray-700 font-medium'>📦 </span>
                <span className='text-gray-700 ml-[8px]'>
                  Shipping fee will be added based on your buying product and delivered within 7 days.
                </span>
              </div>
              
              {product.shippingClass && (
                <div className='flex items-center'>
                  <span className='text-gray-700 font-medium'>🏷️ </span>
                  <span className='text-gray-700 ml-[8px]'>Shipping Class: <span className='font-semibold text-blue-600'>{product.shippingClass}</span></span>
                </div>
              )}
              
              {product.weight && (
                <div className='flex items-center'>
                  <span className='text-gray-700 font-medium'>⚖️ </span>
                  <span className='text-gray-700 ml-[8px]'>Product Weight: <span className='font-semibold text-green-600'>{product.weight}kg</span></span>
                </div>
              )}
              
              {product.dimensions && (
                <div className='flex items-center'>
                  <span className='text-gray-700 font-medium'>📏 </span>
                  <span className='text-gray-700 ml-[8px]'>
                    Dimensions: <span className='font-semibold text-purple-600'>{product.dimensions.length}L x {product.dimensions.width}W x {product.dimensions.height}H cm</span>
                  </span>
                </div>
              )}
              
              {product.taxClass && (
                <div className='flex items-center'>
                  <span className='text-gray-700 font-medium'>💰 </span>
                  <span className='text-gray-700 ml-[8px]'>Tax Class: <span className='font-semibold text-orange-600'>{product.taxClass}</span></span>
                </div>
              )}
              
              <div className='flex items-center'>
                <span className='text-gray-700 font-medium'>↩️ </span>
                <span className='text-gray-700 ml-[8px]'>
                  Returnable with <span className='underline text-blue-600 font-semibold hover:text-blue-800 cursor-pointer'>Terms & Conditions</span>
                </span>
              </div>
            </div>
            
            <div className='border-t border-gray-300 pt-[15px]'>
              <div className='mb-[10px]'>
                <span className='font-bold text-lg text-gray-800 flex items-center'>
                  💳 Payment Options
                </span>
              </div>
              <div className='flex gap-[15px] items-center bg-white p-[10px] rounded-[8px] border border-gray-200'>
                <FaCcVisa className='text-[45px] text-blue-600 hover:text-blue-700 transition-colors' />
                <FaCcPaypal className='text-[45px] text-blue-500 hover:text-blue-600 transition-colors' />
                <SiMastercard className='text-[45px] text-red-500 hover:text-red-600 transition-colors' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex-col items-start mt-[40px] w-full'>
        <div className='pb-[15px]'>
          <span className='font-medium text-lg'>Description</span>
        </div>
        {product.shortDescription && (
          <div className='mb-4'>
            <p className='font-content text-gray-600 mt-1'>
              {product.shortDescription}
            </p>
          </div>
        )}
        {product.detailedDescription && (
          <div className='mb-4'>
            <span className='font-medium text-md'>Detailed Description:</span>
            <p className='font-content text-gray-600 mt-1'>
              {product.detailedDescription}
            </p>
          </div>
        )}
        {!product.shortDescription && !product.detailedDescription && (
          <p className='font-content text-gray-600'>
            No description available for this product.
          </p>
        )}
      </div>

      {/* all Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8 md:mt-[100px]">
        {allProducts && allProducts.length > 0 ? (
          allProducts.slice(0, 9).map((product) => {
            const getProductImage = () => {
              if (productImageErrors[product._id]) return '/placeholder.svg';
              if (product?.images && product.images.length > 0) {
                if (typeof product.images[0] === 'object' && product.images[0].url) {
                  return product.images[0].url;
                }
                return product.images[0];
              }
              return '/placeholder.svg';
            };

            return (
              <Link
                key={product._id}
                href={`/productDetail/${product._id}`}
                className="w-full h-auto rounded-lg block"
              >
                <div className="relative">
                  <Image
                    src={getProductImage()}
                    alt={product.name}
                    width={172}
                    height={172}
                    className="rounded-lg object-cover w-full h-auto"
                    onError={() => {
                      if (!productImageErrors[product._id]) {
                        setProductImageErrors(prev => ({ ...prev, [product._id]: true }));
                      }
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-red-100 rounded-full p-1">
                    <Flame className="text-red-500 w-4 h-4" />
                  </div>
                  <div className="absolute top-2 right-2 bg-purple-100 rounded-full p-1">
                    <Heart className="text-purple-500 w-4 h-4" />
                  </div>
                </div>

                <div className="mt-2 px-1">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <p className="font-medium text-gray-700">
                    US ${product.price || product.retailPrice}
                  </p>
                  <div className="flex text-yellow-400 text-xs sm:text-sm mt-1">
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

                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-red-500">Server currently busy!</p>
        )}
      </div>
      <CollaborativeGiftModal
        isOpen={isCollaborativeModalOpen}
        onClose={closeCollaborativeModal}
        onAccept={acceptCollaborativeGuidelines}
        productName={product?.name}
        productPrice={product?.salePrice}
        productId={product._id}
      />

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export default ProductDetailPage;
