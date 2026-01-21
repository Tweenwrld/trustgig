# TrustGig Implementation Tasks

> **Last Updated**: $(date)  
> **Status**: Active Development  
> **Priority Legend**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Executive Summary

TrustGig is a decentralized gig economy platform on Cardano. The smart contracts (Aiken) are **complete and compiled**, but the frontend integration layer, authentication, and several UI pages remain incomplete.

### Current State

| Component | Status | Completion |
|-----------|--------|------------|
| Smart Contracts (Aiken) | ✅ Complete | 100% |
| contracts-sdk (TypeScript) | ⚠️ Scaffolded | 70% |
| Prisma Schema | ✅ Complete | 100% |
| API Routes | ⚠️ Partial | 50% |
| Authentication | ❌ Not Started | 0% |
| UI Pages | ⚠️ Scaffolded | 40% |
| Testing Infrastructure | ❌ Minimal | 10% |

---

## Phase 1: Critical Infrastructure 🔴

### 1.1 Wire contracts-sdk to Compiled Contracts

**Location**: `packages/contracts-sdk/`  
**Estimated**: 4-6 hours  
**Blocker for**: All on-chain interactions

The SDK classes exist but don't load the compiled CBOR from `contracts/plutus.json`.

**Tasks**:
- [ ] Create `packages/contracts-sdk/src/config/plutus-loader.ts`
  ```typescript
  // Load and parse plutus.json blueprint
  // Extract validator hashes and compiled code
  // Generate script addresses for each network
  ```
- [ ] Update each builder to accept compiled validator code:
  - [ ] `escrow/builder.ts` - Load `escrow.escrow.spend` validator
  - [ ] `dispute/builder.ts` - Load `dispute.dispute.spend` validator  
  - [ ] `reputation/builder.ts` - Load `reputation.reputation.spend` validator
  - [ ] `multisig/builder.ts` - Load `multisig.multisig.spend` validator
  - [ ] `credentials/builder.ts` - Load `credentials.credentials.spend` validator
- [ ] Create address derivation utility for preprod/mainnet
- [ ] Add contract deployment verification script

**Files to modify**:
- `packages/contracts-sdk/src/index.ts`
- `packages/contracts-sdk/src/*/builder.ts` (all 5)
- Create: `packages/contracts-sdk/src/config/index.ts`

---

### 1.2 Implement useContract Hook

**Location**: `src/hooks/useContract.ts`  
**Estimated**: 3-4 hours  
**Blocker for**: All contract UI interactions

Current state: Returns `null` with TODO comment.

**Tasks**:
- [ ] Import SDK builders from `@trustgig/contracts-sdk`
- [ ] Initialize MeshTxBuilder with Blockfrost provider
- [ ] Implement transaction building for each contract type:
  ```typescript
  case 'escrow':
    return new EscrowBuilder(txBuilder, scriptAddress, compiledCode);
  case 'reputation':
    return new ReputationBuilder(txBuilder, scriptAddress, compiledCode);
  case 'multisig':
    return new MultisigBuilder(txBuilder, scriptAddress, compiledCode);
  ```
- [ ] Handle wallet connection state
- [ ] Add error boundaries and retry logic
- [ ] Expose transaction submission through `useTransaction` hook

**Files to modify**:
- `src/hooks/useContract.ts`
- `src/hooks/useTransaction.ts` (add integration)

---

### 1.3 Implement src/lib/cardano/contracts.ts

**Location**: `src/lib/cardano/contracts.ts`  
**Estimated**: 2-3 hours  

Current state: All functions are stubs with TODO.

**Tasks**:
- [ ] Implement `buildEscrowDepositTx()`:
  - Initialize EscrowBuilder from SDK
  - Set datum with client/worker PKH, amount, milestones
  - Return unsigned transaction
- [ ] Implement `buildEscrowReleaseTx()`:
  - Find escrow UTxO at script address
  - Parse inline datum
  - Build release transaction with correct redeemer
- [ ] Implement `buildReputationUpdateTx()`:
  - Query user's reputation UTxO
  - Build update transaction
- [ ] Add `buildDisputeInitiateTx()` and `buildDisputeResolveTx()`

---

## Phase 2: Authentication & Authorization 🟠

### 2.1 Implement Wallet-Based Authentication

**Location**: New file `src/lib/auth/`  
**Estimated**: 6-8 hours  
**Blocker for**: All protected routes

Current state: `src/app/api/jobs/route.ts` has `const clientId = 'temp-client-id'`

**Tasks**:
- [ ] Create `src/lib/auth/wallet-auth.ts`:
  - Message signing challenge/response flow
  - Session token generation (JWT with wallet address)
  - Token verification middleware
- [ ] Create `src/lib/auth/session.ts`:
  - Server-side session management
  - Session cookie handling
- [ ] Create `src/app/api/auth/challenge/route.ts`:
  - Generate unique challenge nonce
  - Store temporarily for verification
- [ ] Create `src/app/api/auth/verify/route.ts`:
  - Verify signed message
  - Create session and return JWT
- [ ] Update `src/proxy.ts`:
  - Validate session token on protected routes
  - Extract user ID from token

**New files**:
```
src/lib/auth/
├── wallet-auth.ts
├── session.ts
└── middleware.ts
```

---

### 2.2 Update API Routes with Auth

**Location**: `src/app/api/`  
**Estimated**: 2-3 hours

**Tasks**:
- [ ] `src/app/api/jobs/route.ts`:
  - Replace `'temp-client-id'` with session user ID
  - Add authorization checks (client owns job)
- [ ] `src/app/api/jobs/[id]/route.ts`:
  - Validate user can access/modify job
- [ ] `src/app/api/workers/route.ts`:
  - Add rate limiting for worker search
- [ ] Create `src/app/api/users/me/route.ts`:
  - Get current user profile
  - Update profile endpoint
- [ ] Create `src/app/api/users/register/route.ts`:
  - First-time registration after wallet connect

---

## Phase 3: Complete UI Pages 🟠

### 3.1 Worker Jobs Page

**Location**: `src/app/(worker)/jobs/page.tsx`  
**Current**: Placeholder "coming soon..."  
**Estimated**: 4-5 hours

**Tasks**:
- [ ] Create job listing with filters (category, status, location)
- [ ] Implement job search functionality
- [ ] Add job detail modal/page
- [ ] Add "Apply for Job" action (requires escrow interaction)
- [ ] Show application status for applied jobs

---

### 3.2 Worker Profile Page

**Location**: `src/app/(worker)/profile/page.tsx`  
**Current**: Placeholder "coming soon..."  
**Estimated**: 4-5 hours

**Tasks**:
- [ ] Profile information form (name, bio, skills, hourly rate)
- [ ] Avatar upload (requires IPFS implementation)
- [ ] Skills management (add/remove tags)
- [ ] Availability toggle
- [ ] On-chain reputation display
- [ ] Credential verification section
- [ ] Job history with ratings

---

### 3.3 Find Workers Page (Client)

**Location**: `src/app/(client)/find-workers/page.tsx`  
**Current**: Placeholder "coming soon..."  
**Estimated**: 4-5 hours

**Tasks**:
- [ ] Worker search with filters (skill, rating, availability, location)
- [ ] Worker cards with reputation preview
- [ ] Worker detail view
- [ ] "Invite to Job" action
- [ ] Direct hire flow with escrow creation

---

### 3.4 Wire Up EscrowInteraction Component

**Location**: `src/components/contracts/EscrowInteraction.tsx`  
**Current**: TODO in handleDeposit/handleRelease  
**Estimated**: 3-4 hours

**Tasks**:
- [ ] Import and use `useContract('escrow')`
- [ ] Import and use `useTransaction()`
- [ ] Implement `handleDeposit()`:
  - Build deposit transaction
  - Sign with connected wallet
  - Submit and track confirmation
  - Update database with txHash
- [ ] Implement `handleRelease()`:
  - Query escrow UTxO
  - Build release transaction
  - Handle signature requirements
- [ ] Add `handleRefund()` for cancellations
- [ ] Add `handleDispute()` for disputes
- [ ] Transaction status indicators
- [ ] Error handling with user-friendly messages

---

## Phase 4: IPFS & External Services 🟡

### 4.1 Implement IPFS Upload

**Location**: `src/app/api/ipfs/upload/route.ts`  
**Current**: Returns 501 "not implemented"  
**Estimated**: 2-3 hours

**Tasks**:
- [ ] Implement Pinata SDK integration:
  ```typescript
  import PinataClient from '@pinata/sdk';
  const pinata = new PinataClient(apiKey, secretKey);
  ```
- [ ] File validation (size, type, security scan)
- [ ] Upload to IPFS and return CID
- [ ] Store IPFS reference in database
- [ ] Add avatar upload for user profiles
- [ ] Add credential document upload
- [ ] Add job attachment upload

**Environment**: Requires `PINATA_API_KEY`, `PINATA_SECRET_KEY`

---

### 4.2 Implement M-Pesa Webhook (Optional)

**Location**: `src/app/api/webhooks/mpesa/route.ts`  
**Current**: Logs and returns success  
**Estimated**: 4-6 hours

**Tasks**:
- [ ] Implement M-Pesa signature verification
- [ ] Parse transaction callback data
- [ ] Match to pending fiat-to-ADA conversion
- [ ] Trigger ADA purchase via exchange API
- [ ] Update transaction status
- [ ] Send notification to user

**Environment**: Requires M-Pesa credentials in `.env`

---

## Phase 5: Testing Infrastructure 🟡

### 5.1 Unit Tests for SDK

**Location**: New directory `packages/contracts-sdk/__tests__/`  
**Estimated**: 6-8 hours

**Tasks**:
- [ ] Set up Jest/Vitest for contracts-sdk
- [ ] Test datum serialization/deserialization
- [ ] Test transaction building (mock provider)
- [ ] Test address derivation
- [ ] Test all redeemer types

