'use client';

/**
 * Worker Dashboard - Optimized for Next.js 16 PPR
 * 
 * Note: This page uses 'use client' for wallet interaction.
 * For PPR optimization, consider:
 * - Moving static job stats to a Server Component
 * - Using Suspense boundaries for dynamic data
 * - Implementing streaming for job lists
 */

import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import type { Job } from '@trustgig/shared-types';

export default function WorkerDashboard() {
    const { connected, wallet } = useWallet();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!connected) {
            router.push('/connect');
            return;
        }

        // Fetch worker's jobs
        const fetchJobs = async () => {
            try {
                const response = await fetch('/api/jobs?workerId=' + wallet?.address);
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [connected, wallet, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Worker Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your jobs and track your earnings
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Active Jobs
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {jobs.filter((j) => j.status === 'in_progress').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Completed Jobs
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {jobs.filter((j) => j.status === 'completed').length}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Earned
                        </h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                            {jobs
                                .filter((j) => j.status === 'completed')
                                .reduce((sum, j) => sum + j.budget, 0)}{' '}
                            ₳
                        </p>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Your Jobs
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {jobs.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No jobs yet. Start applying to available jobs!
                                </p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {job.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {job.category} • {job.location.city}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {job.budget} ₳
                                            </p>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'in_progress'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : job.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {job.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
