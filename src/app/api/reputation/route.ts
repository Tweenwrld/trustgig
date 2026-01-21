import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: {
        reputationScore: true,
        completedJobs: true,
        totalEarned: true,
        workerJobs: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            title: true,
            completedAt: true,
          },
          orderBy: { completedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ reputation: user });
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reputation' },
      { status: 500 }
    );
  }
}
