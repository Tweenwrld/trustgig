'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Star } from 'lucide-react';
// Slider removed as component is missing


export function WorkerFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [minRate, setMinRate] = useState(searchParams.get('minRate') || '');
    const [maxRate, setMaxRate] = useState(searchParams.get('maxRate') || '');
    const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') === 'true');
    const [minRating, setMinRating] = useState(searchParams.get('rating') || '');

    useEffect(() => {
        setQuery(searchParams.get('query') || '');
        setMinRate(searchParams.get('minRate') || '');
        setMaxRate(searchParams.get('maxRate') || '');
        setAvailableOnly(searchParams.get('available') === 'true');
        setMinRating(searchParams.get('rating') || '');
    }, [searchParams]);

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) params.set('query', query);
        else params.delete('query');

        if (minRate) params.set('minRate', minRate);
        else params.delete('minRate');

        if (maxRate) params.set('maxRate', maxRate);
        else params.delete('maxRate');

        if (availableOnly) params.set('available', 'true');
        else params.delete('available');

        if (minRating) params.set('rating', minRating);
        else params.delete('rating');

        router.push(`?${params.toString()}`);
    }, [query, minRate, maxRate, availableOnly, minRating, router, searchParams]);

    const clearFilters = () => {
        setQuery('');
        setMinRate('');
        setMaxRate('');
        setAvailableOnly(false);
        setMinRating('');
        router.push('/find-workers');
    };

    return (
        <Card className="h-fit sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-lg">
                    Filters
                    {(query || minRate || maxRate || availableOnly || minRating) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-primary"
                            onClick={clearFilters}
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search Query */}
                <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            placeholder="Name, bio, or skills..."
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                    <Label htmlFor="available" className="cursor-pointer">Available Only</Label>
                    <Switch
                        id="available"
                        checked={availableOnly}
                        onCheckedChange={setAvailableOnly}
                    />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-2">
                    <Label>Hourly Rate (₳)</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minRate}
                            onChange={(e) => setMinRate(e.target.value)}
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxRate}
                            onChange={(e) => setMaxRate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                    <Label>Min Rating</Label>
                    <div className="flex gap-1.5 flex-wrap">
                        {[4.5, 4.0, 3.5].map((rating) => (
                            <button
                                key={rating}
                                onClick={() => setMinRating(rating.toString())}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors ${minRating === rating.toString()
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background hover:bg-muted'
                                    }`}
                            >
                                {rating}+ <Star className="w-3 h-3 fill-current" />
                            </button>
                        ))}
                    </div>
                </div>

                <Button className="w-full" onClick={applyFilters}>
                    Update Results
                </Button>
            </CardContent>
        </Card>
    );
}
