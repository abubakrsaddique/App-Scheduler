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

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistent job store
jobstores = {"default": SQLAlchemyJobStore(url="sqlite:///jobs.sqlite")}
scheduler = BackgroundScheduler(jobstores=jobstores)
scheduler.start()

# Load API credentials from .env
TWITTER_BEARER = os.getenv("TWITTER_BEARER_TOKEN")
FACEBOOK_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")
INSTAGRAM_TOKEN = os.getenv("INSTAGRAM_ACCESS_TOKEN")
LINKEDIN_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")

if not TWITTER_BEARER:
    raise RuntimeError("Missing TWITTER_BEARER_TOKEN in .env")

# App-specific endpoints (for demo)
TWITTER_URL = "https://api.twitter.com/2/tweets"
FACEBOOK_URL = "https://graph.facebook.com/me/feed"
INSTAGRAM_URL = "https://graph.facebook.com/me/media"
LINKEDIN_URL = "https://api.linkedin.com/v2/ugcPosts"

# Pydantic model
class PostTask(BaseModel):
    app: str  # "Twitter", "Facebook", "Instagram", "LinkedIn"
    content: str
    run_at: str  # "YYYY-MM-DD HH:MM:SS"

# Post functions for each app
def post_to_twitter(text: str):
    headers = {"Authorization": f"Bearer {TWITTER_BEARER}", "Content-Type": "application/json"}
    payload = {"text": text}
    r = requests.post(TWITTER_URL, headers=headers, json=payload)
    if r.status_code != 201:
        print(f"❌ Twitter failed: {r.text}")
        return {"error": r.json()}
    print(f"✅ Twitter posted: {r.json()}")
    return r.json()

def post_to_facebook(text: str):
    payload = {"message": text, "access_token": FACEBOOK_TOKEN}
    r = requests.post(FACEBOOK_URL, data=payload)
    if r.status_code != 200:
        print(f"❌ Facebook failed: {r.text}")
        return {"error": r.json()}
    print(f"✅ Facebook posted: {r.json()}")
    return r.json()

def post_to_instagram(text: str):
    payload = {"caption": text, "access_token": INSTAGRAM_TOKEN}
    r = requests.post(INSTAGRAM_URL, data=payload)
    if r.status_code != 200:
        print(f"❌ Instagram failed: {r.text}")
        return {"error": r.json()}
    print(f"✅ Instagram posted: {r.json()}")
    return r.json()

def post_to_linkedin(text: str):
    headers = {"Authorization": f"Bearer {LINKEDIN_TOKEN}", "Content-Type": "application/json"}
    payload = {
        "author": f"urn:li:person:{os.getenv('LINKEDIN_USER_ID')}",
        "lifecycleState": "PUBLISHED",
        "specificContent": {"com.linkedin.ugc.ShareContent": {"shareCommentary": {"text": text}, "shareMediaCategory": "NONE"}},
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }
    r = requests.post(LINKEDIN_URL, headers=headers, json=payload)
    if r.status_code != 201:
        print(f"❌ LinkedIn failed: {r.text}")
        return {"error": r.json()}
    print(f"✅ LinkedIn posted: {r.json()}")
    return r.json()

# Generic post dispatcher
def post_content(app_name: str, content: str):
    app_name = app_name.lower()
    if app_name == "twitter":
        return post_to_twitter(content)
    elif app_name == "facebook":
        return post_to_facebook(content)
    elif app_name == "instagram":
        return post_to_instagram(content)
    elif app_name == "linkedin":
        return post_to_linkedin(content)
    else:
        return {"error": f"Unsupported app: {app_name}"}

# Schedule post endpoint
@app.post("/schedule_post/")
def schedule_post(task: PostTask):
    try:
        run_time = datetime.strptime(task.run_at, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid datetime format. Use YYYY-MM-DD HH:MM:SS")

    scheduler.add_job(
        post_content,
        "date",
        run_date=run_time,
        args=[task.app, task.content],
        id=f"{task.app}-{task.run_at}-{task.content[:10]}",
        replace_existing=True,
    )

    return {"message": f"✅ {task.app} post scheduled!", "app": task.app, "time": task.run_at}

# List scheduled jobs
@app.get("/scheduled_jobs/")
def get_scheduled_jobs():
    jobs = scheduler.get_jobs()
    return [{"id": job.id, "next_run_time": str(job.next_run_time), "func": str(job.func_ref)} for job in jobs]

# Post immediately
@app.post("/post_now/")
def post_now(task: PostTask):
    result = post_content(task.app, task.content)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"message": f"✅ {task.app} posted immediately!", "result": result}
