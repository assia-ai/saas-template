/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';

import React, { useState, useEffect } from 'react';
import PromptForm from '../../components/veo/PromptForm';
import LoadingIndicator from '../../components/veo/LoadingIndicator';
import VideoResult from '../../components/veo/VideoResult';
import { GenerateVideoParams, AspectRatio } from '../../types/veo';
import { KieModel } from '../../lib/kieService';
import { startVideoGeneration, pollVideoStatus } from '../../lib/actions/veo';
import { useUser } from '@clerk/nextjs';

export default function StudioPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [currentParams, setCurrentParams] = useState<(GenerateVideoParams & { model: KieModel }) | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);

    const handleGenerate = async (params: GenerateVideoParams & { model: KieModel }) => {
        if (!isSignedIn) {
            alert("Please sign in to generate videos.");
            return;
        }

        setIsGenerating(true);
        setVideoUrl(null);
        setCurrentParams(params);

        try {
            const response = await startVideoGeneration(params);
            setTaskId(response.taskId);
        } catch (error) {
            console.error("Generation failed:", error);
            alert("Failed to start generation. Please check your API key.");
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (taskId && isGenerating) {
            interval = setInterval(async () => {
                try {
                    const status = await pollVideoStatus(taskId);
                    if (status.status === 'completed' && status.video_url) {
                        setVideoUrl(status.video_url);
                        setIsGenerating(false);
                        setTaskId(null);
                    } else if (status.status === 'failed') {
                        alert("Generation failed on Kie.ai.");
                        setIsGenerating(false);
                        setTaskId(null);
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 5000); // Poll every 5 seconds
        }

        return () => clearInterval(interval);
    }, [taskId, isGenerating]);

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">VEO Studio</h1>
                        <p className="text-gray-400 mt-2">Create cinematic AI videos with Veo 3.1 & Kie.ai</p>
                    </div>
                </header>

                <main className="relative min-h-[400px] flex items-center justify-center">
                    {!isGenerating && !videoUrl && (
                        <div className="w-full">
                            <PromptForm
                                onGenerate={handleGenerate}
                                initialValues={currentParams}
                            />
                        </div>
                    )}

                    {isGenerating && (
                        <div className="w-full max-w-lg">
                            <LoadingIndicator />
                        </div>
                    )}

                    {!isGenerating && videoUrl && (
                        <div className="w-full">
                            <VideoResult
                                videoUrl={videoUrl}
                                aspectRatio={currentParams?.aspectRatio ?? AspectRatio.LANDSCAPE}
                                canExtend={currentParams?.resolution === '720p'}
                                onRetry={() => currentParams && handleGenerate(currentParams)}
                                onNewVideo={() => {
                                    setVideoUrl(null);
                                    setTaskId(null);
                                }}
                                onExtend={() => {
                                    alert("Extension is coming soon in the Lab mode!");
                                }}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
