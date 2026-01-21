import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // TODO: Implement Pinata IPFS upload
    // const pinataApiKey = process.env.PINATA_API_KEY;
    // const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    return NextResponse.json(
      { message: 'IPFS upload not yet implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
