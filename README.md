# Multi-Platform Social Media Scheduler

## Overview

This project allows you to schedule and post content to multiple social media platforms, including Twitter, Facebook, Instagram, and LinkedIn, using a FastAPI backend and a Next.js + Tailwind CSS frontend.

## Features

- Schedule posts for future publishing on multiple platforms.
- Post immediately to any supported platform.
- View all scheduled posts.
- Persistent job scheduling using SQLite and APScheduler.
- Fully responsive and clean frontend interface.
- Easy integration with Twitter, Facebook, Instagram and LinkedIn.
- CORS enabled for local development with Next.js.

## Installation

##### env file

```shell
# Twitter
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN

# Facebook
FACEBOOK_ACCESS_TOKEN=YOUR_FACEBOOK_ACCESS_TOKEN

# Instagram
INSTAGRAM_ACCESS_TOKEN=YOUR_INSTAGRAM_ACCESS_TOKEN

# LinkedIn
LINKEDIN_ACCESS_TOKEN=YOUR_LINKEDIN_ACCESS_TOKEN
LINKEDIN_USER_ID=YOUR_LINKEDIN_USER_ID

```

1. Clone the repository:

   ```shell
   git clone https://github.com/abubakrsaddique/App-Scheduler

   ```

2. Navigate to the project directory:

   ```shell
    cd frontend
    cd backend

   ```

3. Install the dependencies:

   ```shell
    npm install

   ```

4. Start the development server:

   ```shell
   npm run dev

   ```

5. Start the Backend server:

   ```shell
   python -m venv venv
    # Windows
   venv\Scripts\activate
     # macOS/Linux
   source venv/bin/activate
   ```

   ## Author

- [@abubakrsaddique](https://github.com/abubakrsaddique)
