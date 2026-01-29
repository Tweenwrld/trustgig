'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, GripVertical, AlertCircle, PieChart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CurrencyDisplay } from '@/components/brand/CurrencyDisplay';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface Milestone {
    id: string;
    description: string;
    amount: number;
}

interface MilestoneCreatorProps {
    totalBudget: number;
    initialMilestones?: Milestone[];
    onChange: (milestones: Milestone[]) => void;
    currency?: 'ADA' | 'USD';
}

export function MilestoneCreator({
    totalBudget,
    initialMilestones = [],
    onChange,
    currency = 'ADA',
}: MilestoneCreatorProps) {
    const [milestones, setMilestones] = useState<Milestone[]>(
        initialMilestones.length > 0
            ? initialMilestones
            : [{ id: crypto.randomUUID(), description: 'Project Initiation', amount: 0 }]
    );

    // Update parent when milestones change
    useEffect(() => {
        onChange(milestones);
    }, [milestones, onChange]);

    // Calculations
    const totalAllocated = useMemo(() =>
        milestones.reduce((sum, m) => sum + (m.amount || 0), 0),
        [milestones]);

    const remainingBudget = totalBudget - totalAllocated;
    const isBudgetMatched = Math.abs(remainingBudget) < 0.01;
    const isValid = isBudgetMatched && milestones.every(m => m.description.trim().length > 0 && m.amount > 0);

    // Handlers
    const addMilestone = () => {
        setMilestones([
            ...milestones,
            { id: crypto.randomUUID(), description: '', amount: 0 }
        ]);
    };

    const removeMilestone = (id: string) => {
        if (milestones.length <= 1) return;
        setMilestones(milestones.filter(m => m.id !== id));
    };

    const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
        setMilestones(milestones.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        ));
    };

    const distributeEvenly = () => {
        const count = milestones.length;
        if (count === 0) return;

        const amountPerMilestone = Number((totalBudget / count).toFixed(2));
        const remainder = Number((totalBudget - (amountPerMilestone * count)).toFixed(2));

        const newMilestones = milestones.map((m, index) => ({
            ...m,
            amount: index === 0 ? amountPerMilestone + remainder : amountPerMilestone
        }));

        setMilestones(newMilestones);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Milestones</h3>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={distributeEvenly}>
                                    Distribute Evenly
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Split budget equally across all milestones</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Progress / Budget Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Allocated: <CurrencyDisplay amount={totalAllocated} currency={currency} size="sm" /></span>
                    <span className={remainingBudget < 0 ? 'text-red-500 font-medium' : 'text-gray-500'}>
                        Remaining: <CurrencyDisplay amount={remainingBudget} currency={currency} size="sm" />
                    </span>
                </div>
                <Progress
                    value={Math.min((totalAllocated / totalBudget) * 100, 100)}
                    className={`h-2 ${totalAllocated > totalBudget ? 'bg-red-100 dark:bg-red-900' : ''}`}
                />
                {totalAllocated > totalBudget && (
                    <p className="text-xs text-red-500">Total exceeds budget by <CurrencyDisplay amount={totalAllocated - totalBudget} currency={currency} size="sm" /></p>
                )}
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
                {milestones.map((milestone, index) => (
                    <Card key={milestone.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4 flex gap-4 items-start">
                            <div className="mt-3 text-gray-400 cursor-move">
                                <GripVertical size={20} />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8 space-y-1">
                                    <Label htmlFor={`desc-${milestone.id}`} className="text-xs text-gray-500">Description</Label>
                                    <Input
                                        id={`desc-${milestone.id}`}
                                        placeholder={`Milestone ${index + 1} description`}
                                        value={milestone.description}
                                        onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-4 space-y-1">
                                    <Label htmlFor={`amount-${milestone.id}`} className="text-xs text-gray-500">Amount</Label>
                                    <div className="relative">
                                        <Input
                                            id={`amount-${milestone.id}`}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pr-12"
                                            value={milestone.amount || ''}
                                            onChange={(e) => updateMilestone(milestone.id, 'amount', parseFloat(e.target.value) || 0)}
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500 text-sm">
                                            {currency === 'ADA' ? '₳' : '$'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="mt-6 text-gray-400 hover:text-red-500"
                                onClick={() => removeMilestone(milestone.id)}
                                disabled={milestones.length === 1}
                            >
                                <Trash2 size={18} />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Actions */}
            <Button
                variant="outline"
                className="w-full border-dashed border-2 py-6 text-gray-500 hover:border-blue-500 hover:text-blue-500"
                onClick={addMilestone}
            >
                <Plus size={18} className="mr-2" /> Add Milestone
            </Button>

            {/* Validation Message */}
            {!isValid && (
                <Alert variant={isBudgetMatched ? "default" : "destructive"}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        {!isBudgetMatched
                            ? `Please adjust amounts to match total budget of ${totalBudget} ${currency}`
                            : "All milestones must have a description and amount greater than 0"
                        }
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
