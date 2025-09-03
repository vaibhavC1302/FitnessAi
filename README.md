App Screens : -

![WhatsApp Image 2025-09-03 at 11 37 08 (2)](https://github.com/user-attachments/assets/3cec61e7-bc80-4712-a443-51dc6f2a7a30)
![WhatsApp Image 2025-09-03 at 11 37 09](https://github.com/user-attachments/assets/5021b8fa-1e8a-45b3-a9a3-d7479a3efeb9)
![WhatsApp Image 2025-09-03 at 11 37 09 (1)](https://github.com/user-attachments/assets/fed5cee8-394b-4a63-984d-d636f38ba847)
![WhatsApp Image 2025-09-03 at 11 37 09 (2)](https://github.com/user-attachments/assets/4e6d7bca-f7d5-4f5d-b346-ac9371aa91dc)
![WhatsApp Image 2025-09-03 at 11 37 09 (3)](https://github.com/user-attachments/assets/a7cdfbce-ed15-4ace-8fe7-258de7495752)
![WhatsApp Image 2025-09-03 at 11 37 10](https://github.com/user-attachments/assets/318b2c5f-d823-416c-a450-0a6b5dfad28c)
![WhatsApp Image 2025-09-03 at 11 37 07](https://github.com/user-attachments/assets/f7c20bd4-9ae1-4095-b0ce-b63b61c9d3df)
![WhatsApp Image 2025-09-03 at 11 37 08](https://github.com/user-attachments/assets/f5a03fe1-d3b0-4756-a37b-4e607ea0e2ca)
![WhatsApp Image 2025-09-03 at 11 37 08 (1)](https://github.com/user-attachments/assets/05788aea-73e6-487c-8ba1-b9939da71bda)


A sophisticated fitness tracking application with real-time AI coaching, built with React Native Expo and powered by modern backend services.

✨ Features
🏋️‍♂️ Workout Tracking: Log sets, reps, and weights for all your exercises

🤖 AI Coaching: Real-time workout advice powered by Grok AI

📊 Progress History: Track your performance over time with detailed analytics

🎥 Exercise Guides: YouTube video integration for proper form guidance

👤 Secure Authentication: Clerk integration for seamless user management

🌐 Real-time Updates: Sanity CMS backend for instant data synchronization

⚡ Admin Dashboard: Add new exercises remotely via Sanity Studio

📱 Cross-Platform: Works on both iOS and Android devices

🏗️ Architecture
FitTrack leverages a modern serverless architecture with best-in-class services:

Frontend (React Native Expo)
Framework: React Native with Expo

State Management: Zustand for efficient global state

Authentication: Clerk for secure user management

API Calls: Expo APIs for backend communication

Backend Services
Content Management: Sanity CMS for exercise data and workout history

AI Integration: Grok AI for personalized coaching

Media Hosting: YouTube integration for exercise guides

Real-time Updates: Sanity's real-time CDN for instant data sync

🚀 Tech Stack
Frontend
React Native with Expo

Zustand (State Management)

Clerk (Authentication)

Expo APIs (Networking)

Backend & Services
Sanity CMS (Content Management & Database)

Grok AI (Artificial Intelligence Coaching)

YouTube Data API (Exercise Videos)

🔧 Installation & Setup
Prerequisites
Node.js (v18 or higher)

npm or yarn

Expo CLI

Sanity CLI (npm install -g @sanity/cli)

Clerk account

Grok AI API access

Frontend Setup
Clone the repository

bash
git clone https://github.com/YourUsername/FitTrack-App.git
cd fitnessApp
Install dependencies

bash
npm install
# or
yarn install
Environment Configuration
Create a .env.locale file in the root directory:

envEXPO_PUBLIC_CLERK_PUBLISHABLE_KEY= "

GROQ_API_KEY = ""

SANITY_API_TOKEN = ""

Start the development server

bash
expo start
Sanity Backend Setup
Navigate to the sanity directory

bash
cd sanity
Install Sanity dependencies

bash
npm install
Deploy Sanity Studio

bash
npm run sanity.

🤖 AI Coaching Integration
The app integrates with Grok AI to provide real-time coaching:

🎯 Workflow
User Authentication: Sign up/login via Clerk

Exercise Selection: Browse available exercises from Sanity CMS

Workout Tracking: Log sets, reps, and weights during workout

AI Coaching: Get real-time advice from Grok AI

Progress Review: View historical data and trends

Admin Management: Add new exercises via Sanity Studio dashboard

👨‍💼 Admin Features
Administrators can manage the exercise database through Sanity Studio:

Add new exercises with detailed descriptions

Categorize exercises by muscle group and equipment

Add YouTube tutorial links for proper form

Set difficulty levels for each exercise

Manage exercise library from anywhere with internet access


👨‍💻 Author
Vaibhav


🙏 Acknowledgments
Clerk for authentication

Sanity for content management

Grok AI for AI coaching capabilities

Expo for the development framework

YouTube for exercise video content

⭐️ Star this repo if you found it helpful!

e
