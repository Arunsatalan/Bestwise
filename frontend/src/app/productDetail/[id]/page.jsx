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


function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.productsState);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Fetch specific product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
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

  return (

    <div className='w-full justify-center flex-co px-4 sm:px-8 md:px-16 lg:px-24'>  <Navbar />
      <div className='w-full flex flex-col lg:flex-row h-auto mt-[20px]'>
        {/* Left Section - Image & Description */}
        <div className='flex-col justify-center w-full lg:w-[60%]'>
          <div className='w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-300 rounded-[10px]'>
            {/* Replace with product image if available */}
            <img src="/mug.jpg" alt={product.name} className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className='flex space-x-1 pt-[10px]'>
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className=' bg-gray-300 w-[72px] h-[72px] rounded-[5px]'>1</div>
            ))}
          </div>
        </div>

        {/* Right Section - Info & Actions */}
        <div className='w-full lg:w-[40%] h-auto lg:pl-[20px] mt-8 lg:mt-0'>
          <div className='flex-col justify-center space-y-[15px]'>
            <div className='flex justify-between items-center'>
              <span className='font-extra-large font-bold'>{product.name}</span>
              <span><FaRegHeart /></span>
            </div>
            <div className='flex items-center'>
              <div className='flex items-center pr-[15px]'>
                <FaStar /><FaStar /><FaStar /><FaStar /><CiStar />
              </div>
              <span>(27 Ratings)</span>
            </div>
            <div className='flex items-center space-x-[15px]'>
              <span className='font-extra-large font-bold'>US ${product.retailPrice}</span>
              <span className='font-content line-through'>US {product.salePrice}$</span>
            </div>
            <div className='flex items-center space-x-[10px]'>
              <span className='font-medium'>Quantity</span>
              <button onClick={decreaseQuantity} className='border bg-[#D9D9D9] rounded-[5px] w-[25px] h-[25px]'>-</button>
              <span className='w-[48px] h-[40px] border flex justify-center items-center font-large rounded-[5px]'>{quantity}</span>
              <button onClick={increaseQuantity} className='border bg-[#D9D9D9] rounded-[5px] w-[25px] h-[25px]'>+</button>
              <span className='pl-[50px] text-green-500'>{product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}</span>
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
              <button className='border text-[#822BE2] rounded-[8px] w-full sm:w-[50%] h-[50px] font-semibold'>
                Apply Collaborative
              </button>
              <button className='border text-[#822BE2] rounded-[8px] w-full sm:w-[50%] h-[50px] font-semibold'>
                Apply Surprise Gift
              </button>
            </div>
          </div>

          <div className='mt-[15px] p-[15px] border rounded-[8px]'>
            <span className='font-medium'>Shipping Information</span><br />
            <span className='text-[#5C5C5C]'>
              Shipping fee will be added based on your buying product and delivered within 7 days.
            </span><br />
            <span className='text-[#5C5C5C]'>
              Returnable with <span className='underline text-blue-500'>Terms & Conditions</span>
            </span><br /><br />
            <span className='font-medium'>Payment Options</span><br />
            <div className='flex gap-[10px] items-center'>
              <FaCcVisa className='text-[50px] text-[#5C5C5C]' />
              <FaCcPaypal className='text-[50px] text-[#5C5C5C]' />
              <SiMastercard className='text-[50px] text-[#5C5C5C]' />
            </div>
          </div>
        </div>
      </div>
      <div className='flex-col items-start mt-[40px] w-full'>
        <div className='pb-[15px]'>
          <span className='font-medium text-lg'>Description</span>
        </div>
        <p className='font-content text-gray-600'>
          {product.detailedDescription || product.shortDescription}
        </p>
      </div>

      {/* all Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-8 md:mt-[100px]">
        {allProducts && allProducts.length > 0 ? (
          allProducts.slice(0, 9).map((product) => (
            <Link
              key={product._id}
              href={`/productDetail/${product._id}`}
              className="w-full h-auto rounded-lg block"
            >
              <div className="relative">
                <Image
                  src="/mug.jpg" // Replace with product.
                  alt={product.name}
                  width={172}
                  height={172}
                  className="rounded-lg object-cover w-full h-auto"
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
                  US ${product.price}
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
          ))
        ) : (
          <p className="text-red-500">Server currently busy!</p>
        )}
      </div>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}

export default ProductDetailPage;
