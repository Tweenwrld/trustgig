import { prisma } from './prisma';

/**
 * Database query utilities
 */

export const getUserByWallet = async (walletAddress: string) => {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: {
      clientJobs: { take: 5, orderBy: { createdAt: 'desc' } },
      workerJobs: { take: 5, orderBy: { createdAt: 'desc' } },
      credentials: true,
    },
  });
};

export const getActiveJobs = async (limit = 20) => {
  return prisma.job.findMany({
    where: { status: 'ACTIVE' },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          avatar: true,
          reputationScore: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

export const getJobById = async (id: string) => {
  return prisma.job.findUnique({
    where: { id },
    include: {
      client: true,
      worker: true,
      milestones: true,
      escrow: true,
    },
  });
};

export const createJob = async (data: {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: Date;
  clientId: string;
  location: any;
}) => {
  return prisma.job.create({
    data: {
      ...data,
      status: 'ACTIVE',
    },
  });
};

export const updateJobStatus = async (
  jobId: string,
  status: string,
  workerId?: string
) => {
  return prisma.job.update({
    where: { id: jobId },
    data: {
      status: status as any,
      ...(workerId && { workerId }),
      ...(status === 'IN_PROGRESS' && { startedAt: new Date() }),
      ...(status === 'COMPLETED' && { completedAt: new Date() }),
    },
  });
};
