import { NextResponse } from 'next/server';
import heicConvert from 'heic-convert';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Convert HEIC to JPEG
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.8
    });

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

  } catch (error) {
    console.error('HEIC conversion error:', error);
    return NextResponse.json({ error: 'Failed to convert HEIC image' }, { status: 500 });
  }
}
