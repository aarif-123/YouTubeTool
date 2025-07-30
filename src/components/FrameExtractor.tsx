import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Zap, Image, Filter } from 'lucide-react';
import { Frame } from '../types';
import ThumbnailGrid from './ThumbnailGrid';
import PDFGenerator from './PDFGenerator';

interface FrameExtractorProps {
  videoFile: File | null;
  youtubeUrl: string;
  onFramesExtracted: (frames: Frame[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processingStage: string;
  setProcessingStage: (stage: string) => void;
}

const FrameExtractor: React.FC<FrameExtractorProps> = ({
  videoFile,
  youtubeUrl,
  onFramesExtracted,
  isProcessing,
  setIsProcessing,
  processingStage,
  setProcessingStage
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFrames, setSelectedFrames] = useState<Set<string>>(new Set());

  const calculateSimilarity = (imageData1: ImageData, imageData2: ImageData): number => {
    const data1 = imageData1.data;
    const data2 = imageData2.data;
    let diff = 0;
    
    for (let i = 0; i < data1.length; i += 4) {
      const rDiff = data1[i] - data2[i];
      const gDiff = data1[i + 1] - data2[i + 1];
      const bDiff = data1[i + 2] - data2[i + 2];
      diff += Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
    }
    
    return diff / (data1.length / 4);
  };

  const extractFrames = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsProcessing(true);
    setProcessingStage('Analyzing video...');

    const frames: Frame[] = [];
    const frameInterval = Math.max(1, Math.floor(video.duration / 50)); // Extract up to 50 frames
    let previousImageData: ImageData | null = null;
    const similarityThreshold = 15; // Adjust for duplicate detection sensitivity

    canvas.width = 640;
    canvas.height = 360;

    for (let time = 0; time < video.duration; time += frameInterval) {
      video.currentTime = time;
      
      await new Promise(resolve => {
        video.onseeked = resolve;
      });

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Check for duplicate frames
      let isDuplicate = false;
      if (previousImageData) {
        const similarity = calculateSimilarity(imageData, previousImageData);
        if (similarity < similarityThreshold) {
          isDuplicate = true;
        }
      }

      if (!isDuplicate) {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        frames.push({
          id: `frame-${frames.length}`,
          dataUrl,
          timestamp: time
        });
        previousImageData = imageData;
      }

      setProgress((time / video.duration) * 100);
      setProcessingStage(`Extracting frames... ${Math.floor((time / video.duration) * 100)}%`);
    }

    setProcessingStage('Finalizing frames...');
    onFramesExtracted(frames);
  };

  // --- YouTube Frame Extraction ---
  const handleProcessYouTube = async () => {
    setLoading(true);
    setError("");
    setFrames([]);
    setSelectedFrames(new Set());
    const formData = new FormData();
    formData.append("youtube_url", youtubeUrl);
    formData.append("interval_sec", "0.15"); // Changed to 0.15 for accurate timestamps
    formData.append("hash_threshold", "2");

    try {
      const response = await fetch("https://backend-yt-tew2.onrender.com/extract-frames/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to extract frames.");
      const data = await response.json();
      // Convert backend URLs to Frame objects
      const ytFrames: Frame[] = data.frames.map((item: { url: string, timestamp: number }, idx: number) => ({
        id: `yt-frame-${idx}`,
        dataUrl: `https://backend-yt-tew2.onrender.com${item.url}`,
        timestamp: item.timestamp
      }));
      setFrames(ytFrames);
      setSelectedFrames(new Set());
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Selection logic for ThumbnailGrid
  const handleFrameSelect = (frameId: string, selected: boolean) => {
    setSelectedFrames(prev => {
      const next = new Set(prev);
      if (selected) next.add(frameId);
      else next.delete(frameId);
      return next;
    });
  };
  const handleSelectAll = () => setSelectedFrames(new Set(frames.map(f => f.id)));
  const handleDeselectAll = () => setSelectedFrames(new Set());

  // PDF generation for selected frames
  const selectedFrameObjs = frames.filter(f => selectedFrames.has(f.id));

  useEffect(() => {
    if (videoFile && videoRef.current) {
      const video = videoRef.current;
      video.src = URL.createObjectURL(videoFile);
      video.onloadedmetadata = () => {
        extractFrames();
      };
    }
  }, [videoFile]);

  useEffect(() => {
    if (youtubeUrl) {
      setProcessingStage('YouTube processing coming soon...');
      // YouTube processing would be implemented here
      // For now, show a placeholder message
    }
  }, [youtubeUrl]);

  useEffect(() => {
    setFrames([]);
    setSelectedFrames(new Set());
  }, []);

  if (!videoFile && !youtubeUrl) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Frame Extraction</h3>
        </div>

        {isProcessing && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
              <span className="text-gray-700 font-medium">{processingStage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Image className="w-4 h-4" />
                <span>Capturing</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Filtering</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Zap className="w-4 h-4" />
                <span>Processing</span>
              </div>
            </div>
          </div>
        )}

        {youtubeUrl && !isProcessing && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                <p className="text-gray-600 mt-4 text-sm">Processing YouTube video...</p>
              </div>
            ) : (
              <>
                <button onClick={handleProcessYouTube} disabled={loading} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Processing..." : "Process YouTube Video"}
                </button>
                <ThumbnailGrid
                  frames={frames}
                  selectedFrames={selectedFrames}
                  onFrameSelect={handleFrameSelect}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
                <PDFGenerator
                  frames={selectedFrameObjs}
                  videoTitle={youtubeUrl}
                />
                {error && <div style={{ color: "red" }}>{error}</div>}
              </>
            )}
          </div>
        )}

        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default FrameExtractor;
