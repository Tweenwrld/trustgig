'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCategory } from '@trustgig/shared-types';
import { Search, X } from 'lucide-react';

function formatCategory(category: string): string {
    return category.charAt(0) + category.slice(1).toLowerCase();
}

// Local logic replaced by imported helper


export function JobFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for inputs to avoid excessive URL updates
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'ALL');
    const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
    const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
    const [urgency, setUrgency] = useState(searchParams.get('urgency') || 'ALL');

    // Update state when URL changes (e.g. back button)
    useEffect(() => {
        setQuery(searchParams.get('query') || '');
        setCategory(searchParams.get('category') || 'ALL');
        setMinBudget(searchParams.get('minBudget') || '');
        setMaxBudget(searchParams.get('maxBudget') || '');
        setUrgency(searchParams.get('urgency') || 'ALL');
    }, [searchParams]);

    const applyFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (query) params.set('query', query);
        else params.delete('query');

        if (category && category !== 'ALL') params.set('category', category);
        else params.delete('category');

        if (minBudget) params.set('minBudget', minBudget);
        else params.delete('minBudget');

        if (maxBudget) params.set('maxBudget', maxBudget);
        else params.delete('maxBudget');

        if (urgency && urgency !== 'ALL') params.set('urgency', urgency);
        else params.delete('urgency');

        router.push(`?${params.toString()}`);
    }, [query, category, minBudget, maxBudget, urgency, router, searchParams]);

    const clearFilters = () => {
        setQuery('');
        setCategory('ALL');
        setMinBudget('');
        setMaxBudget('');
        setUrgency('ALL');
        router.push('/jobs'); // Reset to base URL
    };

    return (
        <Card className="h-fit sticky top-4">
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center text-lg">
                    Filters
                    {(query || category !== 'ALL' || minBudget || maxBudget || urgency !== 'ALL') && (
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
                            placeholder="Search jobs..."
                            className="pl-9"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Categories</SelectItem>
                            {Object.values(JobCategory).map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {formatCategory(cat)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Budget Range */}
                <div className="space-y-2">
                    <Label>Budget (₳)</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                        />
                    </div>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any Urgency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Any Urgency</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Apply Button */}
                <Button className="w-full" onClick={applyFilters}>
                    Apply Filters
                </Button>
            </CardContent>
        </Card>
    );
}
