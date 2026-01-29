'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, MapPin, Star } from 'lucide-react';
import type { JobCategory } from '@trustgig/shared-types';

export interface JobCardProps {
    id: string;
    title: string;
    category: JobCategory;
    budget: number;
    urgency: 'low' | 'medium' | 'high';
    location: string;
    postedAt: Date;
    clientReputation?: number;
    onClick?: () => void;
}

const categoryIcons: Record<JobCategory, string> = {
    construction: '🏗️',
    plumbing: '🔧',
    electrical: '⚡',
    carpentry: '🪚',
    painting: '🎨',
    cleaning: '🧹',
    landscaping: '🌳',
    moving: '🚚',
    delivery: '📦',
    other: '💼',
};

const urgencyColors = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const categoryColors: Record<JobCategory, string> = {
    construction: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    plumbing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    electrical: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    carpentry: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    painting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    cleaning: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    landscaping: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    moving: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    delivery: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export function JobCard({
    id,
    title,
    category,
    budget,
    urgency,
    location,
    postedAt,
    clientReputation,
    onClick,
}: JobCardProps) {
    const timeAgo = getTimeAgo(postedAt);

    return (
        <Card
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-gray-200 dark:border-gray-700"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    {/* Category Icon */}
                    <div className="text-3xl flex-shrink-0">{categoryIcons[category]}</div>

                    {/* Urgency Badge */}
                    <Badge variant="secondary" className={urgencyColors[urgency]}>
                        <Clock className="w-3 h-3 mr-1" />
                        {urgency}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>

                {/* Category Badge */}
                <Badge variant="outline" className={categoryColors[category]}>
                    {category}
                </Badge>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                </div>

                {/* Client Reputation */}
                {clientReputation !== undefined && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{clientReputation.toFixed(1)}</span>
                        <span className="ml-1">client rating</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                {/* Budget */}
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {budget} ₳
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Budget</span>
                </div>

                {/* Posted Time */}
                <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</span>
                </div>
            </CardFooter>
        </Card>
    );
}

// Skeleton loader variant
export function JobCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-3 border-t">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-3 w-16" />
            </CardFooter>
        </Card>
    );
}

// Helper function to calculate time ago
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
}
