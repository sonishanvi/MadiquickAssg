import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import VaultItem from '@/lib/models/VaultItem';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// PUT - Update vault item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get params
    const { id } = await params;
    
    // Find and update vault item
    const vaultItem = await VaultItem.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      { encryptedData },
      { new: true }
    );

    if (!vaultItem) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Vault item updated successfully',
      item: vaultItem,
    });
  } catch (error) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete vault item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get params
    const { id } = await params;
    
    // Find and delete vault item
    const vaultItem = await VaultItem.findOneAndDelete({
      _id: id,
      userId: payload.userId,
    });

    if (!vaultItem) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Vault item deleted successfully',
    });
  } catch (error) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
