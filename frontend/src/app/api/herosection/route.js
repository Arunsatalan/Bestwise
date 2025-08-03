import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Since Next.js rewrites /api/* to backend, we need to call the backend directly
    const response = await fetch('http://localhost:5000/api/herosection/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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