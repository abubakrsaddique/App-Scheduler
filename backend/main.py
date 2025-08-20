from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# ✅ Enable CORS for frontend (Next.js running on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # adjust when deploying
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Use persistent job store (SQLite file)
jobstores = {"default": SQLAlchemyJobStore(url="sqlite:///jobs.sqlite")}
scheduler = BackgroundScheduler(jobstores=jobstores)
scheduler.start()

# ✅ Twitter API v2 Bearer Token (Free plan)
BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
if not BEARER_TOKEN:
    raise RuntimeError("❌ Missing TWITTER_BEARER_TOKEN in .env")

TWEET_URL = "https://api.twitter.com/2/tweets"

# ✅ Pydantic model
class TweetTask(BaseModel):
    text: str
    run_at: str  # format: "2025-08-20 18:30:00"

# ✅ Function to post tweet using Twitter API v2
def post_tweet(text: str):
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {"text": text}
    response = requests.post(TWEET_URL, headers=headers, json=payload)

    if response.status_code != 201:
        print(f"❌ Failed to post tweet: {response.text}")
        return {"error": response.json()}

    data = response.json()
    print(f"✅ Tweet posted: {data}")
    return data

# ✅ API: schedule a tweet
@app.post("/schedule_tweet/")
def schedule_tweet(task: TweetTask):
    try:
        run_time = datetime.strptime(task.run_at, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use YYYY-MM-DD HH:MM:SS")

    scheduler.add_job(
        post_tweet,
        "date",
        run_date=run_time,
        args=[task.text],
        id=f"tweet-{task.run_at}-{task.text[:10]}",
        replace_existing=True,
    )

    return {"message": "✅ Tweet scheduled!", "tweet": task.text, "time": task.run_at}

# ✅ API: list scheduled jobs
@app.get("/scheduled_jobs/")
def get_scheduled_jobs():
    jobs = scheduler.get_jobs()
    return [
        {"id": job.id, "next_run_time": str(job.next_run_time), "func": str(job.func_ref)}
        for job in jobs
    ]

# ✅ API: post tweet immediately
@app.post("/tweet_now/")
def tweet_now(task: TweetTask):
    result = post_tweet(task.text)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": "✅ Tweet posted immediately!", "tweet": result}
