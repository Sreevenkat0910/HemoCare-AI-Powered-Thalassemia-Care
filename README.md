# Hemocare Healthcare Platform

A modern React-based healthcare platform built with TypeScript, Tailwind CSS, and Vite.

## Features

- **Patient Onboarding**: Streamlined patient registration and onboarding process
- **Symptom Logging**: Easy-to-use interface for patients to log their symptoms
- **Patient Dashboard**: Comprehensive dashboard for patients to view their health data
- **Doctor Dashboard**: Professional interface for healthcare providers
- **AI Predictions**: AI-powered health insights and predictions
- **Digital Twin**: Advanced digital representation of patient health
- **Accessibility Features**: Dark mode, large font support, and multi-language support
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and building
- **UI Components**: Custom component library with shadcn/ui patterns
- **Icons**: Lucide React for consistent iconography

## Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open automatically in your browser at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── HomePage.tsx    # Landing page
│   ├── PatientOnboarding.tsx
│   ├── SymptomLogging.tsx
│   ├── PatientDashboard.tsx
│   ├── DoctorDashboard.tsx
│   ├── AIPredictions.tsx
│   └── DigitalTwin.tsx
├── styles/
│   └── globals.css     # Global styles and Tailwind imports
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

The application uses:
- **Vite** for fast hot module replacement and building
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **ESLint** for code quality

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
