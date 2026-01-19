# Contributing to Open Starter Kits Registry

Thank you for your interest in contributing to Open Starter Kits!  
This project maintains a **high-quality registry of production-ready starter kits**. Please read this document carefully before submitting a contribution.

---

## What You Can Contribute

You may contribute by:

- Adding a new starter kit to the registry
- Maintaining an existing starter kit
- Improving documentation, validation scripts, or tooling

---

## Starter Kit Acceptance Criteria

A starter kit **must**:

- Be production-ready and fully functional (not a demo or tutorial)
- Include clear setup and usage instructions
- Be hosted under the Open Starter Kits GitHub organization
- Have at least one active maintainer

Low-effort, incomplete, or broken kits **will be rejected**.

---

## Repository Structure

This repository contains the **registry metadata only**. Actual starter kit code resides in separate repositories.

```bash
registry/
└── kits/
└── <type>/
└── <kit-slug>.json
```


---

## Metadata Requirements

Each starter kit must include a metadata file that:

- Fully complies with `schemas/kit.schema.json`
- Uses a unique `slug`
- Points to a valid GitHub repository
- Includes accurate stack, features, and status information

Schema validation is enforced automatically using CI.

---

## Contribution Process

### 1. Prepare Your Starter Kit
- Create or transfer the kit repository into the organization
- Ensure it builds and runs successfully
- Add a proper README and `env.example`

### 2. Add Metadata
- Create a JSON file under `kits/<type>/`
- Follow the `kit.schema.json` schema exactly

### 3. Submit a Pull Request
- One kit per PR
- PR title format: `Add <kit-name> starter kit`
- Include a description of:
  - The problem the kit solves
  - The maintainer(s)
  - Why it should be included

---

## Validation & Review

All PRs are automatically checked for:

- Schema compliance
- Required fields
- Naming conventions
- Repository accessibility
- Unique slugs across all kits
- Proper directory structure
- Valid date and URL formats

### Pre-submission Validation

Before submitting your PR, run the validation locally:

```bash
# Validate your kit file
node scripts/validate.js kits/<type>/<your-kit-slug>.json

# Validate all kits to check for slug conflicts
node scripts/validate.js
```

### CI/CD Workflow

- **On PR creation/open**: The `validate-pr.yml` workflow runs automatically to validate all changed kit files
- **On PR merge**: The `generate-index.yml` workflow validates all kits and regenerates `index.json`

If validation fails, the PR cannot be merged. Fix any errors and push again.

Core maintainers may request changes or reject submissions.

---

## Code of Conduct

- Be respectful and constructive
- No spam, plagiarism, or low-quality submissions
- Maintain professionalism in discussions and reviews

---

## Questions

If unsure, open a GitHub Discussion before submitting a PR.