---

### 5.2 Integration Tests for API Routes

**Location**: New directory `src/__tests__/api/`  
**Estimated**: 4-6 hours

**Tasks**:
- [ ] Set up test database (Prisma test client)
- [ ] Test `/api/jobs` CRUD operations
- [ ] Test `/api/workers` queries
- [ ] Test `/api/reputation` queries
- [ ] Test authentication flow

---

### 5.3 E2E Tests for Critical Flows

**Location**: New directory `e2e/`  
**Estimated**: 8-10 hours

**Tasks**:
- [ ] Set up Playwright or Cypress
- [ ] Test wallet connection flow
- [ ] Test job posting flow
- [ ] Test job application flow
- [ ] Test escrow creation flow (testnet)
- [ ] Test milestone completion flow
- [ ] Test dispute flow

---

## Phase 6: Deployment & DevOps 🟢

### 6.1 Complete Deployment Scripts

**Location**: `scripts/deploy/`  
**Estimated**: 3-4 hours

**Tasks**:
- [ ] Enhance `deploy-testnet.ts`:
  - Reference script deployment
  - Generate and save script addresses
  - Verify deployment on explorer
- [ ] Implement `deploy-mainnet.ts`:
  - Add mainnet safety checks
  - Multi-sig deployment option
  - Deployment verification

---

### 6.2 Environment Configuration

**Tasks**:
- [ ] Create `.env.development` with testnet config
- [ ] Create `.env.production` with mainnet config
- [ ] Document all environment variables
- [ ] Add environment validation on startup

---

### 6.3 CI/CD Pipeline

**Location**: `.github/workflows/`  
**Estimated**: 4-6 hours

**Tasks**:
- [ ] Create `ci.yml`:
  - TypeScript type checking
  - ESLint
  - Unit tests
  - Build verification
- [ ] Create `deploy-preview.yml`:
  - Deploy PR previews to Vercel
- [ ] Create `deploy-production.yml`:
  - Manual trigger for mainnet deployment
  - Run E2E tests first

---

## Phase 7: Polish & UX 🟢

### 7.1 Error Handling

**Tasks**:
- [ ] Create global error boundary
- [ ] Add toast notifications for transactions
- [ ] Implement retry logic for failed transactions
- [ ] Add offline detection and handling

---

### 7.2 Loading States

**Tasks**:
- [ ] Add skeleton loaders for all data fetches
- [ ] Add transaction pending indicators
- [ ] Implement optimistic updates

---

### 7.3 Accessibility

**Tasks**:
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation
- [ ] Test with screen reader
- [ ] Add focus indicators

---

## Technical Debt & Known Issues

### High Priority
1. **Type Safety**: `src/app/api/jobs/[id]/route.ts` missing `params` await for Next.js 15
2. **Category Enum Mismatch**: Prisma uses uppercase, TypeScript uses lowercase
3. **Missing Error Boundaries**: Contract interactions can fail silently

### Medium Priority
1. **No Rate Limiting**: API routes unprotected
2. **No Input Validation**: Request bodies not validated with Zod
3. **Missing Indexes**: Database queries may be slow

### Low Priority
1. **Missing Dark Mode**: Some components lack dark mode styles
2. **No Internationalization**: Hard-coded English strings

---

## Quick Reference: File → Task Mapping

| File | Primary Task |
|------|--------------|
| `src/hooks/useContract.ts` | 1.2 - Implement useContract |
| `src/lib/cardano/contracts.ts` | 1.3 - Implement contract builders |
| `src/app/api/jobs/route.ts` | 2.2 - Add authentication |
| `src/app/(worker)/jobs/page.tsx` | 3.1 - Worker jobs page |
| `src/app/(worker)/profile/page.tsx` | 3.2 - Worker profile page |
| `src/app/(client)/find-workers/page.tsx` | 3.3 - Find workers page |
| `src/components/contracts/EscrowInteraction.tsx` | 3.4 - Wire escrow UI |
| `src/app/api/ipfs/upload/route.ts` | 4.1 - IPFS upload |
| `packages/contracts-sdk/src/*/builder.ts` | 1.1 - Wire SDK |

---

## Definition of Done

A task is complete when:
- [ ] Code is written and compiles without errors
- [ ] TypeScript types are properly defined
- [ ] Unit tests pass (when applicable)
- [ ] Manual testing on testnet complete
- [ ] Code is reviewed and merged
- [ ] Documentation updated if needed

---

## Notes for Developers

### Running Smart Contract Tests
```bash
npm run contracts:test
# Or directly: aiken check (in contracts/ directory)
```

### Deploying to Testnet
```bash
# Ensure .env has BLOCKFROST_PROJECT_ID for preprod
npm run contracts:deploy:testnet
```

### Generating Prisma Client
```bash
npm run db:generate
npm run db:push  # For development
```

### Starting Development Server
```bash
npm run dev
```

---

*Document generated by comprehensive codebase analysis. Update as tasks are completed.*
