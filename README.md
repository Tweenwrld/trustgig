# TrustGig

A decentralized gig economy platform built on Cardano blockchain, enabling trustless transactions between clients and artisans.

## 🏗️ Architecture

TrustGig is a monorepo project with the following structure:

- **`contracts/`** - Aiken smart contracts (escrow, reputation, multisig, dispute, credentials)
- **`packages/`** - Shared TypeScript packages
  - `contracts-sdk` - TypeScript SDK for interacting with smart contracts
  - `shared-types` - Shared type definitions
  - `config` - Shared configuration (ESLint, TypeScript, Tailwind)
- **`src/`** - Next.js 16 web application
- **`prisma/`** - Database schema and migrations
- **`scripts/`** - Deployment and utility scripts

## 🚀 Features

- **Smart Contract Escrow** - Secure job payments with milestone-based releases
- **Reputation System** - On-chain reputation tracking for artisans
- **Dispute Resolution** - Mediator-based conflict resolution
- **Credential Verification** - Artisan certification management
- **Wallet Integration** - Support for Nami, Eternl, and other Cardano wallets
- **M-Pesa Integration** - Fiat on-ramp for African markets

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- [Aiken](https://aiken-lang.org/installation-instructions) for smart contract development
- [Blockfrost](https://blockfrost.io) API key

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/trustgig/trustgig.git
   cd trustgig
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Compile smart contracts**
   ```bash
   npm run contracts:build
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 📦 Smart Contracts

### Validators

- **Escrow** - Manages job payments with deposit/release/refund logic
- **Reputation** - Updates artisan scores after job completion
- **Multisig** - Committee approval for governance decisions
- **Dispute** - Mediator resolution for conflicts
- **Credentials** - Artisan certification verification

### Compile Contracts

```bash
npm run contracts:build
```

### Deploy to Testnet

```bash
npm run contracts:deploy:testnet
```

## 🗄️ Database

The project uses Prisma ORM with PostgreSQL.

### Generate Prisma Client

```bash
npm run db:generate
```

### Run Migrations

```bash
npm run db:migrate
```

### Open Prisma Studio

```bash
npm run db:studio
```

## 🌐 Web Application

Built with Next.js 16, featuring:

- **Partial Pre-Rendering (PPR)** for optimal performance
- **Turbopack** for faster builds
- **Server Components** for efficient data fetching
- **MeshJS** for Cardano blockchain integration

### Routes

- `/connect` - Wallet connection
- `/dashboard` - Worker dashboard
- `/jobs` - Browse available jobs
- `/post-job` - Create new job (client)
- `/profile` - User profile management

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run type-check       # TypeScript type checking

# Smart Contracts
npm run contracts:build  # Compile Aiken contracts

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Utilities
npm run utils:generate-addresses  # Generate test wallet addresses
```

## 🧪 Testing

### Contract Testing

```bash
cd contracts
aiken check
```

### Integration Tests

```bash
npm test
```

## 🚢 Deployment

### Testnet Deployment

1. Fund your wallet with testnet ADA from the [faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)
2. Deploy contracts:
   ```bash
   npm run contracts:deploy:testnet
   ```

### Mainnet Deployment

1. Ensure all contracts are thoroughly tested
2. Update environment to mainnet
3. Deploy contracts:
   ```bash
   npm run contracts:deploy:mainnet
   ```

## 📚 Documentation

- [Aiken Documentation](https://aiken-lang.org)
- [MeshJS Documentation](https://meshjs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

Apache-2.0

## 🔗 Links

- [Website](https://trustgig.io)
- [Documentation](https://docs.trustgig.io)
- [Discord](https://discord.gg/trustgig)
- [Twitter](https://twitter.com/trustgig)

## 💡 Support

For support, email support@trustgig.io or join our Discord community.
