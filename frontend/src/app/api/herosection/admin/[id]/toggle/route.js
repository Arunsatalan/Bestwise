import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch(`http://localhost:5000/api/herosection/${id}/toggle`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling slide status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to toggle slide status',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch(`http://localhost:5000/api/herosection/${id}/toggle`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling slide status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to toggle slide status',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 