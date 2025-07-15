import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { Frame } from '../types';

interface PDFGeneratorProps {
  frames: Frame[];
  videoTitle: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ frames, videoTitle }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePDF = async () => {
    if (frames.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      const maxImageHeight = pageHeight - (margin * 3) - 20; // Space for timestamp

      // Title page
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Video Frame Export', pageWidth / 2, 50, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(videoTitle, pageWidth / 2, 70, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 90, { align: 'center' });
      pdf.text(`${frames.length} frames selected`, pageWidth / 2, 105, { align: 'center' });

      // Process each frame
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        setGenerationProgress(((i + 1) / frames.length) * 100);

        // Add new page for each frame (except the first one after title)
        pdf.addPage();

        // Add frame image
        const img = new Image();
        img.src = frame.dataUrl;
        
        await new Promise((resolve) => {
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            let imageWidth = contentWidth;
            let imageHeight = imageWidth / aspectRatio;
            
            // Scale down if image is too tall
            if (imageHeight > maxImageHeight) {
              imageHeight = maxImageHeight;
              imageWidth = imageHeight * aspectRatio;
            }
            
            const x = (pageWidth - imageWidth) / 2;
            const y = margin;
            
            pdf.addImage(frame.dataUrl, 'JPEG', x, y, imageWidth, imageHeight);
            
            // Add timestamp
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(
              `Frame ${i + 1} of ${frames.length} • Timestamp: ${formatTime(frame.timestamp)}`,
              pageWidth / 2,
              y + imageHeight + 15,
              { align: 'center' }
            );
            
            resolve(null);
          };
        });
      }

      // Save the PDF
      const filename = `${videoTitle.replace(/\.[^/.]+$/, '')}_frames.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const previewFrames = frames.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-xl">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Generate PDF</h3>
            <p className="text-sm text-gray-600">
              {frames.length} frame{frames.length !== 1 ? 's' : ''} ready for export
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview (First 3 frames)</h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {previewFrames.map((frame, index) => (
              <div key={frame.id} className="flex-shrink-0">
                <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={frame.dataUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {formatTime(frame.timestamp)}
                </p>
              </div>
            ))}
            {frames.length > 3 && (
              <div className="flex-shrink-0 w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-xs text-gray-500 text-center">
                  +{frames.length - 3} more<br />frames
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              <span className="text-gray-700 font-medium">
                Generating PDF... {Math.round(generationProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generatePDF}
          disabled={isGenerating || frames.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 px-6 rounded-xl font-medium hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Generate & Download PDF</span>
            </>
          )}
        </button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Each frame will be placed on a separate page with timestamp information
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;