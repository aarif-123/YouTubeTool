import cv2
import imagehash
from PIL import Image
import numpy as np
import yt_dlp
import os
from typing import List, Dict

def get_temp_video(url: str) -> str:
    """
    Downloads a YouTube video and returns the local file path.
    """
    ydl_opts = {
        'format': 'best[ext=mp4]',
        'outtmpl': 'temp_streamed_video.%(ext)s',
        'quiet': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return ydl.prepare_filename(info)

def extract_unique_frames(
    video_path: str,
    output_folder: str = "frames",
    interval_sec: float = 0.15,
    hash_threshold: int = 5
) -> List[Dict]:
    """
    Extracts unique frames from a video file at a given interval and saves them as images.
    Returns a list of dicts with filename and timestamp.
    """
    os.makedirs(output_folder, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = int(fps * interval_sec) if fps else 1
    count, saved = 0, 0
    hashes = []
    saved_files = []
    timestamps = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % interval == 0:
            img_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            img_hash = imagehash.phash(img_pil)
            if all(img_hash - h > hash_threshold for h in hashes):
                hashes.append(img_hash)
                img_path = os.path.join(output_folder, f"frame_{saved}.jpg")
                img_pil.save(img_path)
                saved_files.append(img_path)
                # Get timestamp in seconds
                timestamps.append(cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0)
                saved += 1
        count += 1

    cap.release()
    if os.path.exists(video_path):
        os.remove(video_path)
    # Return list of dicts with filename and timestamp
    return [
        {"filename": os.path.basename(path), "timestamp": ts}
        for path, ts in zip(saved_files, timestamps)
    ]
