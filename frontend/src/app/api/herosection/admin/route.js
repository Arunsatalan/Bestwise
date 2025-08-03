import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    // Fetch all slides (both active and inactive) for admin management
    const response = await fetch('http://localhost:5000/api/herosection/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to include full image URLs
    if (data.success && data.data) {
      data.data = data.data.map(slide => ({
        ...slide,
        image: slide.image ? `http://localhost:5000/${slide.image.replace(/\\/g, '/')}` : slide.image
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching hero section data:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch hero section data',
        data: [] 
      },
      { status: 500 }
    );
  }
} 