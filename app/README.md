# Mindful Journal App

A React Native journaling application that uses AI to analyze your mood and emotions from your journal entries.

## Features

- 🔐 Secure authentication with Python Fast API
- 📝 Create, read, update, and delete journal entries
- 🧠 AI-powered mood analysis using OpenAI GPT
- 🎨 Beautiful and intuitive UI with React Native Paper
- 📊 Filter and sort entries by mood and date

## Demo

Watch the app in action:

  <video width="360" height="720" controls>
    <source src="Simulator.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
EXPO_PUBLIC_API_ENDPOINT=your_backend_url
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on iOS or Android:

```bash
npm run ios
# or
npm run android
```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Screen components
  ├── services/       # API and service functions
  ├── store/          # State management
  ├── types/          # TypeScript type definitions
  ├── navigation/     # Navigation configuration
  └── config/         # Configuration files
```

## Technologies Used

- React Native
- Expo
- React Navigation
- React Native Paper
- Zustand (State Management)
- TypeScript

## Future Enhancements

### AI & Analytics
- 📈 **Mood Trends Analysis**: Weekly/monthly mood patterns and insights
- 🎯 **Personalized Recommendations**: AI-suggested coping strategies based on mood patterns
- 🔍 **Sentiment Deep Dive**: More detailed emotion categorization (anxiety, gratitude, stress levels)
- 📊 **Analytics Dashboard**: Visual charts showing emotional journey over time
- 🧘 **Mindfulness Suggestions**: AI-recommended meditation or breathing exercises

### Technical Improvements
- ⚡ **Offline Mode**: Full functionality without internet connection
- 🔒 **End-to-End Encryption**: Enhanced security for sensitive data
- 🚀 **Performance Optimization**: Faster load times and smoother animations
- 🎯 **Smart Search**: Advanced filtering and search capabilities
- 📱 **Widget Support**: Home screen widgets for quick mood check-ins
