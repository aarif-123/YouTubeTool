# from fastapi import FastAPI, Form
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from youtube_tool import get_temp_video, extract_unique_frames
# import os
# import uvicorn

# app = FastAPI()

# # CORS for development - change in production
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/extract-frames/")
# async def extract_frames(youtube_url: str = Form(...)):
#     video_path = get_temp_video(youtube_url)
#     saved_files = extract_unique_frames(video_path, output_folder="frames", interval_sec=0.15)
#     return {"frames": [
#         {"url": f"/frames/{item['filename']}", "timestamp": item["timestamp"]}
#         for item in saved_files
#     ]}

# # Serve the saved images
# app.mount("/frames", StaticFiles(directory="frames"), name="frames")

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from youtube_tool import get_temp_video, extract_unique_frames
import os

app = FastAPI()

# Ensure 'frames' folder exists
os.makedirs("frames", exist_ok=True)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "FastAPI is running on Render!"}

@app.post("/extract-frames/")
async def extract_frames(youtube_url: str = Form(...)):
    video_path = get_temp_video(youtube_url)
    saved_files = extract_unique_frames(video_path, output_folder="frames", interval_sec=0.15)
    return {
        "frames": [
            {"url": f"/frames/{item['filename']}", "timestamp": item["timestamp"]}
            for item in saved_files
        ]
    }

# Serve static files
app.mount("/frames", StaticFiles(directory="frames"), name="frames")
