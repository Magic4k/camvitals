import { NextRequest, NextResponse } from 'next/server';

const CAMVITALS_API_BASE = 'https://camvitals.azurewebsites.net';

export async function POST(request: NextRequest) {
  console.log('Chatbot API proxy - Processing request');
  
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Chatbot API proxy - Request body:', body);
    
    // Get the Authorization header from the request
    const authHeader = request.headers.get('Authorization');
    console.log('Chatbot API proxy - Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('Chatbot API proxy - No authorization header');
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Forward the request to CamVitals API
    const camvitalsResponse = await fetch(`${CAMVITALS_API_BASE}/api/v1/chatbot/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log('Chatbot API proxy - CamVitals response status:', camvitalsResponse.status);
    console.log('Chatbot API proxy - CamVitals response ok:', camvitalsResponse.ok);
    
    if (!camvitalsResponse.ok) {
      const errorText = await camvitalsResponse.text();
      console.error('Chatbot API proxy - CamVitals error:', errorText);
      
      return NextResponse.json(
        { error: 'Chatbot service unavailable' },
        { status: camvitalsResponse.status }
      );
    }
    
    // Parse and return the response
    const responseData = await camvitalsResponse.json();
    console.log('Chatbot API proxy - Success response:', responseData);
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Chatbot API proxy - Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 