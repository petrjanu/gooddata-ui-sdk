# Skeletons

These are skeleton projects that can be used to bootstrap a new SDK package quickly and efficiently. 
The skeletons provide a standardized structure and configuration for new packages in the GoodData.UI ecosystem.

You can use the attached [create-new-lib.sh](create-new-lib.sh) script to bootstrap a new package:

```bash
cd skel
./create-new-lib.sh ts my-new-lib
```

This will bootstrap a new project in libs directory and a new project entry to `rush.json`,
execute `rush update` and then commit all the new files and changes.

Alternatively, if you would like to create a new non-production tooling, use [create-new-tool.sh](create-new-tool.sh)

## Available Skeletons

### sdk-skel-ts

Pure TypeScript project with modern tooling:
- **Testing**: Vitest for fast unit testing
- **Build**: TypeScript compiler with optimized configuration
- **Linting**: ESLint with GoodData.UI rules

Use this for new headless libraries, utilities, and backend services.

### sdk-skel-tsx

TypeScript + React project with comprehensive testing setup:
- **Testing**: Vitest + React Testing Library for component testing
- **Documentation**: Storybook for component documentation
- **Build**: Optimized React build configuration
- **Linting**: ESLint with React and accessibility rules

Use this for new UI components, React hooks, and interactive elements.

## Best Practices

- Always run `rush update` after creating a new package
- Follow the existing naming conventions (`@gooddata/sdk-*`)
- Update the generated package.json with proper description and keywords
- Add appropriate peer dependencies for React components
