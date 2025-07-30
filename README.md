# YT Snap-to-PDF https://youtubetool-frontend.onrender.com/

Convert YouTube videos or local video files into beautiful PDFs with smart frame extraction.

![YT Snap-to-PDF](https://img.shields.io/badge/YT%20Snap--to--PDF-v0.0.0-blue)

## 🚀 Features

- **YouTube Integration**: Extract frames directly from YouTube videos
- **Local Video Support**: Upload your own video files
- **Smart Frame Extraction**: Intelligent algorithm to extract only unique and meaningful frames
- **Custom Selection**: Choose which frames to include in your PDF
- **Beautiful PDFs**: Generate professional-looking PDFs with timestamps

## 📋 Overview

YT Snap-to-PDF is a web application that allows you to convert YouTube videos or uploaded video files into PDF documents. The application extracts unique frames from videos using a smart selection algorithm, lets you choose which frames to include, and generates a professional PDF presentation.

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite as the build tool
- jsPDF for PDF generation

### Backend
- FastAPI (Python)
- OpenCV for video processing
- yt-dlp for YouTube video downloading
- Pillow and imagehash for image processing

## 🔧 Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Frontend Setup

```bash
# Clone the repository
git clone git@github.com:aarif-123/YouTubeTool.git
cd yt-snap-to-pdf

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

## 🚀 Usage

1. **Input**: Paste a YouTube URL or upload a video file
2. **Extract**: Click the "Extract Frames" button to process the video
3. **Select**: Choose which frames you want to include in your PDF
4. **Generate**: Click "Generate & Download PDF" to create and download your PDF

## 🧠 How It Works

The application uses a perceptual hashing algorithm to identify and extract only unique frames from the video, avoiding duplicates and similar frames. This ensures that your PDF contains only meaningful content without redundancy.

The backend processes the video and extracts frames at specified intervals, comparing each new frame with previously saved ones to ensure uniqueness. The frontend allows you to select which frames to include in your final PDF.

## 🔒 Authentication

The application includes authentication features powered by Supabase, allowing users to:
- Create accounts
- Save their projects
- Access their history

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube video downloading
- [OpenCV](https://opencv.org/) for video processing
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API
