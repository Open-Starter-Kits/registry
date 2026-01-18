# Open Starter Kits Governance

This document defines how the Open Starter Kits ecosystem is governed, ensuring quality, sustainability, and clarity.

---

## Roles

### Core Maintainers
- Own and manage the registry
- Approve or reject new starter kits
- Maintain schemas and validation tooling
- Resolve disputes and make final decisions

### Kit Maintainers
- Own specific starter kits
- Keep kits functional and up-to-date
- Respond to issues and PRs
- Update metadata when necessary

### Contributors
- Submit kits or improvements
- Follow contribution standards

---

## Decision Making

- Schema changes require Core Maintainer approval
- New kits require at least one Core Maintainer review
- Emergency decisions may be made by a single Core Maintainer

---

## Kit Lifecycle

Each kit has a status:

- `experimental` — early-stage, limited guarantees
- `active` — maintained and recommended
- `deprecated` — no longer recommended but available
- `unmaintained` — no active maintainer

**Kits are never deleted** unless legally required.

---

## Maintainer Responsibilities

Maintainers must:

- Ensure the kit builds and runs
- Update metadata when major changes occur
- Mark kits as `unmaintained` if support stops
- Communicate clearly with contributors

Failure to maintain a kit may result in reassignment.

---

## Conflict Resolution

Conflicts are resolved in the following order:

1. Discussion among involved parties
2. Core Maintainer decision
3. Final ruling by project lead (if necessary)

---

## Governance Changes

This document may be updated by Core Maintainers. All changes must be documented via pull request.
