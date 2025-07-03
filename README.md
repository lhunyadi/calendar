# Modern Calendar Application

A feature-rich, responsive calendar application built with React, TypeScript, and Tailwind CSS. This calendar provides multiple view modes, intuitive navigation, and a modern dark theme interface.

![Calendar Preview](https://via.placeholder.com/800x400/1A1D21/4A154B?text=Calendar+App+Preview)

## ✨ Features

### Multiple View Modes
- **Month View**: Traditional calendar grid with full month overview
- **Week View**: 7-day weekly schedule with hourly time slots
- **Work Week View**: 5-day work week (Monday-Friday) schedule
- **Day View**: Single day detailed schedule with hourly breakdown

### Interactive UI
- **Smart Navigation**: Context-aware navigation that adapts to current view
- **Hour Selection**: Click on specific hours in Day/Week/Work Week views
- **Column Highlighting**: Click day headers to highlight entire columns
- **Today Navigation**: Quick "Today" button to jump to current date
- **Real-time Updates**: Live "now" line that moves with current time

### Modern Design
- **Dark Theme**: Sophisticated dark color scheme with purple accents
- **Weekend Styling**: Diagonal stripe pattern for weekend days
- **Responsive Design**: Works seamlessly across different screen sizes
- **Smooth Animations**: Polished transitions and hover effects
- **Custom Scrollbar**: Styled scrollbar that matches the dark theme

### Technical Highlights
- **No External Calendar Libraries**: Custom-built date utilities
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: Keyboard navigation and ARIA roles
- **Performance**: Optimized rendering and state management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/modern-calendar-app.git
cd modern-calendar-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
src/
├── components/
│   ├── Calendar/
│   │   ├── Calendar.tsx          # Main calendar component
│   │   ├── CalendarGrid.tsx      # Month view grid
│   │   ├── CalendarHeader.tsx    # Navigation header
│   │   ├── CalendarEvent.tsx     # Event display component
│   │   ├── DayView.tsx           # Day view component
│   │   └── WeekView.tsx          # Week/Work week view
│   └── shared/
├── utils/
│   └── dateUtils.ts              # Custom date utilities
├── types/
│   └── index.ts                  # TypeScript type definitions
├── constants/
│   └── index.ts                  # Application constants
└── styles/
    └── index.css                 # Global styles
```

## 🎯 Usage

### Navigation
- Use arrow buttons or keyboard arrow keys to navigate between periods
- Click "Today" to return to the current date/time
- Use the view selector to switch between Month, Week, Work Week, and Day views

### Selection
- **Month View**: Click on any day to select it
- **Week/Work Week/Day Views**: Click on day headers to highlight columns, or click on specific hour cells
- **Keyboard Navigation**: Use arrow keys to navigate between days/hours

### Time Features
- The red "now" line appears in Day, Week, and Work Week views showing current time
- Auto-scroll to current time when opening time-based views
- Real-time updates every minute

## 🔮 Upcoming Features

- [ ] Event creation and management
- [ ] Drag and drop event scheduling
- [ ] Task filtering and categories
- [ ] Holiday integration (worldwide holidays API)
- [ ] Event persistence and data storage
- [ ] Recurring events
- [ ] Multiple calendar support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style and TypeScript patterns
2. Ensure all components are properly typed
3. Test across different view modes and zoom levels
4. Maintain accessibility standards
5. Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React patterns and best practices
- Inspired by popular calendar applications
- Icons provided by [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or reach out to [your-email@example.com](mailto:your-email@example.com).

---

**Made with ❤️ and TypeScript**
