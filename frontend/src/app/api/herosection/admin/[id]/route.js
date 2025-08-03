import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('GET request received for slide ID:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Route is working',
      id: id
    });
  } catch (error) {
    console.error('Error in GET route:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Route error',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log('PUT request received for slide ID:', id);
    
    const formData = await request.formData();
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    console.log('Making request to backend:', `http://localhost:5000/api/herosection/${id}`);
    
    const response = await fetch(`http://localhost:5000/api/herosection/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Cookie': cookieHeader
      },
      body: formData
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update slide',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log('DELETE request received for slide ID:', id);
    
    // Get cookies from the incoming request
    const cookieHeader = request.headers.get('cookie') || '';
    
    const response = await fetch(`http://localhost:5000/api/herosection/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Cookie': cookieHeader
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete slide',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 