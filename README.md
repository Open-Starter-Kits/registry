# Open Starter Kits Registry

Welcome to **Open Starter Kits** — the largest open-source registry of production-ready starter kits for developers.  
Our goal is to save developers time by providing **ready-to-use, fully integrated project templates** across multiple tech stacks and domains.

---

## Why Open Starter Kits?

Starting a new project can be time-consuming:

- Setting up authentication, payments, and database integrations
- Configuring project structure and CI/CD
- Choosing the right stack and conventions

**Open Starter Kits** solves this by providing:

- Production-ready starter templates
- Pre-integrated common features (auth, payments, subscriptions, RBAC, email, etc.)
- Structured, well-documented, and maintained kits
- Easy discovery by project type, stack, and features

---

## Organization Structure

This registry repository contains **metadata only**. Actual starter kits live in their own repositories under the organization.

```bash
registry/
├── kits/           # JSON metadata for each starter kit
│   ├── saas/       # SaaS kits
│   ├── api/        # API kits
│   └── mobile/     # Mobile kits
├── schemas/        # JSON schema definitions
│   └── kit.schema.json
├── scripts/        # Validation and utility scripts
│   ├── validate.js
│   └── generate-index.js
├── .github/        # GitHub workflows
│   └── workflows/
│       ├── validate-pr.yml
│       └── generate-index.yml
├── index.json      # Generated index of all kits
├── CONTRIBUTING.md # How to contribute
├── GOVERNANCE.md   # Governance rules
└── README.md
```


---

## How to Contribute

1. Prepare a starter kit repository following the required standards.
2. Add a metadata file in `kits/<type>/<kit-slug>.json` using the schema in `schemas/kit.schema.json`.
3. Submit a pull request following [CONTRIBUTING.md](CONTRIBUTING.md).

All PRs are validated automatically.

## Validation & CI/CD

This repository uses automated validation and continuous integration to ensure metadata quality:

### Local Validation

Before submitting a PR, validate your kit metadata locally:

```bash
# Validate all kits
node scripts/validate.js

# Validate a specific kit
node scripts/validate.js kits/saas/nextjs-saas-starter.json

# Validate all kits in a category
node scripts/validate.js kits/saas/
```

The validation script checks for:
- Schema compliance (required fields, types, formats)
- Unique slugs across all kits
- Valid repository URLs
- Proper date format (YYYY-MM-DD)
- Type/enum value correctness
- Directory structure alignment

### Index Generation

The `index.json` file is automatically generated from all kit metadata:

```bash
node scripts/generate-index.js
```

This creates a comprehensive index containing:
- Total kit count and category distribution
- Difficulty and status breakdowns
- All unique tags and technology stacks
- Sorted list of all kits with key metadata

### Automated Workflows

- **PR Validation** (`validate-pr.yml`): Runs on every pull request to validate changed kit files
- **Index Generation** (`generate-index.yml`): Automatically regenerates `index.json` when kits are merged to main

The index is committed back to the repository automatically on merge.

---

## Kit Discovery

Starter kits can be browsed or filtered by:

- **Type:** saas, marketplace, api, dashboard, mobile, cli, ai, blockchain
- **Stack:** frontend, backend, database, infrastructure
- **Features:** auth, payments, subscriptions, RBAC, email, file uploads
- **Difficulty:** beginner, intermediate, advanced

---

## Maintainers & Governance

See [GOVERNANCE.md](GOVERNANCE.md) for the governance model, kit lifecycle, and role definitions.

---

## License

This registry and associated scripts are licensed under **MIT License**.
