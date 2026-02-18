'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import EscrowInteraction from '@/components/contracts/EscrowInteraction';
import { Job, JobStatus, JobCategory } from '@trustgig/shared-types';
import { Badge } from '@/components/ui/badge';

export default function JobDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const { connected, address } = useWallet();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/${id}`);
                if (!response.ok) {
                    if (response.status === 404) notFound();
                    throw new Error('Failed to fetch job');
                }
                const data = await response.json();
                setJob(data);
            } catch (error) {
                console.error('Error fetching job:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) return null;

    const isClient = connected && address === job.clientId;
    const isWorker = connected && address === job.workerId;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {job.title}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <Badge variant="outline">{job.category}</Badge>
                                        <span>•</span>
                                        <span>{job.location.city}, {job.location.country}</span>
                                    </div>
                                </div>
                                <Badge className={
                                    job.status === JobStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                        job.status === JobStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                }>
                                    {job.status.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                                Milestones
                            </h3>
                            {job.milestones.length === 0 ? (
                                <p className="text-gray-500 italic">No specific milestones set.</p>
                            ) : (
                                <div className="space-y-4">
                                    {job.milestones.map((milestone) => (
                                        <div key={milestone.id} className="flex justify-between items-center p-4 border rounded-lg">
                                            <span>{milestone.description}</span>
                                            <span className="font-semibold">{milestone.amount} ₳</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Budget Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">
                                Project Budget
                            </h3>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                {job.budget} ₳
                            </div>

                            {/* Connect Wallet Prompt */}
                            {!connected ? (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                                    Please connect your wallet to interact with this job.
                                </div>
                            ) : (
                                /* Escrow Actions */
                                <EscrowInteraction
                                    jobId={job.id}
                                    amount={BigInt(Math.floor(job.budget * 1000000))} // Convert to Lovelace
                                    status={job.status}
                                    isClient={isClient}
                                    isWorker={isWorker}
                                />
                            )}
                        </div>

                        {/* Location Map Placeholder */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold mb-4">Location</h3>
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                Map View
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {job.location.address && <>{job.location.address}<br /></>}
                                {job.location.city}, {job.location.country}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
