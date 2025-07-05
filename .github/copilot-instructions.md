<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Calendar Application Development Guidelines

This is a React TypeScript calendar application with the following features:
- Modern calendar grid UI with dark theme
- Task management with drag and drop functionality
- Holiday integration using https://date.nager.at/swagger/index.html API
- Custom date utilities without external date libraries
- Tailwind CSS for styling
- TypeScript for type safety

## Technology Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Custom date utilities
- CSS-in-JS approach for complex styling

## Key Components
- Calendar: Main calendar component with month navigation
- CalendarGrid: Grid layout for days and events
- CalendarHeader: Navigation and month display
- CalendarEvent: Individual event display component

## Styling Guidelines
- Use Tailwind CSS classes for styling
- Dark theme with colors like #1A1D21, #2C2D30, #36C5F0
- Weekend days have diagonal stripe pattern
- Responsive design principles
- Modern glass-morphism effects

## Development Notes
- No external calendar libraries should be used
- Custom date utilities in utils/dateUtils.ts
- Events are stored in component state
- Drag and drop functionality to be implemented
- Holiday API integration to be added
