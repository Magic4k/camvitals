import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Processing login request');
    
    // Get the request body
    const body = await request.json();
    console.log('API Route: Request body received:', { email: body.email });
    
    // Check for local HR credentials first
    if (body.email === 'hr@camvitals.com' && body.password === 'securepassword123') {
      console.log('API Route: HR credentials matched, returning local HR user');
      
      const hrResponse = {
        status: 'success',
        data: {
          user: {
            id: 'hr-001',
            name: 'HR Manager',
            email: 'hr@camvitals.com',
            role: 'HR'
          },
          token: 'hr-token-' + Date.now() // Simple token for HR user
        }
      };
      
      return NextResponse.json(hrResponse, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        },
      });
    }
    
    // For all other users, proxy to the actual CamVitals API
    console.log('API Route: Proxying to CamVitals API for non-HR user');
    
    const response = await fetch('https://camvitals.azurewebsites.net/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('API Route: CamVitals API response status:', response.status);
    
    // Get the response data
    const data = await response.json();
    console.log('API Route: CamVitals API response data:', data);
    
    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
      },
    });
    
  } catch (error) {
    console.error('API Route: Error proxying login request:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Authentication failed' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept',
        },
      }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  });
} 