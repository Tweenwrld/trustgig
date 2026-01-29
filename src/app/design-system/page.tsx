'use client';

import { JobCard, MilestoneCreator } from '@/components/jobs';
import { CurrencyDisplay, StatusBadge, ReputationStars, type JobStatus } from '@/components/brand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { JobCategory } from '@trustgig/shared-types';

export default function DesignSystemPage() {
    const dummyJobClickHandler = () => {
        alert('Job card clicked!');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TrustGig Design System</h1>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Core components and brand elements</p>
                </div>

                <Tabs defaultValue="cards" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto mb-8">
                        <TabsTrigger value="cards">Job Cards</TabsTrigger>
                        <TabsTrigger value="brand">Brand Elements</TabsTrigger>
                        <TabsTrigger value="status">Status Badges</TabsTrigger>
                        <TabsTrigger value="milestones">Milestones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cards" className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Cards</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Construction Job */}
                            <JobCard
                                id="1"
                                title="Fix leaking kitchen sink pipe and install new faucet"
                                category={JobCategory.PLUMBING}
                                budget={150}
                                urgency="high"
                                location="Nairobi, Kenya"
                                postedAt={new Date(Date.now() - 1000 * 60 * 30)} // 30 mins ago
                                clientReputation={4.8}
                                onClick={dummyJobClickHandler}
                            />

                            {/* Electrical Job */}
                            <JobCard
                                id="2"
                                title="Install solar panel system for 3-bedroom house"
                                category={JobCategory.ELECTRICAL}
                                budget={2500}
                                urgency="medium"
                                location="Mombasa, Kenya"
                                postedAt={new Date(Date.now() - 1000 * 60 * 60 * 5)} // 5 hours ago
                                clientReputation={5.0}
                                onClick={dummyJobClickHandler}
                            />

                            {/* Carpentry Job */}
                            <JobCard
                                id="3"
                                title="Custom wardrobe design and installation"
                                category={JobCategory.CARPENTRY}
                                budget={800}
                                urgency="low"
                                location="Kisumu, Kenya"
                                postedAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)} // 2 days ago
                                clientReputation={4.5}
                                onClick={dummyJobClickHandler}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="brand" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Currency Display</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">Small</span>
                                        <CurrencyDisplay amount={50} size="sm" showLabel />
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">Medium</span>
                                        <CurrencyDisplay amount={150.50} size="md" />
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">Large</span>
                                        <CurrencyDisplay amount={12500} size="lg" currency="USD" showLabel />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Reputation Stars</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">5.0 Rating</span>
                                        <ReputationStars rating={5.0} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">4.5 Rating</span>
                                        <ReputationStars rating={4.5} />
                                    </div>
                                    <div className="flex items-center justify-between p-2 border rounded">
                                        <span className="text-sm text-gray-500">3.2 Rating</span>
                                        <ReputationStars rating={3.2} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="status" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Badges</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {(['draft', 'active', 'in_progress', 'disputed', 'completed', 'cancelled'] as JobStatus[]).map((status) => (
                                        <div key={status} className="flex flex-col items-center gap-2 p-4 border rounded">
                                            <StatusBadge status={status} />
                                            <span className="text-xs text-gray-500 font-mono">{status}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="milestones" className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Milestone Creator</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Simple Example</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MilestoneCreator
                                        totalBudget={500}
                                        onChange={(m) => console.log('Milestones updated:', m)}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pre-filled Example</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MilestoneCreator
                                        totalBudget={1000}
                                        initialMilestones={[
                                            { id: '1', description: 'Initial Deposit', amount: 300 },
                                            { id: '2', description: 'Completion', amount: 700 }
                                        ]}
                                        onChange={(m) => console.log('Milestones updated:', m)}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                <Separator className="my-8" />

                <div className="text-center text-sm text-gray-500">
                    <p>TrustGig Design System v1.0 • Built with Shadcn UI</p>
                </div>
            </div>
        </div>
    );
}
