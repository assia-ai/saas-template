/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';

import React, { useState, useEffect } from 'react';
import AnalyzeCloneView from '../../components/veo/AnalyzeCloneView';
import { GenerateVideoParams } from '../../types/veo';
import { KieModel } from '../../lib/kieService';
import { startVideoGeneration, pollVideoStatus } from '../../lib/actions/veo';
import { useUser } from '@clerk/nextjs';

export default function LabPage() {
    const { isLoaded, isSignedIn } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);

    const handleStartGeneration = async (params: GenerateVideoParams & { model: KieModel }) => {
        if (!isSignedIn) {
            alert("Please sign in to use the AI Lab.");
            return;
        }

        setIsGenerating(true);
        setVideoUrl(null);

        try {
            const response = await startVideoGeneration(params);
            setTaskId(response.taskId);
        } catch (error) {
            console.error("Lab generation failed:", error);
            alert("Failed to start transformation.");
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (taskId && isGenerating) {
            interval = setInterval(async () => {
                try {
                    const status = await pollVideoStatus(taskId);
                    if (status.status === 'completed' && status.videoUrl) {
                        setVideoUrl(status.videoUrl);
                        setIsGenerating(false);
                        setTaskId(null);
                    } else if (status.status === 'failed') {
                        alert("Transformation failed.");
                        setIsGenerating(false);
                        setTaskId(null);
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [taskId, isGenerating]);

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <AnalyzeCloneView
                isProcessing={isGenerating}
                videoUrl={videoUrl}
                onStartGeneration={handleStartGeneration}
                onReset={() => {
                    setVideoUrl(null);
                    setTaskId(null);
                    setIsGenerating(false);
                }}
            />
        </div>
    );
}
