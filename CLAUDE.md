# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses PNPM exclusively.

```bash
# Development server
pnpm dev

# Development with browser auto-open
pnpm dev -- --open

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Type checking with watch mode
pnpm check:watch

# Linting (Prettier + ESLint)
pnpm lint

# Code formatting
pnpm format
```

## Architecture Overview

### SvelteKit + TypeScript Setup
- **Framework**: SvelteKit with TypeScript in strict mode
- **Styling**: Tailwind CSS v4 with modern features and custom design tokens
- **Components**: shadcn-svelte component library built on bits-ui
- **Content**: MDSveX for markdown-based content
- **Blockchain**: SUI wallet adapter integration

### Project Structure
```
src/
├── routes/              # SvelteKit file-based routing
├── lib/
│   ├── components/ui/   # shadcn-svelte components (organized by component type)
│   ├── utils.ts         # Utility functions including cn() for class merging
│   └── assets/          # Static assets
└── app.css             # Global styles with comprehensive design tokens
```

### Component Architecture
- **shadcn-svelte Pattern**: Each UI component has its own directory with component file and index.ts export
- **Component Aliases**: Configured in `components.json` for easy imports:
  - `$lib/components` → components
  - `$lib/components/ui` → ui
  - `$lib/utils` → utils
- **Type Safety**: Uses TypeScript with utility types for component props (WithoutChildren, WithElementRef)

### Styling System
- **Tailwind CSS v4**: Uses the latest version with inline theme configuration
- **Design Tokens**: Comprehensive CSS custom properties for colors, spacing, and theming
- **Dark Mode**: Custom variant using `@custom-variant dark (&:is(.dark *))`
- **Theme Variables**: Mapped to Tailwind utilities through `@theme inline` directive

### Configuration Notes

#### Linting & Type Checking
- **Permissive Settings**: ESLint and TypeScript configured to allow `any` types and unused variables
- **Rules Disabled**: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`
- **TypeScript**: `noUnusedLocals: false`, `noUnusedParameters: false`

#### SUI Wallet Integration
- Uses `@builders-of-stuff/svelte-sui-wallet-adapter`
- Styles imported in `app.css`
- Ready for blockchain interaction patterns

#### MDSveX Support
- Configured for `.svx` files
- Allows markdown content with Svelte components
- Extensions: `['.svelte', '.svx']`

## Development Patterns

### Adding New Components
1. Use shadcn-svelte CLI or follow existing patterns in `src/lib/components/ui/`
2. Each component gets its own directory with component file and `index.ts`
3. Export through `index.ts` for clean imports

### Styling Approach
- Use the `cn()` utility for conditional classes: `cn('base-class', conditional && 'conditional-class')`
- Leverage design tokens through CSS custom properties
- Follow the established color and spacing system

### Type Definitions
- Use utility types from `utils.ts` for component props
- Follow the WithoutChildren/WithElementRef patterns for component APIs

## Special Configurations

### Audio Hooks
- Claude Code configured with audio feedback for various events
- Sounds located in `.claude/sounds/` directory
- Hooks trigger on session start, prompt submit, and task completion

### PNPM Configuration
- Uses `onlyBuiltDependencies: ["esbuild"]` for build optimization
- All commands should use `pnpm` instead of `npm` or `yarn`

### Vite + Tailwind
- Tailwind integrated via `@tailwindcss/vite` plugin
- Modern CSS features and optimization enabled