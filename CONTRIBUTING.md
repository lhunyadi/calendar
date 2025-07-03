# Contributing to Modern Calendar App

Thank you for your interest in contributing to the Modern Calendar App! We welcome contributions from everyone.

## 🚀 Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/modern-calendar-app.git
   cd modern-calendar-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use functional components with hooks
- Ensure proper TypeScript typing for all props and functions
- Use Tailwind CSS for styling
- Follow the existing component structure

### Component Guidelines
- Keep components focused and single-purpose
- Use descriptive prop names and interfaces
- Include proper TypeScript types for all props
- Add comments for complex logic
- Ensure accessibility (ARIA roles, keyboard navigation)

### Testing
- Test across different view modes (Month, Week, Work Week, Day)
- Test at different zoom levels to ensure alignment
- Verify keyboard navigation works correctly
- Check responsive design on different screen sizes

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Calendar/          # Main calendar components
│   └── shared/           # Reusable components
├── utils/                # Utility functions
├── types/                # TypeScript type definitions
├── constants/            # Application constants
└── styles/              # Global styles
```

## 🐛 Bug Reports

When filing bug reports, please include:
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Browser and version
- Screen size/zoom level (for UI issues)
- Screenshots if applicable

## ✨ Feature Requests

For feature requests, please:
- Check if the feature already exists or is planned
- Describe the use case clearly
- Explain how it fits with the existing design
- Consider backward compatibility

## 📝 Pull Request Process

1. Update documentation if needed
2. Ensure your code follows the style guidelines
3. Test thoroughly across different views and zoom levels
4. Update the README if you're adding new features
5. Create a pull request with a clear description

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Month view
- [ ] Tested in Week view
- [ ] Tested in Work Week view
- [ ] Tested in Day view
- [ ] Tested keyboard navigation
- [ ] Tested at different zoom levels
- [ ] Tested responsive design

## Screenshots
If applicable, add screenshots to show the changes
```

## 🎯 Priority Areas

We're particularly interested in contributions in these areas:
- Event creation and management
- Drag and drop functionality
- Holiday integration
- Performance optimizations
- Accessibility improvements
- Mobile responsiveness
- Additional view modes

## 💬 Questions?

If you have questions about contributing, feel free to:
- Open an issue for discussion
- Check existing issues and discussions
- Reach out to the maintainers

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
