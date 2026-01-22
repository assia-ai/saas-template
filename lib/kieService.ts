/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service to interact with the Kie.ai API for video generation using Veo 3.1 model.
 * Based on official Kie.ai API documentation.
 */

export enum KieModel {
    VEO_FAST = "veo3_fast",
    VEO_QUALITY = "veo3",
}

export interface KieGenerateParams {
    prompt: string;
    model: KieModel;
    aspect_ratio?: "16:9" | "9:16";
    imageUrls?: string[];
    duration?: 5 | 10;
    quality?: "720p" | "1080p";
    watermark?: string;
    callBackUrl?: string;
}

export interface KieTaskResponse {
    taskId: string;
    status: "pending" | "processing" | "completed" | "failed";
    videoUrl?: string;
    error?: string;
}

const KIE_API_BASE_URL = "https://api.kie.ai/api/v1";
const KIE_API_KEY = process.env.KIE_API_KEY;

/**
 * Starts a video generation task on Kie.ai.
 * Returns the taskId.
 */
export const generateVideo = async (params: KieGenerateParams): Promise<string> => {
    if (!KIE_API_KEY) {
        throw new Error("KIE_API_KEY is not configured in environment variables.");
    }

    const requestBody = {
        prompt: params.prompt,
        model: params.model,
        aspect_ratio: params.aspect_ratio || "16:9",
        duration: params.duration || 5,
        quality: params.quality || "720p",
    };

    console.log("[Kie.ai] Sending request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${KIE_API_BASE_URL}/veo/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${KIE_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("[Kie.ai] Response status:", response.status);
    console.log("[Kie.ai] Response body:", responseText);

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || response.statusText;
        } catch {
            errorMessage = responseText || response.statusText;
        }
        throw new Error(`Kie.ai API Error (${response.status}): ${errorMessage}`);
    }

    const data = JSON.parse(responseText);

    // Kie.ai returns { code: 200, msg: "success", data: { taskId: "..." } }
    const taskId = data.data?.taskId || data.taskId || data.task_id;
    console.log("[Kie.ai] Extracted taskId:", taskId);

    return taskId;
};

/**
 * Checks the status of a specific task by taskId.
 * Endpoint: GET /veo/record-info?taskId=xxx
 * Status values: wait, queueing, generating, success, fail
 */
export const checkTaskStatus = async (taskId: string): Promise<KieTaskResponse> => {
    if (!KIE_API_KEY) {
        throw new Error("KIE_API_KEY is not configured.");
    }

    const url = `${KIE_API_BASE_URL}/veo/record-info?taskId=${taskId}`;
    console.log("[Kie.ai] Checking status:", url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${KIE_API_KEY}`,
        },
    });

    const responseText = await response.text();
    console.log("[Kie.ai] Status response:", responseText);

    if (!response.ok) {
        throw new Error(`Kie.ai API Status Check Error: ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    const record = data.data || data;

    // Kie.ai uses successFlag: 1 for success, errorCode for failure
    // Status can also be: wait, queueing, generating
    let status: "pending" | "processing" | "completed" | "failed" = "pending";

    if (record.successFlag === 1) {
        status = "completed";
    } else if (record.errorCode !== null) {
        status = "failed";
    } else if (record.response) {
        // Has response but not success - still processing
        status = "processing";
    } else {
        status = "pending";
    }

    // Video URL is in response.resultUrls[0]
    const videoUrl = record.response?.resultUrls?.[0] || null;

    console.log("[Kie.ai] Parsed status:", status, "videoUrl:", videoUrl);

    return {
        taskId: record.taskId || taskId,
        status: status,
        videoUrl: videoUrl,
        error: record.errorMessage || record.errorCode,
    };
};

/**
 * Analyzes video content for replication/transformation strategy.
 * This is a placeholder as Kie.ai specifically provides generation models.
 */
export const analyzeVideoContent = async (videoBase64: string): Promise<string> => {
    console.log(`Analyzing video for Kie.ai: ${videoBase64.substring(0, 50)}...`);
    return "Analysis: Cinematic motion with static camera, high key lighting, neutral color palette.";
};
