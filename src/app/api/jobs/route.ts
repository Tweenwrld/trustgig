import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import type { CreateJobInput } from '@trustgig/shared-types';

/**
 * GET /api/jobs - List jobs with filters
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');
        const workerId = searchParams.get('workerId');
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        const jobs = await prisma.job.findMany({
            where: {
                ...(clientId && { clientId }),
                ...(workerId && { workerId }),
                ...(category && { category }),
                ...(status && { status }),
            },
            include: {
                client: true,
                worker: true,
                milestones: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(jobs);
    } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/jobs - Create a new job
 */
export async function POST(request: NextRequest) {
    try {
        const body: CreateJobInput = await request.json();

        // TODO: Get client ID from authenticated session
        const clientId = 'temp-client-id';

        const job = await prisma.job.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                budget: body.budget,
                status: 'active',
                clientId,
                location: body.location,
                deadline: body.deadline,
                estimatedDuration: body.estimatedDuration,
                milestones: {
                    create: body.milestones.map((m, index) => ({
                        description: m.description,
                        amount: m.amount,
                        order: index,
                        completed: false,
                        approved: false,
                    })),
                },
            },
            include: {
                milestones: true,
            },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error('Failed to create job:', error);
        return NextResponse.json(
            { error: 'Failed to create job' },
            { status: 500 }
        );
    }
}
