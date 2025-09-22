# SIH25092 - Calmly: Development of a Digital Mental Health and Psychological Support System for Students in Higher Education

## Tasks Accomplished

- [x] **Full User & Institution Authentication:** Implemented a secure, role-based login system using NextAuth.js.
- [x] **Student & Institution Onboarding:** Created dedicated, multi-step forms for both user types to collect necessary information.
- [x] **Student Dashboard:** Developed a personalized dashboard with tabs for an overview, AI chat, and account settings.
- [x] **Confidential Self-Assessments:** Integrated clinically validated PHQ-9 & GAD-7 tests with scoring, interpretation, and secure data storage.
- [x] **AI-Powered Chatbot:** Built a conversational AI using the Google Gemini API with conversational memory and crisis detection.
- [x] **Institution Admin Dashboard:** Created a comprehensive portal for admins to manage therapists, view anonymized student analytics with charts, and oversee registered students while respecting privacy.
- [x] **End-to-End Deployment:** Successfully deployed the full-stack application to Vercel, connected to a Supabase production database.

## Technology Stack

This project leverages the following technologies:

- **Next.js & React:** For a modern, performant, and scalable full-stack web application with server-side rendering and client-side interactivity.
- **Supabase (PostgreSQL):** As our robust, scalable, and secure backend database for storing all user and institution data.
- **Prisma:** As a next-generation ORM that enables type-safe database access and simplifies data modeling.
- **NextAuth.js (Auth.js):** To handle secure, role-based user authentication with OAuth providers like Google.
- **Tailwind CSS:** For a utility-first CSS framework that allows for rapid and consistent UI development.
- **Google Gemini API:** To power our intelligent, context-aware AI chatbot for 24/7 student support.
- **Recharts:** As a simple yet powerful charting library for visualizing complex analytics data on the admin dashboard.
- **Vercel:** For seamless, continuous deployment and hosting of the Next.js application.

## Key Features

- **Role-Based Dashboards:** Separate, tailored experiences for Students and Institution Admins.
- **Anonymized Analytics:** Institutions can view student well-being trends without compromising individual privacy.
- **AI Crisis Detection:** The chatbot is trained to recognize crisis keywords and provide immediate emergency resources.
- **Dynamic Onboarding:** A streamlined process that links students to their specific, registered institution.
- **Interactive Data Visualization:** Admins can easily understand student mental health trends through dynamic charts and graphs.

## Local Setup Instructions (Windows & macOS)

Follow these steps to run the project locally.

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
    cd YOUR_REPO
    ```

2.  **Install Dependencies**
    We use `pnpm` as the package manager.
    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables**
    Create a file named `.env.local` in the project root and add your credentials. You will need keys from Supabase, Google Cloud Console, and the Gemini API.
    ```env
    DATABASE_URL="postgresql://..."
    GOOGLE_CLIENT_ID="..."
    GOOGLE_CLIENT_SECRET="..."
    NEXTAUTH_SECRET="..."
    NEXTAUTH_URL="http://localhost:3000"
    NEXT_PUBLIC_GEMINI_API_KEY="..."
    ```

4.  **Apply Database Schema**
    This command will sync your Prisma schema with your Supabase database.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the Development Server**
    ```bash
    pnpm dev
    ```
    The application will now be running at `http://localhost:3000`.

---

## **Future Improvements**

1.  **Activate the Therapist Booking System:** This is the most critical missing feature. Implement the admin interface for therapists to set their availability and the student-facing calendar to view and book these confidential appointments. This completes the core loop of the platform from assessment to intervention.

2.  **Evolve the AI into a Proactive Wellness Copilot:** Enhance the AI to learn from a student's chat history and assessment scores over time. This allows it to provide personalized, proactive check-ins and generate a **private wellness risk score**, enabling early detection and nudging students to seek help before a crisis.

3.  **Launch the Anonymous Peer Support Forum:** Create a secure, moderated space where students, identified only by their anonymous usernames, can create posts and support each other. This directly addresses the problem of stigma and builds a community, which is essential for long-term user engagement and support.
