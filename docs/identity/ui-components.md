# UI Components

This document outlines the user interface components and design system used by Monynha Softwares across all digital products.

## Component Architecture

### Design System Structure

Our design system follows atomic design principles:

- **Atoms**: Basic HTML elements (buttons, inputs, labels)
- **Molecules**: Simple combinations of atoms (form fields, cards)
- **Organisms**: Complex combinations of molecules (navigation, forms)
- **Templates**: Page-level layouts with placeholder content
- **Pages**: Specific instances of templates with real content

### Component Library

#### Core Components

- **Button**: Primary, secondary, and tertiary action buttons
- **Input**: Text inputs, textareas, select dropdowns
- **Card**: Content containers with consistent padding and shadows
- **Modal**: Overlay dialogs for focused interactions
- **Navigation**: Header, sidebar, and breadcrumb navigation
- **Table**: Data display with sorting and pagination
- **Form**: Structured form layouts with validation

#### Specialized Components

- **Data Visualization**: Charts, graphs, and data displays
- **Media**: Image galleries, video players, audio controls
- **Feedback**: Loading spinners, progress bars, notifications
- **Layout**: Grids, containers, and spacing utilities
- **Typography**: Text styles and heading hierarchies

## Component Specifications

### Button Component

#### Variants

```jsx
// Primary Button
<Button variant="primary" size="medium">
  Primary Action
</Button>

// Secondary Button
<Button variant="secondary" size="medium">
  Secondary Action
</Button>

// Ghost Button
<Button variant="ghost" size="medium">
  Ghost Action
</Button>
```

#### States

- **Default**: Normal button state
- **Hover**: Mouse over state with visual feedback
- **Active**: Pressed state during interaction
- **Disabled**: Non-interactive state with reduced opacity
- **Loading**: Loading state with spinner and disabled interaction
- **Focus**: Keyboard focus state with visible focus ring

#### Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Proper ARIA labels and descriptions
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Touch Targets**: Minimum 44px touch targets on mobile

### Form Components

#### Input Field

```jsx
// Text Input
<Input
  type="text"
  label="Full Name"
  placeholder="Enter your full name"
  required
  error={errors.name}
/>

// Email Input
<Input
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>
```

#### Form Validation

- **Real-time Validation**: Immediate feedback on input
- **Error States**: Clear error messages and visual indicators
- **Success States**: Positive feedback for valid inputs
- **Progressive Disclosure**: Show additional fields based on input

#### Field Types

- **Text**: Single-line text input
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection
- **Checkbox**: Multiple selection options
- **Radio**: Single selection from options
- **File Upload**: File selection and upload
- **Date Picker**: Date selection with calendar
- **Password**: Masked password input with visibility toggle

### Navigation Components

#### Header Navigation

```jsx
<Header>
  <Logo />
  <Navigation>
    <NavItem href="/products">Products</NavItem>
    <NavItem href="/solutions">Solutions</NavItem>
    <NavItem href="/about">About</NavItem>
  </Navigation>
  <UserMenu />
</Header>
```

#### Sidebar Navigation

```jsx
<Sidebar collapsed={isCollapsed}>
  <NavSection title="Main">
    <NavItem icon={<DashboardIcon />} href="/dashboard">
      Dashboard
    </NavItem>
    <NavItem icon={<ProjectsIcon />} href="/projects">
      Projects
    </NavItem>
  </NavSection>
  <NavSection title="Settings">
    <NavItem icon={<SettingsIcon />} href="/settings">
      Settings
    </NavItem>
  </NavSection>
</Sidebar>
```

#### Breadcrumb Navigation

```jsx
<Breadcrumb>
  <BreadcrumbItem href="/home">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem href="/products/software">Software</BreadcrumbItem>
  <BreadcrumbItem current>Monynha Docs</BreadcrumbItem>
</Breadcrumb>
```

### Data Display Components

#### Table Component

```jsx
<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' }
  ]}
  data={users}
  pagination={{ pageSize: 10, currentPage: 1 }}
  onSort={(column, direction) => handleSort(column, direction)}
  onRowClick={(row) => handleRowClick(row)}
/>
```

#### Card Component

```jsx
<Card>
  <CardHeader>
    <CardTitle>Project Overview</CardTitle>
    <CardDescription>
      Summary of current project status and metrics
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 gap-4">
      <MetricCard title="Total Users" value="12,345" />
      <MetricCard title="Active Projects" value="23" />
    </div>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Feedback Components

#### Loading States

```jsx
// Spinner
<Spinner size="medium" />

// Skeleton Loading
<SkeletonLoader>
  <SkeletonRectangle width="100%" height="200px" />
  <SkeletonText lines={3} />
</SkeletonLoader>

// Progress Bar
<ProgressBar value={75} max={100} label="Upload Progress" />
```

#### Notifications

```jsx
// Toast Notification
<Toast type="success" message="Project saved successfully!" />

// Alert Banner
<Alert type="warning" title="Attention Required">
  Your subscription will expire in 3 days.
