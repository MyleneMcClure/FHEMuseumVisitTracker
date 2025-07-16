# CI/CD Pipeline Documentation

Comprehensive Continuous Integration and Continuous Deployment pipeline for the Privacy-Preserving Museum Visit Tracker.

## Overview

This project implements a robust CI/CD pipeline using GitHub Actions with automated testing, code quality checks, and security audits.

## Pipeline Architecture

### Workflow Files

Located in `.github/workflows/`:

1. **test.yml** - Main CI/CD pipeline (automatic)
2. **manual.yml** - Manual testing workflow (on-demand)

## Main CI/CD Pipeline (test.yml)

### Triggers

The pipeline automatically runs on:

- **Push events** to `main` and `develop` branches
- **Pull requests** to `main` and `develop` branches

### Jobs

#### 1. Test Job

**Matrix Strategy:** Tests run on multiple configurations

| Parameter | Values |
|-----------|--------|
| Node.js versions | 18.x, 20.x |
| Operating systems | ubuntu-latest, windows-latest |

**Total test combinations:** 4 (2 Node versions × 2 OS)

**Steps:**

1. **Checkout code** - Get repository contents
2. **Setup Node.js** - Configure specified Node.js version
3. **Install dependencies** - Run `npm ci` for clean install
4. **Run Prettier check** - Verify code formatting (Ubuntu only)
5. **Run Solhint** - Lint Solidity contracts (Ubuntu only)
6. **Compile contracts** - Build smart contracts
7. **Run tests** - Execute test suite
8. **Generate coverage** - Create coverage report (Node 20.x + Ubuntu only)
9. **Upload to Codecov** - Send coverage data (Node 20.x + Ubuntu only)

#### 2. Code Quality Checks Job

**Runs on:** ubuntu-latest with Node.js 20.x

**Steps:**

1. **Checkout code**
2. **Setup Node.js**
3. **Install dependencies**
4. **Check code formatting** - Prettier validation
5. **Lint Solidity** - Solhint validation
6. **Check contract size** - Compilation check

#### 3. Security Checks Job

**Runs on:** ubuntu-latest with Node.js 20.x

**Steps:**

1. **Checkout code**
2. **Setup Node.js**
3. **Install dependencies**
4. **Run security audit** - NPM audit for vulnerabilities

## Manual Test Workflow (manual.yml)

### Trigger

- **Manual dispatch** from GitHub Actions UI
- **Configurable** Node.js version (18.x or 20.x)

### Features

- On-demand testing
- Custom Node.js version selection
- Full test suite execution
- Coverage report generation

## Code Quality Tools

### 1. Solhint (Solidity Linting)

**Configuration:** `.solhint.json`

**Rules:**

```json
{
  "extends": "solhint:recommended",
  "rules": {
    "code-complexity": ["error", 8],
    "compiler-version": ["error", "^0.8.24"],
    "func-visibility": ["error", { "ignoreConstructors": true }],
    "max-line-length": ["error", 120],
    "no-empty-blocks": "error",
    "no-unused-vars": "error"
  }
}
```

**Command:**
```bash
npm run lint:sol
```

### 2. Prettier (Code Formatting)

**Configuration:** `.prettierrc.yml`

**Features:**

- Consistent code style
- Automatic formatting
- Solidity plugin support
- Markdown formatting

**Commands:**
```bash
npm run prettier:check  # Check formatting
npm run prettier:write  # Auto-format
npm run format          # Alias for prettier:write
```

### 3. Solidity Coverage

**Configuration:** `.solcover.js`

**Reporters:**

- HTML report (visual)
- LCOV format (Codecov)
- Text output (terminal)
- JSON format (programmatic)

**Command:**
```bash
npm run test:coverage
```

## NPM Scripts

### Testing

```bash
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage
npm run test:gas         # Run tests with gas reporting
```

### Code Quality

```bash
npm run lint             # Run all linters
npm run lint:sol         # Lint Solidity only
npm run lint:fix         # Auto-fix Solidity issues
npm run prettier:check   # Check formatting
npm run prettier:write   # Auto-format code
npm run format           # Alias for prettier:write
```

### Build & Deploy

```bash
npm run compile          # Compile contracts
npm run deploy           # Deploy to Sepolia
npm run deploy:local     # Deploy to local network
npm run verify           # Verify on Etherscan
```

### Utilities

```bash
npm run clean            # Clean build artifacts
npm run node             # Start local Hardhat node
npm run interact         # Interact with deployed contract
npm run simulate         # Run simulation
```

## Codecov Integration

### Configuration

**File:** `codecov.yml`

**Settings:**

- **Target coverage:** 80%
- **Precision:** 2 decimal places
- **Acceptable range:** 70-100%
- **Threshold:** 1% change tolerance

### Coverage Reports

Coverage is automatically uploaded to Codecov when:

