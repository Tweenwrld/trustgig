'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReputationBadgeProps {
    score: number; // 0-5
    completedJobs: number;
    verified: boolean;
}

export function ReputationBadge({ score, completedJobs, verified }: ReputationBadgeProps) {
    const isHighRep = score >= 4.5;
    const isMediumRep = score >= 3.0 && score < 4.5;

    return (
        <Card className="bg-gradient-to-br from-card to-secondary/20 border-border/50">
            <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isHighRep ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                        <Star className={`h-6 w-6 ${isHighRep ? 'fill-current' : ''}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">{score.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">/ 5.0</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{completedJobs} jobs completed</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge variant={verified ? "default" : "outline"} className={verified ? "bg-green-600 hover:bg-green-700" : ""}>
                                    {verified ? (
                                        <>
                                            <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert className="h-3 w-3 mr-1" /> Unverified
                                        </>
                                    )}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{verified ? 'Identity verified on-chain' : 'Complete verification to boost trust'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {isHighRep && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Top Rated
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
