import React, { useRef, useCallback } from 'react';
import { Upload, Link, Play, FileVideo } from 'lucide-react';

interface VideoInputProps {
  onVideoUpload: (file: File) => void;
  onYoutubeUrl: (url: string) => void;
  videoFile: File | null;
  youtubeUrl: string;
}

const VideoInput: React.FC<VideoInputProps> = ({
  onVideoUpload,
  onYoutubeUrl,
  videoFile,
  youtubeUrl
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoUpload(file);
    }
  }, [onVideoUpload]);

  const handleUrlSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const url = urlInputRef.current?.value.trim();
    if (url) {
      onYoutubeUrl(url);
    }
  }, [onYoutubeUrl]);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Transform Videos into PDFs
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a video file or paste a YouTube URL to extract unique frames and create a professional PDF presentation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* YouTube URL Input */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl">
              <Play className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">YouTube URL</h3>
          </div>
          
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={urlInputRef}
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-12"
                defaultValue={youtubeUrl}
              />
              <Link className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Process YouTube Video
            </button>
          </form>
          
          {youtubeUrl && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">✓ YouTube URL ready for processing</p>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl">
              <FileVideo className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Upload Video</h3>
          </div>
          
          <div
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {videoFile ? videoFile.name : 'Click to upload a video file'}
            </p>
            <p className="text-sm text-gray-500">
              Supports MP4, MOV, AVI, and other common formats
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {videoFile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✓ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoInput;