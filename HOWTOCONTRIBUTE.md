# How to Contribute to AREA

Thank you for your interest in contributing to the AREA project! This document provides guidelines and information to help you get started.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component-Specific Contributions](#component-specific-contributions)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AREA.git
   cd AREA
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/SamTess/AREA.git
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🏗️ Project Structure

The AREA project is organized into multiple components, each with its own contribution guidelines:

```
AREA/
├── App/
│   ├── Back/        # Backend (Spring Boot/Java)
│   ├── Web/         # Web Client (Next.js/TypeScript)
│   └── Mobile/      # Mobile Client (React Native/TypeScript)
└── deployement/     # Infrastructure & Deployment
```

## 📂 Component-Specific Contributions

Each component has its own detailed contribution guide. Please refer to the appropriate documentation based on what you want to contribute to:

### Backend Contributions

For backend development (Java, Spring Boot, API endpoints, database):

📖 **See**: [App/Back/HOWTOCONTRIBUTE.md](./App/Back/HOWTOCONTRIBUTE.md)

Topics covered:
- Java coding standards and Checkstyle configuration
- Spring Boot best practices
- Database migrations and schema changes
- API endpoint creation
- Service implementation
- Unit and integration testing
- Worker/Queue system
- Email service configuration

### Web Client Contributions

For web application development (Next.js, React, TypeScript):

📖 **See**: [App/Web/HOWTOCONTRIBUTE.md](./App/Web/HOWTOCONTRIBUTE.md)

Topics covered:
- React/Next.js component structure
- TypeScript usage and type definitions
- Styling guidelines (Tailwind CSS)
- State management
- API integration
- Testing with Jest and Cypress
- Internationalization (i18n)

### Mobile Client Contributions

For mobile application development (React Native, Expo):

📖 **See**: [App/Mobile/HOWTOCONTRIBUTE.md](./App/Mobile/HOWTOCONTRIBUTE.md)

Topics covered:
- React Native component development
- Expo configuration
- Navigation structure
- Platform-specific code (iOS/Android)
- Mobile UI/UX patterns
- Testing on mobile platforms
- Build and release process

### Infrastructure & Deployment

For deployment and infrastructure contributions (Docker, Ansible, Terraform):

📖 **See**: [deployement/docs/README.md](./deployement/docs/README.md)

Topics covered:
- Docker configuration
- Ansible playbooks
- Terraform infrastructure
- CI/CD pipelines
- Monitoring setup

## 🔄 Development Workflow

### 1. Set Up Development Environment

Follow the main [README.md](./README.md) to set up the complete development environment using Docker Compose.

### 2. Make Your Changes

- Follow the component-specific guidelines
- Write clean, readable, and maintainable code
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# For backend
cd App/Back
./gradlew test

# For web
cd App/Web
npm test

# For mobile
cd App/Mobile
npm test

# Integration test with Docker
docker-compose up --build
```

### 4. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

## 📏 Code Standards

### General Guidelines

- Write clear, self-documenting code
- Follow the existing code style in each component
- Add appropriate comments for complex logic
- Keep functions and methods small and focused
- Use meaningful variable and function names
- Avoid code duplication (DRY principle)

### Language-Specific Standards

- **Java**: Follow [App/Back/docs/checkstyle-guide.md](./App/Back/docs/checkstyle-guide.md)
- **TypeScript/JavaScript**: ESLint configuration in each client project
- **Infrastructure**: Follow best practices for Docker, Ansible, and Terraform

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat(backend): add user authentication endpoint

fix(web): resolve login form validation issue

docs(mobile): update setup instructions

test(backend): add unit tests for service layer
```

## 🔀 Pull Request Process

1. **Ensure your code builds and tests pass**
2. **Update documentation** if you've made changes to functionality
3. **Create a pull request** with a clear title and description
4. **Link related issues** in the PR description
5. **Request review** from maintainers
6. **Address feedback** promptly and professionally

### PR Title Format

```
<type>(<component>): <description>
```

Examples:
- `feat(backend): implement OAuth authentication`
- `fix(web): resolve navigation menu layout issue`
- `docs(mobile): add testing documentation`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project standards
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

## 🧪 Testing

Testing is crucial for maintaining code quality:

- **Write tests** for new features and bug fixes
- **Run existing tests** before submitting PR
- **Add integration tests** when appropriate
- **Test across environments** (development, staging)

Component-specific testing guides:
- Backend: [App/Back/docs/unit-testing-guide.md](./App/Back/docs/unit-testing-guide.md)
- Web: Jest and Cypress in `App/Web/__tests__/`
- Mobile: Jest in `App/Mobile/__tests__/`

## 📚 Documentation

Good documentation is as important as good code:

- **Update README** files when adding features
- **Document API changes** in backend
- **Add code comments** for complex logic
- **Update technical docs** in respective `docs/` folders
- **Include examples** when helpful

## 🤔 Questions?

If you have questions or need help:

1. Check existing documentation in component-specific folders
2. Search existing issues on GitHub
3. Open a new issue with the `question` label
4. Reach out to the maintainers

## 🎯 Good First Issues

Look for issues labeled `good first issue` to get started. These are beginner-friendly tasks that will help you familiarize yourself with the project.

## 🌟 Recognition

Contributors are recognized in the following ways:
- Listed in project contributors
- Mentioned in release notes
- Credits in documentation

## ⚖️ Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms:

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 📄 License

By contributing to AREA, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AREA! 🎉**

We appreciate your time and effort in making this project better. Every contribution, no matter how small, makes a difference!
