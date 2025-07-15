import React, { useState, useCallback } from 'react';
import VideoInput from './components/VideoInput';
import FrameExtractor from './components/FrameExtractor';
import ThumbnailGrid from './components/ThumbnailGrid';
import PDFGenerator from './components/PDFGenerator';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { Frame } from './types';

function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  const handleVideoUpload = useCallback((file: File) => {
    setVideoFile(file);
    setFrames([]);
    setSelectedFrames(new Set());
  }, []);

  const handleYoutubeUrl = useCallback((url: string) => {
    setYoutubeUrl(url);
    setFrames([]);
    setSelectedFrames(new Set());
  }, []);

  const handleFramesExtracted = useCallback((extractedFrames: Frame[]) => {
    setFrames(extractedFrames);
    setIsProcessing(false);
  }, []);

  const handleFrameSelect = useCallback((frameId: string, selected: boolean) => {
    setSelectedFrames(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(frameId);
      } else {
        newSet.delete(frameId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedFrames(new Set(frames.map(frame => frame.id)));
  }, [frames]);

  const handleDeselectAll = useCallback(() => {
    setSelectedFrames(new Set());
  }, []);

  const selectedFramesList = frames.filter(frame => selectedFrames.has(frame.id));

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Header />
        {/* About Section */}
        <section className="max-w-2xl mx-auto mt-6 mb-8 p-6 bg-white/80 rounded-2xl shadow text-center border border-gray-200/60">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">About YT Snap-to-PDF</h2>
          <p className="text-gray-700 mb-2">
            <b>Convert YouTube or uploaded videos into beautiful PDFs!</b>
          </p>
          <ol className="text-left list-decimal list-inside text-gray-600 mx-auto max-w-md">
            <li>Paste a YouTube URL or upload a video file.</li>
            <li>Extract unique frames with smart selection.</li>
            <li>Select the frames you want.</li>
            <li>Download your custom PDF presentation.</li>
          </ol>
        </section>
        <main className="container mx-auto px-4 py-8 space-y-8">
          <VideoInput 
            onVideoUpload={handleVideoUpload}
            onYoutubeUrl={handleYoutubeUrl}
            videoFile={videoFile}
            youtubeUrl={youtubeUrl}
          />

          {(videoFile || youtubeUrl) && (
            <FrameExtractor
              videoFile={videoFile}
              youtubeUrl={youtubeUrl}
              onFramesExtracted={handleFramesExtracted}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              processingStage={processingStage}
              setProcessingStage={setProcessingStage}
            />
          )}

          {frames.length > 0 && (
            <ThumbnailGrid
              frames={frames}
              selectedFrames={selectedFrames}
              onFrameSelect={handleFrameSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          )}

          {selectedFrames.size > 0 && (
            <PDFGenerator 
              frames={selectedFramesList}
              videoTitle={videoFile?.name || 'YouTube Video'}
            />
          )}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;