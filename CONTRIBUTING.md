# Contributing to Dev Starter Kits Registry

Thank you for your interest in contributing to Dev Starter Kits!  
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
- Be hosted under the Dev Starter Kits GitHub organization
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

Core maintainers may request changes or reject submissions.

---

## Code of Conduct

- Be respectful and constructive
- No spam, plagiarism, or low-quality submissions
- Maintain professionalism in discussions and reviews

---

## Questions

If unsure, open a GitHub Discussion before submitting a PR.
