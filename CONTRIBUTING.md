# Contributing to WebTicks API

Thank you for your interest in contributing to WebTicks API! This guide will help you get started.

## Getting Started

### 1. Fork and Clone

1. Fork this repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/webticks-api.git
cd webticks-api
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/celerinc/webticks-api.git
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using bun
bun install
```

### 3. Set Up Environment

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` with your local configuration (e.g., MongoDB connection string)

### 4. Run the Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using bun
bun run dev
```

The API will be available at `http://localhost:3002` by default.

## Development Workflow

1. **Create a branch** for your changes:

```bash
git checkout -b feat/your-feature-name
```

2. **Make your changes** in the `src/` directory

3. **Format your code**:

```bash
# Using npm
npm run format

# Using pnpm
pnpm format

# Using bun
bun run format
```

4. **Lint your code**:

```bash
# Using npm
npm run lint

# Using pnpm
pnpm lint

# Using bun
bun run lint
```

5. **Run tests**:

```bash
# Using npm
npm test

# Using pnpm
pnpm test

# Using bun
bun test
```

6. **Commit your changes** (see commit message guidelines below)

7. **Push to your fork** and open a pull request

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Please format your commit messages as follows:

```
<type>: <short description>
```

**Types:**

| Type       | Description                                      |
|------------|--------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `docs`     | Documentation changes                            |
| `refactor` | Code changes that neither fix bugs nor add features |
| `test`     | Adding or updating tests                         |

**Examples:**

```
feat: add user authentication endpoint
fix: resolve CORS issue on /api/track
docs: update README with setup instructions
refactor: simplify event validation logic
test: add unit tests for auth service
```

## Pull Request Guidelines

- **Keep PRs focused** - Each PR should address a single concern
- **Write clear descriptions** - Explain what changes you made and why
- **Reference issues** - Link related issues using `Fixes #123` or `Relates to #123`
- **Update documentation** - If your changes affect the API or setup, update the relevant docs
- **Ensure all checks pass** - Make sure linting, formatting, and tests pass before requesting review

## Code Guidelines

- **Follow existing patterns** - Look at how similar code is structured in the project
- **Write clean, readable code** - Use meaningful variable and function names
- **Add comments for complex logic** - If something isn't immediately obvious, explain it
- **Use TypeScript properly** - Avoid `any` types; define proper interfaces and types
- **Keep functions focused** - Each function should do one thing well

## AI-Generated Code

We welcome the use of AI tools (such as GitHub Copilot, ChatGPT, Claude, etc.) to help with contributions. However:

- **Understand what you're contributing** - Review and fully understand any AI-generated code before committing
- **Test thoroughly** - AI-generated code may contain subtle bugs or edge cases
- **Verify correctness** - Ensure the code follows our patterns and actually solves the intended problem
- **Take responsibility** - You are responsible for any code you submit, regardless of how it was generated

## Reporting Issues

When reporting bugs, please include:

1. **A clear title** describing the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs. **actual behavior**
4. **Environment details** (Node.js version, OS, etc.)
5. **Error messages** or logs if applicable

## License

By contributing to this project, you agree that your contributions will be licensed under the **Apache License 2.0**. See [LICENSE.md](./LICENSE.md) for details.

---

Questions? Feel free to open an issue or reach out to the maintainers. We're happy to help!
