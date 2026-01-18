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
├── kits/ # JSON metadata for each starter kit
├── schemas/ # JSON schema definition
├── scripts/ # Validation scripts
├── CONTRIBUTING.md # How to contribute
├── GOVERNANCE.md # Governance rules
└── README.md
```


---

## How to Contribute

1. Prepare a starter kit repository following the required standards.
2. Add a metadata file in `kits/<type>/<kit-slug>.json` using the schema in `schemas/kit.schema.json`.
3. Submit a pull request following [CONTRIBUTING.md](CONTRIBUTING.md).

All PRs are validated automatically.

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
