# Oh My Fitness - React Native Expo App

A fitness app built with React Native, Expo Router, and Firebase Authentication.

## 🚀 Features

- **Onboarding Survey**: Comprehensive 4-step survey to collect user preferences
- **Firebase Authentication**: Secure user registration and login
- **Personalized Plans**: AI-generated workout and nutrition plans
- **Tab Navigation**: Clean navigation with Today, Program, Progress, and Profile tabs
- **Beautiful UI**: Modern design with smooth animations and micro-interactions
- **Cross-Platform**: Works on iOS, Android, and Web

## 🛠 Tech Stack

- **React Native** with Expo SDK 52
- **Expo Router** for navigation
- **Firebase Authentication** for user management
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **AsyncStorage** for local data persistence

## 📱 App Structure

### Authentication Flow
1. **Welcome Screen** - Onboarding screen
2. **Survey Flow** - 4-step questionnaire collecting:
   - Fitness goals and body metrics
   - Workout schedule and equipment
   - Dietary preferences and restrictions
   - Workout type preferences
3. **Registration** - Firebase-powered account creation
4. **Plan Generation** - AI-powered personalized plan creation

### Main App (Post-Authentication)
- **Today Tab** - Daily workout and nutrition plan
- **Program Tab** - Weekly schedule view
- **Progress Tab** - Workout tracking and weight progress
- **Profile Tab** - User settings and account management

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- Expo CLI

### Installation

1. **Clone and install dependencies**
```bash
npm install
```
2. **Start development server**
```bash
npm run dev
```

## 🏗 Architecture

### Context Providers
- **AuthContext**: Manages user authentication state and Firebase integration
- **SurveyContext**: Handles survey data collection and state management

### Key Components
- **Survey Components**: Modular survey steps with validation
- **Reusable UI**: Button, Input, SelectionButton, CheckboxItem components
- **Navigation**: Tab-based layout with stack navigation within tabs

### Platform Compatibility
- **Native Platforms**: Full Firebase Auth integration
- **Web Platform**: Graceful fallback with mock authentication
- **Cross-Platform**: Consistent UI/UX across all platforms

## 🎨 Design System

### Theme
- Consistent color palette with primary, secondary, and accent colors
- Standardized spacing system (8px grid)
- Typography scale with proper font weights
- Border radius and shadow system

### Animations
- React Native Reanimated for smooth transitions
- Micro-interactions on buttons and form elements
- Loading states and progress indicators

## 🔐 Authentication

### Firebase Integration
- Email/password authentication
- Automatic token management
- Session persistence with AsyncStorage
- Comprehensive error handling

### Security Features
- Input validation on all forms
- Secure token storage
- Automatic session restoration
- Proper logout handling

## 📊 API Integration

### Plan Generation
- RESTful API endpoint for personalized plan creation
- Survey data processing
- User preference analysis
- Structured plan response

### Error Handling
- Network error management
- User-friendly error messages
- Retry mechanisms
- Offline state handling

## 📝 Development Notes

### Code Organization
- Modular component structure
- Separation of concerns
- TypeScript for type safety
- Clean file organization

### Best Practices
- React Native performance optimization
- Proper state management
- Error boundary implementation
- Accessibility considerations