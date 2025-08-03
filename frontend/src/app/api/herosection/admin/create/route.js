import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch('http://localhost:5000/api/herosection/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': cookieHeader
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating slide:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create slide',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 