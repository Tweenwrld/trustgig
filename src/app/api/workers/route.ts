import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const available = searchParams.get('available');

    const workers = await prisma.user.findMany({
      where: {
        role: { in: ['WORKER', 'BOTH'] },
        ...(skill && { skills: { has: skill } }),
        ...(available && { availability: available === 'true' }),
      },
      select: {
        id: true,
        walletAddress: true,
        name: true,
        avatar: true,
        bio: true,
        skills: true,
        hourlyRate: true,
        availability: true,
        reputationScore: true,
        completedJobs: true,
      },
      orderBy: {
        reputationScore: 'desc',
      },
    });

    return NextResponse.json({ workers });
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workers' },
      { status: 500 }
    );
  }
}
