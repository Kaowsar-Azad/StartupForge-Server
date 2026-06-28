# StartupForge - Server

This repository contains the backend API for the StartupForge platform. It is built with Node.js, Express, and MongoDB.

## Overview

The backend handles user authentication, data storage, and payment processing. It exposes REST API endpoints for the client application to consume. It uses Mongoose for database modeling and Better Auth for session management.

## Features

- REST API built with Express.js
- MongoDB database integration using Mongoose
- Authentication and session management via Better Auth
- Stripe checkout session generation and processing
- Search functionality using regex and filtering
- Role-based route protection middleware (Admin, Founder, Collaborator)
- Server-side pagination for data endpoints

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Better Auth
- Stripe
- dotenv
- cors

## Prerequisites

- Node.js installed
- MongoDB connection string

## Setup Instructions

1. Clone the repository and navigate into the directory:
   ```bash
   cd StartupForge-Server
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   BETTER_AUTH_SECRET=your_secret
   BETTER_AUTH_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   STRIPE_SECRET_KEY=your_stripe_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:5000`.