- Running on Node.js 20.x
- Running on ubuntu-latest
- Tests pass successfully

**View coverage:** https://codecov.io/gh/YOUR_USERNAME/REPO_NAME

### Setup Codecov

1. **Sign up** at https://codecov.io with GitHub account
2. **Add repository** to Codecov
3. **Copy token** from Codecov dashboard
4. **Add secret** to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Create new secret: `CODECOV_TOKEN`
   - Paste your Codecov token

## CI/CD Best Practices

### 1. Fast Feedback

- Tests run on every push
- Parallel execution on multiple platforms
- Quick failure detection

### 2. Code Quality Gates

- Prettier enforces consistent formatting
- Solhint catches Solidity issues
- Coverage reports track test quality

### 3. Security

- Automated npm audit
- No credentials in workflows
- Read-only permissions by default

### 4. Reproducibility

- `npm ci` for consistent installs
- Version pinning for actions
- Matrix testing for compatibility

### 5. Developer Experience

- Clear error messages
- Fast local testing
- Automated formatting

## Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/USERNAME/REPO/workflows/CI%2FCD%20Pipeline/badge.svg)
![Code Coverage](https://codecov.io/gh/USERNAME/REPO/branch/main/graph/badge.svg)
```

## Local Development Workflow

### Before Committing

```bash
# 1. Format code
npm run format

# 2. Run linters
npm run lint

# 3. Run tests
npm test

# 4. Check coverage
npm run test:coverage
```

### Pre-commit Checklist

- [ ] Code is formatted (`npm run format`)
- [ ] Linters pass (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Coverage is adequate (`npm run test:coverage`)
- [ ] No security vulnerabilities (`npm audit`)

## Troubleshooting

### Common Issues

#### 1. Prettier Check Fails

**Problem:** Code formatting doesn't match expected style

**Solution:**
```bash
npm run prettier:write
git add .
git commit -m "fix: format code"
```

#### 2. Solhint Errors

**Problem:** Solidity code has linting issues

**Solution:**
```bash
npm run lint:fix  # Auto-fix if possible
# Or manually fix issues shown in output
```

#### 3. Tests Fail in CI but Pass Locally

**Problem:** Environment differences

**Solution:**
- Check Node.js version matches CI
- Run `npm ci` instead of `npm install`
- Check for OS-specific issues

#### 4. Codecov Upload Fails

**Problem:** Missing or invalid token

**Solution:**
- Verify `CODECOV_TOKEN` is set in GitHub secrets
- Check token is still valid in Codecov dashboard
- Ensure coverage file exists (`coverage/lcov.info`)

### Debug CI Failures

1. **Check workflow logs** in GitHub Actions tab
2. **Run same commands locally:**
   ```bash
   npm ci
   npm run lint
   npm run compile
   npm test
   ```
3. **Use manual workflow** for testing specific configurations

## GitHub Actions Permissions

### Repository Settings

Ensure GitHub Actions is enabled:

1. Go to repository Settings
2. Navigate to Actions → General
3. Allow "Read and write permissions" (if needed for deployments)
4. Enable "Allow GitHub Actions to create and approve pull requests"

### Workflow Permissions

Workflows use minimal permissions:

```yaml
permissions:
  contents: read
```

For deployment workflows, additional permissions may be needed.

## Monitoring & Notifications

### GitHub Actions

- **Email notifications** for workflow failures
- **Status checks** on pull requests
- **Branch protection** can require passing CI

### Codecov

- **Coverage reports** on pull requests
- **Coverage trends** over time
- **File-level coverage** visualization

## Continuous Improvement

### Regular Maintenance

- **Update dependencies** monthly
- **Review coverage trends** weekly
- **Monitor test execution time** for optimization
- **Update linting rules** as needed

### Metrics to Track

- **Test execution time** - Should stay under 5 minutes
- **Coverage percentage** - Target 80%+
- **Build success rate** - Target 95%+
- **Security vulnerabilities** - Keep at 0

## Future Enhancements

Potential improvements:

1. **Deploy to testnet** - Automatic deployments on merge to main
2. **Contract verification** - Auto-verify on Etherscan
3. **Performance benchmarks** - Gas optimization tracking
4. **Mutation testing** - Test quality validation
5. **Dependency updates** - Automated Dependabot PRs
6. **E2E tests** - Frontend integration tests

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Hardhat CI/CD Guide](https://hardhat.org/hardhat-runner/docs/guides/continuous-integration)
- [Codecov Documentation](https://docs.codecov.com/)
- [Solhint Rules](https://github.com/protofire/solhint/blob/master/docs/rules.md)
- [Prettier Options](https://prettier.io/docs/en/options.html)

---

**Last Updated:** 2025-10-28

**Pipeline Version:** 1.0.0

**Status:** ✅ Production Ready
