# Contributing to Monynha Softwares

This guide outlines how to contribute to Monynha Softwares projects, whether you're a team member, external contributor, or community member.

## Getting Started

### Development Environment Setup

#### Prerequisites

- **Node.js**: Version 20.x or later
- **Yarn**: Package manager (preferred over npm)
- **Git**: Version control system
- **VS Code**: Recommended code editor with extensions

#### Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/monynha-softwares/project-name.git
   cd project-name
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   yarn dev
   ```

### Project Structure

```
project/
├── docs/                 # Documentation
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── styles/          # Styling files
├── public/              # Static assets
├── tests/               # Test files
├── .github/             # GitHub configuration
│   ├── workflows/       # CI/CD pipelines
│   └── ISSUE_TEMPLATE/  # Issue templates
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Development Workflow

### Branching Strategy

#### Branch Naming Convention

- **Feature Branches**: `feature/description-of-feature`
- **Bug Fixes**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-docs`
- **Hotfixes**: `hotfix/critical-fix-description`

#### Example Branch Names

```bash
# Feature development
git checkout -b feature/user-authentication

# Bug fixes
git checkout -b fix/login-validation-error

# Documentation updates
git checkout -b docs/api-reference-update

# Hotfixes
git checkout -b hotfix/security-vulnerability-patch
```

### Commit Guidelines

#### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

#### Commit Examples

```bash
# Feature commit
git commit -m "feat(auth): add user registration functionality

- Implement user registration form
- Add email verification
- Create user profile creation"

# Bug fix commit
git commit -m "fix(login): resolve validation error on login form

Fixes issue where empty password field was not properly validated.
Added client-side validation for required fields."

# Documentation commit
git commit -m "docs(api): update authentication endpoint documentation

- Add missing parameters
- Include response examples
- Update error codes"
```

### Pull Request Process

#### Creating a Pull Request

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

#### PR Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context.
```

#### PR Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one team member reviews the code
3. **Testing**: Reviewer tests the changes locally
4. **Approval**: PR is approved or changes are requested
5. **Merge**: Approved PR is merged to main branch

## Code Standards

### TypeScript/JavaScript Standards

#### Code Style

```typescript
// Good: Clear, readable code
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: Date;
}

class UserService {
  constructor(private readonly apiClient: ApiClient) {}

  async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await this.apiClient.get(`/users/${userId}`);
      return this.mapToUserProfile(response.data);
    } catch (error) {
      throw new UserServiceError('Failed to fetch user profile', error);
    }
  }

  private mapToUserProfile(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: new Date(data.created_at),
    };
  }
}

// Bad: Unclear, hard to maintain code
interface usr {
  i: string;
  n: string;
  e: string;
  c: Date;
}

class usr_svc {
  private a: any;

  constructor(a: any) {
    this.a = a;
  }

  async gup(id: string) {
    const r = await this.a.get(`/u/${id}`);
    return r.d;
  }
}
```

#### Key Principles

- **TypeScript First**: Use TypeScript for all new code
- **Strict Mode**: Enable strict TypeScript configuration
- **Interface Segregation**: Use interfaces to define contracts
- **Error Handling**: Proper error handling with custom error types
- **Async/Await**: Prefer async/await over promises

### React Best Practices

#### Component Structure

```tsx
// Good: Clean component structure
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [onEdit, user]);

  const handleDelete = useCallback(() => {
    onDelete(user);
  }, [onDelete, user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{user.bio}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleEdit}>Edit</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

#### React Guidelines

- **Functional Components**: Use functional components with hooks
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Error Boundaries**: Implement error boundaries for error handling
- **Accessibility**: Follow accessibility best practices

### CSS/Styling Standards

#### Tailwind CSS

```tsx
// Good: Consistent Tailwind usage
function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <div className="flex items-center space-x-4">
        <img
          className="w-12 h-12 rounded-full"
          src={user.avatar}
          alt={`${user.name} avatar`}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {user.name}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-700">{user.bio}</p>
    </div>
  );
}
```

#### Styling Guidelines

- **Utility-First**: Use Tailwind's utility-first approach
- **Responsive Design**: Mobile-first responsive design
- **Consistent Spacing**: Use Tailwind's spacing scale
- **Dark Mode**: Support for dark mode themes
- **Performance**: Optimize CSS for performance

## Testing Standards

### Testing Strategy

#### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **End-to-End Tests**: Test complete user workflows
- **Visual Regression**: Test UI changes with screenshots

#### Testing Tools

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer',
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Software developer')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} onDelete={jest.fn()} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### Testing Guidelines

- **Test Coverage**: Aim for 80%+ code coverage
- **Descriptive Tests**: Write clear, descriptive test names
- **Arrange-Act-Assert**: Follow AAA testing pattern
- **Mock Dependencies**: Mock external dependencies
- **Test Edge Cases**: Test error conditions and edge cases

## Documentation

### Code Documentation

#### JSDoc Comments

```typescript
/**
 * Calculates the total price including tax
 * @param {number} price - The base price before tax
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns {number} The total price including tax
 * @example
 * calculateTotal(100, 0.08) // returns 108
 */
