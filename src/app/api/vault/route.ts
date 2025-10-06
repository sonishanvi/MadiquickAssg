import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import VaultItem from '@/lib/models/VaultItem';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET - Fetch all vault items for authenticated user
export async function GET(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch user's vault items
    const vaultItems = await VaultItem.find({ userId: payload.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      items: vaultItems,
    });
  } catch (error) {
    console.error('Get vault items error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new vault item
export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { encryptedData } = await request.json();

    if (!encryptedData) {
      return NextResponse.json(
        { error: 'Encrypted data is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create new vault item
    const vaultItem = new VaultItem({
      userId: payload.userId,
      encryptedData,
    });

    await vaultItem.save();

    return NextResponse.json({
      message: 'Vault item created successfully',
      item: vaultItem,
    });
  } catch (error) {
    console.error('Create vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
