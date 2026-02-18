'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { JobCategory } from '@trustgig/shared-types';
import { X, Plus } from 'lucide-react';

interface SkillsSelectorProps {
    value: string[];
    onChange: (skills: string[]) => void;
}

export function SkillsSelector({ value = [], onChange }: SkillsSelectorProps) {
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        const skill = inputValue.trim();
        if (skill && !value.includes(skill)) {
            onChange([...value, skill]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (skillToRemove: string) => {
        onChange(value.filter((skill) => skill !== skillToRemove));
    };

    const addSuggestion = (category: string) => {
        const skill = category.charAt(0) + category.slice(1).toLowerCase();
        if (!value.includes(skill)) {
            onChange([...value, skill]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {value.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                        {skill}
                        <button
                            type="button"
                            onClick={() => handleRemove(skill)}
                            className="hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="Add a skill (e.g. React, Plumbing)..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="max-w-sm"
                />
                <Button type="button" variant="outline" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>

            <div className="text-sm text-muted-foreground">
                <p className="mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(JobCategory).slice(0, 5).map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => addSuggestion(cat)}
                            className="text-xs border rounded-full px-3 py-1 hover:bg-muted transition-colors"
                        >
                            + {cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
