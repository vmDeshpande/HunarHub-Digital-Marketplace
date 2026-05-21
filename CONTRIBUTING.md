# Contributing to Hunar Hub

## Getting Started

1. **Fork & Clone**
   ```bash
   git clone https://github.com/vmDeshpande/HunarHub-Digital-Marketplace
   cd HunarHub-Digital-Marketplace
   ```

2. **Setup Development Environment**
   ```bash
   pnpm install
   cp .env.example .env.local
   # Update .env.local with your development values
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

## Code Standards

### TypeScript
- Use strict type checking
- Avoid `any` types
- Define interfaces for complex objects

### Component Structure
```typescript
// Always use 'use client' for client components
'use client';

interface Props {
  // ...
}

export function ComponentName({ ...props }: Props) {
  // ...
}
```

### Naming Conventions
- Components: PascalCase (`UserCard.tsx`)
- Functions: camelCase (`fetchUser()`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- CSS classes: kebab-case (`card-header`)

### File Organization
```
src/
├── app/
│   ├── (dashboard)/
│   ├── (public)/
│   └── api/
├── components/
├── hooks/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── utils/
│   └── validations/
└── styles/
```

## Database Changes

1. Update schema in `lib/db/models/`
2. Create migration if needed
3. Test with local MongoDB
4. Document schema changes

## Testing

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix
```

## Commit Messages

Follow conventional commits:
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Refactor code
test: Add tests
chore: Maintenance tasks
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit
3. Push to your fork
4. Create Pull Request with description
5. Request review
6. Address review comments
7. Merge when approved

## Performance Guidelines

- Use `next/image` for image optimization
- Implement code splitting with dynamic imports
- Use React Query for data fetching
- Optimize database queries
- Lazy load components when possible

## Security Guidelines

- Never commit sensitive information
- Validate all user inputs
- Sanitize database queries
- Use HTTPS in production
- Keep dependencies updated
- Review security advisories

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with notes
6. Deploy to production

## Support

- Report bugs on GitHub Issues
- Discuss features in Discussions
- Check existing issues before creating new ones
- Provide detailed bug reports with reproduction steps
