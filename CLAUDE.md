# CLAUDE.md

## Repository Guidelines

This repository contains production-grade React component libraries.

## Pull Request Guidelines

- Review every pull request for:
  - Correctness
  - Type safety
  - Performance
  - Accessibility
  - API consistency
  - Backward compatibility
  - Bundle size impact
  - Documentation updates

- Flag any unnecessary complexity or duplicated code.
- Suggest simpler implementations when possible.
- Ensure public APIs remain consistent.

## Branch Naming

Feature branches must start with:

v_x.y.z or v_x.y.z_<description>

Examples:

v_3.4.1_add-date-picker
v_1.2.10_fix-autocomplete-validation
v_2.5.1_refactor-form-provider

## Pull Request Title

PR titles must follow:

vX.Y.Z - <message>

Examples:

v4.2.0 - Add AsyncAutocomplete component
v4.2.1 - Fix DatePicker validation
v5.0.0 - Migrate to MUI v8

If the title doesn't follow this format, suggest a corrected title.

## Merge Strategy

Always recommend **Squash and Merge**.

The final squash commit message should match the PR title.

## Code Style

- Prefer TypeScript over `any`
- Avoid breaking changes unless intentionally releasing a major version
- Reuse existing utilities before introducing new ones
- Keep components composable
- Avoid unnecessary re-renders
- Preserve tree-shakeability
- Follow existing project patterns

## Documentation

Whenever a public API changes, raise a PR with:
- Updated documentation
- Updated demo examples
- Updated changelog when applicable in `changelog/vX.md` where `X` is the version number.

## Testing

Verify:

- Existing tests continue to pass
- New behavior has adequate test coverage
- Edge cases are considered

## Before Approving

Ensure:

- No TypeScript errors
- No lint errors
- No dead code
- No console.log statements
- No commented-out code
- No unnecessary dependencies

If anything above fails, request changes instead of approving.