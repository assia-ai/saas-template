'use server';

import { auth } from '@clerk/nextjs/server';
import { generateVideo, checkTaskStatus, KieModel } from '../kieService';
import { GenerateVideoParams } from '../../types/veo';

export async function startVideoGeneration(params: GenerateVideoParams & { model: KieModel }) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Call Kie.ai API with correct model mapping
    const kieModel = params.model === KieModel.VEO_QUALITY ? KieModel.VEO_QUALITY : KieModel.VEO_FAST;

    console.log("[Server Action] Starting generation with model:", kieModel);

    const taskId = await generateVideo({
        prompt: params.prompt,
        model: kieModel,
        aspect_ratio: params.aspectRatio === '9:16' ? '9:16' : '16:9',
    });

    console.log("[Server Action] Task created:", taskId);

    // TODO: Persist to Supabase once JWT integration is configured
    // For now, we skip database persistence to test Kie.ai

    return { taskId };
}

export async function pollVideoStatus(taskId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // Check Kie.ai Status
    const response = await checkTaskStatus(taskId);

    // TODO: Update Supabase once JWT integration is configured

    return response;
}

export async function getVideos() {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    // TODO: Fetch from Supabase once JWT integration is configured
    // For now, return empty array
    return [];
}
