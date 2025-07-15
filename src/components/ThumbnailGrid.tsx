import React from 'react';
import { CheckSquare, Square, BoxSelect as SelectAll, Trash2 } from 'lucide-react';
import { Frame } from '../types';

interface ThumbnailGridProps {
  frames: Frame[];
  selectedFrames: Set<string>;
  onFrameSelect: (frameId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const ThumbnailGrid: React.FC<ThumbnailGridProps> = ({
  frames,
  selectedFrames,
  onFrameSelect,
  onSelectAll,
  onDeselectAll
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl">
              <CheckSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Select Frames</h3>
              <p className="text-sm text-gray-600">
                {frames.length} unique frames extracted • {selectedFrames.size} selected
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onSelectAll}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <SelectAll className="w-4 h-4" />
              <span>Select All</span>
            </button>
            <button
              onClick={onDeselectAll}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {frames.map((frame) => {
            const isSelected = selectedFrames.has(frame.id);
            
            return (
              <div
                key={frame.id}
                className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                }`}
                onClick={() => onFrameSelect(frame.id, !isSelected)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={frame.dataUrl}
                    alt={`Frame at ${formatTime(frame.timestamp)}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  {/* Selection Overlay */}
                  <div className={`absolute inset-0 bg-indigo-600/20 flex items-center justify-center transition-opacity ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      {isSelected ? (
                        <CheckSquare className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">
                      {formatTime(frame.timestamp)}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-indigo-500' : 'bg-gray-300'
                    }`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {frames.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No frames extracted yet. Upload a video to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailGrid;