'use client';

import { Badge } from '@/components/ui/badge';

export type JobStatus = 'draft' | 'active' | 'in_progress' | 'disputed' | 'completed' | 'cancelled';

interface StatusBadgeProps {
    status: JobStatus;
    size?: 'sm' | 'md';
}

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
    draft: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    },
    active: {
        label: 'Active',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    in_progress: {
        label: 'In Progress',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    disputed: {
        label: 'Disputed',
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    completed: {
        label: 'Completed',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="secondary"
            className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}`}
        >
            {config.label}
        </Badge>
    );
}
