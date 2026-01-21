import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Implement M-Pesa webhook handling
    console.log('M-Pesa webhook received:', body);

    return NextResponse.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing M-Pesa webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