</Alert>

// Modal Dialog
<Modal>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
  </ModalHeader>
  <ModalBody>
    Are you sure you want to delete this project?
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="danger">Delete</Button>
  </ModalFooter>
</Modal>
```

## Responsive Design

### Breakpoint System

#### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

#### Responsive Utilities

```jsx
// Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Responsive Typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Responsive Spacing
<div className="p-4 md:p-6 lg:p-8">
  Responsive Padding
</div>
```

### Mobile-First Approach

#### Touch Interactions

- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Support for swipe navigation
- **Tap States**: Clear visual feedback for touch interactions
- **Accessibility**: Screen reader support for touch interfaces

#### Mobile Navigation

- **Bottom Navigation**: Tab-based navigation for mobile
- **Hamburger Menu**: Collapsible navigation for smaller screens
- **Swipe Gestures**: Touch-friendly navigation patterns
- **Thumb Zone**: Content positioned for one-handed use

## Accessibility Features

### Keyboard Navigation

#### Focus Management

- **Visible Focus**: Clear focus indicators for keyboard users
- **Logical Order**: Tab order follows reading order
- **Focus Trapping**: Appropriate focus management in modals
- **Skip Links**: Skip to main content links

#### Keyboard Shortcuts

```jsx
// Keyboard Shortcuts
useKeyboardShortcut('ctrl+s', () => saveDocument());
useKeyboardShortcut('ctrl+z', () => undo());
useKeyboardShortcut('escape', () => closeModal());
```

### Screen Reader Support

#### ARIA Attributes

```jsx
// Button with ARIA
<button
  aria-label="Save document"
  aria-describedby="save-description"
>
  Save
</button>
<span id="save-description">
  Saves the current document to your account
</span>

// Form with ARIA
<form role="search" aria-label="Site search">
  <input
    type="search"
    aria-label="Search"
    aria-describedby="search-help"
  />
  <span id="search-help">
    Enter keywords to search the site
  </span>
</form>
```

#### Semantic HTML

- **Proper Headings**: Hierarchical heading structure (h1-h6)
- **Landmarks**: Header, nav, main, aside, footer landmarks
- **Lists**: Proper use of ul, ol, dl elements
- **Tables**: Proper table structure with headers

### Color and Contrast

#### Contrast Requirements

- **Text Contrast**: 4.5:1 minimum for normal text
- **Large Text**: 3:1 minimum for large text (18pt+ or 14pt+ bold)
- **Interactive Elements**: 3:1 minimum for buttons and links
- **Non-text Content**: 3:1 minimum for icons and graphics

#### Color Independence

- **Not Color Only**: Information not conveyed by color alone
- **Color Patterns**: Use patterns, shapes, or text with color
- **High Contrast**: Support for high contrast mode
- **Dark Mode**: Proper dark mode color schemes

## Component Documentation

### Storybook Integration

#### Component Stories

```jsx
// Button.stories.jsx
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and states.'
      }
    }
  }
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
    size: 'medium'
  }
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
    size: 'medium'
  }
};

export const Disabled = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true
  }
};
```

#### Documentation

- **Usage Examples**: Practical examples of component usage
- **Props Documentation**: Complete prop definitions and types
- **Accessibility Notes**: Accessibility considerations and requirements
- **Design Guidelines**: When and how to use each component

### Design Tokens

#### CSS Custom Properties

```css
/* Color Tokens */
:root {
  --color-primary: #2563eb;
  --color-secondary: #10b981;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-background: #ffffff;
  --color-surface: #f9fafb;
}

/* Spacing Tokens */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
}

/* Typography Tokens */
:root {
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
}
```

#### Component Variants

- **Size Variants**: Small, medium, large component sizes
- **Color Variants**: Different color schemes for different contexts
- **State Variants**: Default, hover, active, disabled, loading states
- **Layout Variants**: Different layout options for various use cases

## Implementation Guidelines

### Component Development

#### Code Standards

- **TypeScript**: Strongly typed component props and state
- **Clean Code**: Readable, maintainable component code
- **Performance**: Optimized rendering and minimal re-renders
- **Testing**: Comprehensive unit and integration tests

#### Component Composition

```jsx
// Composition over inheritance
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card>
      <CardHeader>
        <Avatar src={user.avatar} alt={user.name} />
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p>{user.bio}</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Maintenance & Updates

#### Versioning

- **Semantic Versioning**: Major.minor.patch version scheme
- **Breaking Changes**: Major version for breaking API changes
- **Deprecation**: Clear deprecation warnings for old APIs
- **Migration Guides**: Documentation for upgrading between versions

#### Change Management

- **Change Requests**: Formal process for component modifications
- **Impact Assessment**: Assessment of changes on existing implementations
- **Testing Requirements**: Required testing for component changes
- **Documentation Updates**: Updated documentation for changes

This comprehensive UI component system ensures consistent, accessible, and maintainable user interfaces across all Monynha Softwares products.
 
 