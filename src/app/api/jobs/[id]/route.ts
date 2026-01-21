import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/jobs/[id] - Get job by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const job = await prisma.job.findUnique({
            where: { id: params.id },
            include: {
                client: true,
                worker: true,
                milestones: true,
            },
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        console.error('Failed to fetch job:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/jobs/[id] - Update job
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const job = await prisma.job.update({
            where: { id: params.id },
            data: body,
            include: {
                milestones: true,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.error('Failed to update job:', error);
        return NextResponse.json(
            { error: 'Failed to update job' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/jobs/[id] - Delete job
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.job.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete job:', error);
        return NextResponse.json(
            { error: 'Failed to delete job' },
            { status: 500 }
        );
    }
}
