'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SkillsSelector } from './SkillsSelector';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Define validation schema
const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    hourlyRate: z.number().min(0, 'Hourly rate cannot be negative').optional(),
    skills: z.array(z.string()).default([]),
    availability: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface WorkerProfileFormProps {
    initialData: {
        id: string;
        name: string;
        bio?: string | null;
        hourlyRate?: number | null;
        skills: string[];
        availability: boolean;
    };
}

export function WorkerProfileForm({ initialData }: WorkerProfileFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData.name,
            bio: initialData.bio || '',
            hourlyRate: initialData.hourlyRate || 0,
            skills: initialData.skills,
            availability: initialData.availability,
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);
        try {
            // In a real implementation, this would call an API route
            // await updateProfile(data);

            // Simulating API delay for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saving profile data:', data);

            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            });

            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                        This information will be displayed to clients when they view your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            {...form.register('name')}
                            placeholder="Your full name or business name"
                        />
                        {form.formState.errors.name && (
                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            {...form.register('bio')}
                            placeholder="Tell clients about your experience and expertise..."
                            className="h-32"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {form.watch('bio')?.length || 0}/500
                        </p>
                    </div>

                    {/* Hourly Rate */}
                    <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (₳)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₳</span>
                            <Input
                                id="hourlyRate"
                                type="number"
                                {...form.register('hourlyRate', { valueAsNumber: true })}
                                className="pl-8 max-w-[200px]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills & Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Skills */}
                    <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="p-4 border rounded-lg bg-card">
                            <SkillsSelector
                                value={form.watch('skills')}
                                onChange={(skills) => form.setValue('skills', skills, { shouldDirty: true })}
                            />
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label className="text-base">Available for new work</Label>
                            <p className="text-sm text-muted-foreground">
                                Turn this off if you are fully booked or taking a break.
                            </p>
                        </div>
                        <Switch
                            checked={form.watch('availability')}
                            onCheckedChange={(checked) => form.setValue('availability', checked, { shouldDirty: true })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSaving || !form.formState.isDirty}>
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
