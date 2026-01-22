/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { getVideos } from '../../lib/actions/veo';
import { auth } from '@clerk/nextjs/server';
import { DownloadIcon, PlayIcon } from '../../components/veo/icons';

interface VideoItem {
    id: string;
    task_id: string;
    prompt: string;
    status: string;
    video_url: string | null;
    created_at: string;
    aspect_ratio: string;
}

export default async function GalleryPage() {
    const { userId } = await auth();

    if (!userId) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">Your Private Gallery</h1>
                <p className="text-gray-400 max-w-md">Please sign in to view your cinematic creations.</p>
            </div>
        );
    }

    let videos: VideoItem[] = [];
    try {
        const data = await getVideos();
        videos = data as unknown as VideoItem[];
    } catch (error) {
        console.error("Error fetching videos:", error);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-8 animate-in fade-in duration-1000">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight">Gallery</h1>
                    <p className="text-gray-400 mt-2">Your collection of AI-generated masterpieces</p>
                </header>

                {videos.length === 0 ? (
                    <div className="bg-[#111111] border border-gray-800 rounded-3xl p-20 text-center">
                        <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <PlayIcon className="w-8 h-8 text-gray-700" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-300">No videos yet</h2>
                        <p className="text-gray-500 mt-2">Head over to the Studio to create your first scene.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((video) => (
                            <div key={video.id} className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-xl">
                                <div className={`relative ${video.aspect_ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'} bg-black overflow-hidden`}>
                                    {video.status === 'completed' && video.video_url ? (
                                        <video
                                            src={video.video_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            autoPlay // Allow autoplay for gallery feel if desired, or remove
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                                            {video.status === 'pending' ? (
                                                <>
                                                    <div className="w-8 h-8 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin mb-2"></div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Rendering...</span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Failed</span>
                                            )}
                                        </div>
                                    )}
                                    {video.video_url && (
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={video.video_url}
                                                download
                                                className="p-2 bg-black/60 hover:bg-black rounded-full text-white block"
                                                title="Download MP4"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-gray-300 line-clamp-2 font-medium mb-3 min-h-[40px] leading-relaxed">
                                        {video.prompt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800/50">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                            {new Date(video.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${video.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                video.status === 'pending' ? 'bg-indigo-500/10 text-indigo-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            {video.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
