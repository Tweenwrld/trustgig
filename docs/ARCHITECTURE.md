# TrustGig Architecture & Workflow Standards

> **Document Status**: Draft
> **Version**: 1.0
> **Date**: 2025-05-15

## 1. Codebase Audit & Architecture Overview

### 1.1 Repository Structure
The project follows a **Hybrid Monorepo** structure using **TurboRepo**, optimized for Next.js 15 (App Router) and Cardano/Aiken smart contract development.

#### Core Directories
- **`apps/web`** (formerly `src`/`app`): Main Next.js frontend application.
  - _Recommendation_: Move `src` content to `apps/web` to adhere to standard TurboRepo patterns, or maintain `src` as the primary app if this is a single-app monorepo. *Current analysis shows root `src` pattern is used.*
- **`packages/`**: Shared internal libraries.
  - `contracts-sdk`: Generated TypeScript wrappers for Aiken contracts.
  - `design-system` (Proposed): Shared UI components (currently in `src/components`).
  - `shared-types`: Common TypeScript interfaces.
- **`contracts/`**: Aiken smart contract source code, validators, and Plutus scripts.
- **`scripts/`**: DevOps, deployment, and contract compilation utilities.

### 1.2 Key Dependencies
- **Frontend**: Next.js 15, React 19 (RC), TailwindCSS, Framer Motion.
- **Blockchain**: MeshJS (Cardano SDK), Aiken (Smart Contracts).
- **Database**: Prisma ORM (Schema location: `prisma/schema.prisma`).

---

## 2. Git Branching Strategy

We utilize a modified **Gitflow** workflow tailored for component-based development.

### 2.1 Branch Types

| Branch Type | naming Convention | Source | Target | Purpose |
|-------------|-------------------|--------|--------|---------|
| **Master** | `main` | - | - | Production-ready code. Deployed to Mainnet. |
| **Develop** | `develop` | `main` | `main` | Integration branch. Deployed to Testnet. (Needs Creation) |
| **Component**| `app`, `core`, etc.| `develop`| `develop`| Long-lived branches for specific architectural layers. (Legacy/Active) |
| **Feature** | `feature/TG-<ID>-<desc>` | `develop` | `develop` | New functionality. |
| **Bugfix** | `fix/TG-<ID>-<desc>` | `develop` | `develop` | Non-critical bug fixes. |
| **Hotfix** | `hotfix/<desc>` | `main` | `main` | Critical production fixes. |

### 2.2 Existing Component Branches
The repository maintains specific long-lived branches for different architectural components which should be synced with `develop`:
- `app`: Frontend application logic.
- `contracts-sdk`: TypeScript bindings for contracts.
- `smart-contracts`: Aiken/Plutus validator code.
- `components`: React UI components.
- `config`: Environment and app configuration.
- `hooks`, `lib`, `scripts`, `shared-types`: Utility and library code.

**Integration Rule**: When working on a feature that spans multiple components (e.g., a new UI flow needing contract changes), create a `feature/` branch off `develop`. If the change is isolated to a component (e.g., refactoring `hooks`), you may check out the component branch, but preference is given to `feature/` branches merged back to `develop` to ensure holistic integration.

---

## 3. Workflow Lifecycle

### Phase 1: Task Selection
1.  Select task from `TASKS.md`.
2.  Move status to **In Progress** in `TASKS.md`.
3.  Assign Task ID (e.g., TG-001) if not present.

### Phase 2: Implementation
1.  **Checkout**: `git checkout develop` -> `git pull` -> `git checkout -b feature/TG-001-job-posting`.
2.  **Develop**: Implement changes.
3.  **Commit**: Atomic commits with conventional messages.
    - `feat: add job posting form validation`
    - `fix: resolve wallet connection timeout`
    - `docs: update API references`

### Phase 3: Review & Merge
1.  **Push**: `git push origin feature/TG-001-job-posting`.
2.  **PR**: Open Pull Request to `develop`.
    - _Reviewers_: At least 1 peer approval.
    - _Checks_: CI must pass (Build, Lint, Tests).
3.  **Merge**: Squash & Merge into `develop`.
4.  **Delete**: Remove feature branch.

---

## 4. Coding Standards

### 4.1 Frontend (React/Next.js)
- **Components**: Functional components with strict TypeScript interfaces.
- **State**: Use `Nuqs` for URL state, `Zustand` for global app state. Avoid prop drilling.
- **Styling**: TailwindCSS with utility-first approach. Use `clsx` or `tailwind-merge` for conditional classes.

### 4.2 Smart Contracts (Aiken)
- **Testing**: 100% test coverage for validators usually required.
- **Types**: Ensure `contracts-sdk` is regenerated after any Validator change (`npm run contracts:build`).

### 4.3 Documentation
- Update `README.md` for any new environment variables.
- API routes must have basic JSDoc comments.

---

## 5. CI/CD Integration Points
- **On Push to `feature/*`**: Run Linter (`npm run lint`) and Type Check (`npm run type-check`).
- **On Push to `develop`**: Build App (`npm run build`) and Contract Tests (`npm run contracts:test`).