function calculateTotal(price: number, taxRate: number): number {
  return price * (1 + taxRate);
}
```

#### TypeScript Types

```typescript
/**
 * Represents a user in the system
 */
interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** When the user account was created */
  createdAt: Date;
  /** User's role in the system */
  role: 'admin' | 'user' | 'moderator';
}
```

### Documentation Guidelines

- **README Files**: Comprehensive project documentation
- **API Documentation**: Document all public APIs
- **Component Documentation**: Document component props and usage
- **Inline Comments**: Explain complex logic, not obvious code
- **Changelog**: Maintain changelog for releases

## Security Considerations

### Secure Coding Practices

#### Input Validation

```typescript
// Good: Proper input validation
function createUser(userData: CreateUserInput): User {
  // Validate required fields
  if (!userData.name || userData.name.trim().length === 0) {
    throw new ValidationError('Name is required');
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    throw new ValidationError('Valid email is required');
  }

  // Sanitize input
  const sanitizedName = sanitizeHtml(userData.name);
  const sanitizedEmail = userData.email.toLowerCase().trim();

  // Create user with validated data
  return {
    id: generateId(),
    name: sanitizedName,
    email: sanitizedEmail,
    createdAt: new Date(),
  };
}
```

#### Security Guidelines

- **Input Sanitization**: Sanitize all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Escape output and use CSP headers
- **Authentication**: Secure authentication mechanisms
- **Authorization**: Proper access control checks
- **Secrets Management**: Never commit secrets to version control

## Performance Optimization

### Code Performance

#### Optimization Techniques

```typescript
// Good: Optimized component with memoization
import React, { memo, useMemo } from 'react';

interface UserListProps {
  users: User[];
  filter: string;
}

export const UserList = memo<UserListProps>(({ users, filter }) => {
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  return (
    <div>
      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
});
```

#### Performance Guidelines

- **Bundle Splitting**: Split code into smaller chunks
- **Lazy Loading**: Load components and routes lazily
- **Memoization**: Use React.memo, useMemo, and useCallback
- **Virtual Scrolling**: For large lists
- **Image Optimization**: Optimize images for web

## Issue Tracking

### Bug Reports

#### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain the problem.

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Version: [e.g., v1.2.3]

## Additional Context
Any other context about the problem.
```

### Feature Requests

#### Feature Request Template

```markdown
## Problem Statement
What problem are you trying to solve?

## Proposed Solution
Describe the solution you'd like to see.

## Alternative Solutions
Describe any alternative solutions you've considered.

## Additional Context
Any other context or screenshots about the feature request.

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3
```

## Community Guidelines

### Code of Conduct

#### Our Standards

- **Respect**: Treat everyone with respect and kindness
- **Inclusivity**: Welcome people from all backgrounds
- **Collaboration**: Work together constructively
- **Professionalism**: Maintain professional communication
- **Openness**: Be open to different ideas and perspectives

#### Unacceptable Behavior

- Harassment or discrimination
- Offensive language or content
- Personal attacks
- Spam or irrelevant content
- Violation of privacy

### Getting Help

#### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For private matters or sensitive issues
- **Slack/Teams**: For team-internal communication

#### Response Times

- **Bug Reports**: Acknowledged within 24 hours
- **Feature Requests**: Reviewed within 1 week
- **Pull Request Reviews**: Reviewed within 2-3 business days
- **General Questions**: Responded to within 48 hours

## Recognition & Rewards

### Contribution Recognition

- **Contributors List**: Recognition in project README
- **GitHub Badges**: Contribution badges on GitHub profile
- **Newsletter**: Feature in company newsletter
- **Events**: Invitation to company events

### Rewards Program

- **Bug Bounties**: Rewards for finding and fixing security issues
- **Feature Grants**: Funding for significant feature contributions
- **Hackathons**: Participation in company hackathons
- **Swag**: Company merchandise for contributors

Thank you for contributing to Monynha Softwares! Your contributions help make our products better for everyone.