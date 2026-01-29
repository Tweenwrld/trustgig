'use client';

import { Star } from 'lucide-react';

interface ReputationStarsProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showNumber?: boolean;
}

const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

export function ReputationStars({
    rating,
    maxRating = 5,
    size = 'md',
    showNumber = true,
}: ReputationStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            {/* Full stars */}
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                    key={`full-${i}`}
                    className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
                />
            ))}

            {/* Half star */}
            {hasHalfStar && (
                <div className="relative">
                    <Star className={`${sizeClasses[size]} text-yellow-400`} />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
                    </div>
                </div>
            )}

            {/* Empty stars */}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
                />
            ))}

            {/* Rating number */}
            {showNumber && (
                <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
