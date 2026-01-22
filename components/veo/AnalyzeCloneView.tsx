/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Upload,
    ArrowRight,
    Wand2,
    VideoIcon,
    CheckCircle2,
    Loader2,
    Cpu,
    Sparkles,
    MessageSquare,
    Zap,
    Download,
    Plus,
    Monitor,
    Smartphone,
    Clapperboard,
    History
} from 'lucide-react';
import { analyzeVideoContent, KieModel } from '../../lib/kieService';
import { AspectRatio, Resolution, GenerationMode, GenerateVideoParams, ImageFile } from '../../types/veo';

interface AnalyzeCloneViewProps {
    onStartGeneration: (params: GenerateVideoParams & { model: KieModel }) => void;
    isProcessing: boolean;
    videoUrl: string | null;
    onReset: () => void;
}

type LabStep = 'initial' | 'analyzing' | 'proposal' | 'rendering' | 'completed' | 'extending';

const AnalyzeCloneView: React.FC<AnalyzeCloneViewProps> = ({
    onStartGeneration,
    isProcessing,
    videoUrl,
    onReset
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [base64, setBase64] = useState<string | null>(null);
    const [firstFrame, setFirstFrame] = useState<ImageFile | null>(null);
    const [niche, setNiche] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
    const [currentStep, setCurrentStep] = useState<LabStep>('initial');

    const lastProcessedUrl = useRef<string | null>(null);
    const [sceneCount, setSceneCount] = useState(1);
    const [extensionPrompt, setExtensionPrompt] = useState('');

    const [analysisReport, setAnalysisReport] = useState<string | null>(null);
    const [transformationPlan, setTransformationPlan] = useState<{ explanation: string, finalPrompt: string } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentStep, analysisReport, transformationPlan, videoUrl, isProcessing]);

    useEffect(() => {
        const isWaitingForOutput = currentStep === 'rendering' || currentStep === 'extending';
        if (!isProcessing && videoUrl && videoUrl !== lastProcessedUrl.current && isWaitingForOutput) {
            lastProcessedUrl.current = videoUrl;
            setCurrentStep('completed');
        }
    }, [isProcessing, videoUrl, currentStep]);

    const extractFirstFrame = (videoFile: File): Promise<ImageFile> => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoFile);
            video.crossOrigin = 'anonymous';
            video.currentTime = 0.1;

            video.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(video, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');
                resolve({
                    file: new File([], 'frame.png', { type: 'image/png' }),
                    base64: dataUrl.split(',')[1]
                });
                URL.revokeObjectURL(video.src);
            };
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const reader = new FileReader();
            reader.onload = () => {
                setBase64((reader.result as string).split(',')[1]);
            };
            reader.readAsDataURL(selected);

            try {
                const frame = await extractFirstFrame(selected);
                setFirstFrame(frame);
            } catch (err) {
                console.error("Failed to extract frame", err);
            }
        }
    };

    const startAnalysis = async () => {
        if (!base64 || !niche) return;
        setCurrentStep('analyzing');
        try {
            // Note: Kie.ai analysis might require a public URL or specific vision model call
            // For now, we use a placeholder that simulates the plan creation
            const report = await analyzeVideoContent(base64);
            setAnalysisReport(report);

            // Simulating a transformation plan based on the niche
            const plan = {
                explanation: `Transforming the original motion into a ${niche} aesthetic using Kie.ai's high-fidelity shaders.`,
                finalPrompt: `A cinematic video in ${niche} style, replicating the movement of the subject with sharp details and vibrant lighting.`
            };
            setTransformationPlan(plan);
            setCurrentStep('proposal');
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Error during analysis. Please try again.");
            setCurrentStep('initial');
        }
    };

    const confirmAndGenerate = () => {
        if (!transformationPlan) return;
        setCurrentStep('rendering');
        onStartGeneration({
            prompt: transformationPlan.finalPrompt,
            model: KieModel.VEO_FAST,
            aspectRatio: aspectRatio,
            resolution: Resolution.P720,
            mode: GenerationMode.CLONE_VIDEO,
            startFrame: firstFrame
        });
    };

    const startExtension = () => {
        setCurrentStep('extending');
    };

    const handleExtend = () => {
        if (!extensionPrompt) return;
        setSceneCount(prev => prev + 1);
        setCurrentStep('rendering');
        onStartGeneration({
            prompt: extensionPrompt,
            model: KieModel.VEO_FAST,
            aspectRatio: aspectRatio,
            resolution: Resolution.P720,
            mode: GenerationMode.EXTEND_VIDEO,
            // Pass last generated video as input if needed in the future
        });
        setExtensionPrompt('');
    };

    const handleReset = () => {
        setFile(null);
        setBase64(null);
        setFirstFrame(null);
        setNiche('');
        setSceneCount(1);
        setCurrentStep('initial');
        setAnalysisReport(null);
        setTransformationPlan(null);
        lastProcessedUrl.current = null;
        onReset();
    };

    return (
        <div className="max-w-4xl mx-auto w-full py-8 px-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Clapperboard className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Director Agent</h2>
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">Replicate & Transform Mode</p>
                    </div>
                </div>

                {sceneCount > 1 && (
                    <div className="flex items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
                        <History className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-400">Scene {sceneCount} Sequence</span>
                    </div>
                )}
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto pb-20 scrollbar-hide px-2">
                <div className="bg-[#111111] border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors"></div>

                    {currentStep === 'initial' ? (
                        <div className="space-y-8">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all cursor-pointer"
                            >
                                {file ? (
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-black rounded-2xl overflow-hidden ring-4 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10 relative">
                                            <video src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-50" />
                                            {firstFrame && <img src={`data:image/png;base64,${firstFrame.base64}`} className="absolute inset-0 w-full h-full object-cover" alt="Source frame" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{file.name}</p>
                                            <p className="text-xs text-green-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <CheckCircle2 className="w-3 h-3" /> Visual Baseline Extracted
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-gray-600" />
                                        </div>
                                        <p className="text-gray-400 font-bold text-lg">Load Original Scene</p>
                                    </>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Transformation Universe</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={niche}
                                            onChange={(e) => setNiche(e.target.value)}
                                            placeholder="e.g. LEGO Movie, Cyberpunk, Ghibli..."
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-700"
                                        />
                                        <Wand2 className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Master Format</label>
                                    <div className="flex p-1 bg-[#0a0a0a] border border-gray-800 rounded-2xl h-[66px]">
                                        <button
                                            onClick={() => setAspectRatio(AspectRatio.LANDSCAPE)}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all font-bold text-xs uppercase ${aspectRatio === AspectRatio.LANDSCAPE ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Monitor className="w-4 h-4" /> Cinematic
                                        </button>
                                        <button
                                            onClick={() => setAspectRatio(AspectRatio.PORTRAIT)}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded-xl transition-all font-bold text-xs uppercase ${aspectRatio === AspectRatio.PORTRAIT ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            <Smartphone className="w-4 h-4" /> Social
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={startAnalysis}
                                disabled={!file || !niche}
                                className="w-full py-5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                            >
                                Replicate with AI <Zap className="w-5 h-5 fill-current" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                                <CheckCircle2 className="text-indigo-500 w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xl font-black text-white">Target: {niche} Universe</p>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                                        <Monitor className="w-3 h-3" /> {aspectRatio === AspectRatio.LANDSCAPE ? '16:9' : '9:16'}
                                    </span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Visual Replicator Active
                                    </span>
                                </div>
                            </div>
                            <button onClick={handleReset} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-[10px] text-white uppercase font-black tracking-widest rounded-xl transition-colors">
                                Reset
                            </button>
                        </div>
                    )}
                </div>

                {currentStep !== 'initial' && (
                    <>
                        {analysisReport && (
                            <div className="flex gap-4 animate-in slide-in-from-left-4 duration-500">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 border border-gray-800">
                                    <Cpu className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 flex-1 shadow-lg">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic underline underline-offset-4">Motion Extraction</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{analysisReport}</p>
                                </div>
                            </div>
                        )}

                        {transformationPlan && (
                            <div className="flex gap-4 animate-in slide-in-from-left-4 duration-500">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 border border-gray-800">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 flex-1 shadow-lg border-t-purple-500/10">
                                    <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Replication Strategy</h4>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">{transformationPlan.explanation}</p>
                                    {currentStep === 'proposal' && (
                                        <button
                                            onClick={confirmAndGenerate}
                                            className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/40"
                                        >
                                            Launch Replicator Renders
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {(currentStep === 'rendering' || isProcessing) && (
                            <div className="flex gap-4 animate-in slide-in-from-left-4 duration-500">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 border border-gray-800">
                                    <VideoIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 flex-1 shadow-lg ring-1 ring-emerald-500/10 text-center">
                                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 italic">Veo 3.1 Neural Synth</h4>
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-tighter">Replicating Scene {sceneCount} into {niche} Universe...</p>
                                        <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                                            <div className="h-full bg-emerald-500 animate-pulse duration-1000"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {videoUrl && !isProcessing && (currentStep === 'completed' || currentStep === 'extending') && (
                            <div className="flex gap-4 animate-in slide-in-from-bottom-8 duration-700">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-500 shadow-xl shadow-emerald-900/40">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-[#111111] border border-emerald-500/20 rounded-[2.5rem] p-8 flex-1 shadow-2xl ring-1 ring-emerald-500/10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h4 className="text-2xl font-black text-white mb-1">Replication Master</h4>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Target: {niche} Universe</p>
                                        </div>
                                    </div>

                                    <div className={`w-full bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl mb-8 relative ${aspectRatio === AspectRatio.PORTRAIT ? 'max-w-xs mx-auto aspect-[9/16]' : 'aspect-video'}`}>
                                        <video key={videoUrl} src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                                    </div>

                                    {currentStep === 'completed' && (
                                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                                            <button
                                                onClick={startExtension}
                                                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-indigo-900/20"
                                            >
                                                <Plus className="w-5 h-5" /> Next Scene (Storyboard)
                                            </button>
                                            <a
                                                href={videoUrl}
                                                download={`veo-replicate-${niche}.mp4`}
                                                className="sm:px-8 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                            >
                                                <Download className="w-4 h-4" /> Save Master
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 'extending' && !isProcessing && (
                            <div className="flex gap-4 animate-in slide-in-from-left-4 duration-500">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-500 shadow-lg shadow-indigo-900/20">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 flex-1 shadow-lg ring-2 ring-indigo-500/10">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">Storyboard Extension: Scene {sceneCount + 1}</h4>
                                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                        Visual consistency in {niche} universe is locked. Describe the sequel:
                                    </p>

                                    <div className="space-y-4">
                                        <textarea
                                            value={extensionPrompt}
                                            onChange={(e) => setExtensionPrompt(e.target.value)}
                                            placeholder="The camera pans left to reveal more of the world..."
                                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[140px] transition-all placeholder:text-gray-700 resize-none"
                                        />

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleExtend}
                                                disabled={!extensionPrompt}
                                                className="flex-1 py-5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                            >
                                                Extend Sequence <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentStep('completed')}
                                                className="px-8 py-5 bg-gray-900 text-gray-500 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default AnalyzeCloneView;
