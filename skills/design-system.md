# Design System Skill

## Purpose

Use the design system as an implementation constraint and shared vocabulary when building React UI. The goal is not to create a separate design-system product; it is to make design-system decisions explicit while implementing the UI.

## Principle

> Design system is a skill to apply, not a separate application to build.

## Rules

1. Prefer existing UI patterns before inventing new ones.
2. Keep layout, spacing, typography, interaction, and visual hierarchy consistent.
3. Give repeated UI concepts stable names and reusable components.
4. Keep state decisions separate from visual styling decisions.
5. Avoid premature abstraction: extract a component when repetition or a meaningful UI concept appears.
6. Keep the smallest implementation that preserves consistency.
7. When a design decision matters, document it in the code or README rather than creating unnecessary files.

## React-specific checklist

- **Layout:** use a small, consistent spacing vocabulary.
- **Typography:** establish clear heading/body/caption hierarchy.
- **Color:** use semantic roles rather than arbitrary per-element colors.
- **Components:** reuse repeated interaction patterns.
- **State:** use React state for UI values that change over time and affect rendering.
- **Responsive behavior:** define behavior by layout needs, not device names.
- **Accessibility:** preserve keyboard access, focus visibility, labels, and semantic HTML.
- **Feedback:** loading, success, error, and disabled states should follow the same interaction language.

## Decision rule

Before adding a new visual or component pattern, ask:

1. Does an existing pattern already solve this?
2. Is this pattern likely to repeat?
3. Does naming it improve implementation clarity?
4. Can it remain local until repetition justifies extraction?

## Scope

This skill applies to LT-react implementations and examples. It does not require a standalone design-token repository, component library, or design-system framework unless the project actually needs one.
