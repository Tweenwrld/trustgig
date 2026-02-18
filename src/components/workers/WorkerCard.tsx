'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export interface WorkerCardProps {
    id: string;
    name: string;
    avatar?: string | null;
    rating: number;
    completedJobs: number;
    hourlyRate: number;
    skills: string[];
    bio?: string | null;
    availability: boolean;
    verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
    onClick?: () => void;
}

export function WorkerCard({
    name,
    avatar,
    rating,
    completedJobs,
    hourlyRate,
    skills,
    bio,
    availability,
    verificationStatus,
    onClick
}: WorkerCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
                <Avatar className="h-12 w-12 border">
                    <AvatarImage src={avatar || undefined} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg leading-none">{name}</h3>
                        {verificationStatus === 'VERIFIED' && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 h-5 px-1.5 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                        <span className="mx-1">•</span>
                        <span>{completedJobs} jobs</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                    {bio || "No bio available."}
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs bg-secondary/50">
                            {skill}
                        </Badge>
                    ))}
                    {skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{skills.length - 3}</Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between">
                <div>
                    <span className="text-lg font-bold">₳{hourlyRate}</span>
                    <span className="text-xs text-muted-foreground">/hr</span>
                </div>
                <div className="flex gap-2">
                    {/* "View Profile" could be here */}
                    {availability ? (
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                            Available
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                            Busy
                        </Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}

export function WorkerCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/4 bg-muted animate-pulse rounded" />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-3 w-full bg-muted animate-pulse rounded" />
                <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                <div className="flex gap-2 pt-2">
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                </div>
            </CardContent>
        </Card>
    );
}
