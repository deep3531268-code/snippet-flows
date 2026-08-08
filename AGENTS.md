# SnippetFlow — Master Engineering Rules

You are the primary coding agent for the SnippetFlow project.

Your job is to implement features safely inside the existing architecture, not redesign the project unnecessarily.

Treat the existing codebase as the source of truth. Inspect before changing.

---

# 1. Core Principles

Always follow:

- DRY
- SOLID
- Reuse before creating
- Single Responsibility
- Strong TypeScript
- Minimal changes
- No speculative features
- No unnecessary abstractions
- No duplicate implementations

Prefer extending existing code over creating parallel systems.

If an existing component, hook, utility, repository, service, validator, or configuration already solves the problem, reuse it.

Never create a second implementation of an existing system.

---

# 2. Architecture

Use the existing feature architecture:

UI
↓
Server Action
↓
Service
↓
Repository
↓
Prisma

Do not bypass layers.

Rules:

- UI must not access Prisma.
- Components must not contain database logic.
- Server Actions handle authentication/input boundaries.
- Services contain business logic.
- Repositories contain database access.
- Shared utilities belong in shared modules.
- Feature-specific behavior stays inside its feature.

Do not move logic between layers unless there is a clear architectural reason.

---

# 3. Existing Project Systems

Before creating anything, check whether the functionality already exists.

Important existing systems include:

- Authentication
- Dashboard
- Snippets
- Collections
- Tags
- Universal Search
- Search Memory
- Recent Activity
- Settings
- Shared UI
- Shared hooks
- Prisma repositories/services
- Seed system

Reuse these systems.

Do not recreate them.

---

# 4. DRY Rules

Never duplicate:

- Database queries
- Prisma filters
- Validation
- Authentication checks
- Search normalization
- Configuration
- Defaults
- UI components
- Formatting functions
- Constants
- Types
- Business rules

If the same logic appears twice, consider extracting a reusable function.

Do not create abstractions merely because two pieces of code look similar. Extract only when the responsibility is genuinely shared.

---

# 5. Database Rules

Use Prisma.

Never:

- Use raw SQL unless explicitly approved.
- Concatenate SQL.
- Use SELECT *.
- Query the database directly from UI.
- Fetch entire tables and filter in JavaScript.
- Create N+1 queries.

Always:

- Scope by authenticated user first.
- Select only required fields.
- Reuse repository methods.
- Use existing relations/indexes where appropriate.
- Use parameterized Prisma queries.
- Keep database operations inside repositories.

For independent queries, use parallel execution where appropriate.

---

# 6. Schema Changes

Database changes require special handling.

If a feature can be implemented using the existing schema:

DO NOT modify Prisma.

If a new table, field, relation, or index is genuinely required:

STOP before modifying the schema.

Report briefly:

1. Why the schema change is required.
2. Proposed schema.
3. Required indexes.
4. Migration impact.
5. Storage impact.
6. Performance impact.

Wait for approval before applying the schema change.

Never silently introduce migrations.

---

# 7. Security

Never trust client input.

Always:

- Authenticate server operations.
- Use the authenticated user's ID.
- Validate input.
- Validate IDs.
- Validate enum/config values.
- Prevent unauthorized access.
- Scope database queries to the current user.

Never allow a client to provide an arbitrary user ID for authorization.

Prevent:

- SQL injection
- XSS
- Unauthorized data access
- Invalid database writes

Reuse existing authentication and validation utilities.

---

# 8. Configuration

Do not use magic numbers or scattered configuration.

Centralize configurable values such as:

- Limits
- Pagination sizes
- Debounce durations
- Retention limits
- Timeouts
- Thresholds
- Defaults
- Feature flags
- Ranking weights

Use the existing configuration pattern when one exists.

---

# 9. State Management

Avoid duplicated state.

Do not create multiple sources of truth for the same value.

Avoid unnecessary:

- useEffect synchronization
- state mirroring
- context providers
- client fetching
- localStorage copies

Respect the project's existing React lint rules, including:

`react-hooks/set-state-in-effect`

Prefer event-time updates and reusable state utilities where appropriate.

---

# 10. Persistence

Before using localStorage or database persistence, determine what the data actually represents.

Use database persistence for account-level data that should follow the user.

Use localStorage only for genuinely browser/device-specific state.

Never store the same preference in multiple places without a clear synchronization strategy.

Reuse:

`features/shared/hooks/use-local-storage`

when appropriate.

---

# 11. Performance

The application should remain usable with:

- 100K+ users
- 10K+ snippets per user

Rules:

- Avoid unnecessary database calls.
- Avoid duplicate requests.
- Avoid N+1 queries.
- Select minimal fields.
- Paginate large datasets.
- Parallelize independent queries.
- Avoid rendering unnecessarily large lists.
- Reuse existing queries.
- Do not add caching unless there is a real need.

Do not perform premature optimization.

---

# 12. Search Rules

The existing Universal Search architecture is the source of truth.

Reuse:

- Search configuration
- Query normalization
- Search service
- Search repository
- Search memory
- Ranking
- Highlighting

Never create another search system.

Do not add AI/vector/embedding search unless the milestone explicitly requires it.

---

# 13. Recent Activity Rules

The existing Recent Activity system is the source of truth for user interactions.

Reuse:

`features/recent`

Do not create another activity/history system.

Do not duplicate:

- Viewed tracking
- Copied tracking
- Recent queries
- Continue Working logic
- Recent snippets

---

# 14. Settings Rules

The existing/new Settings architecture is the single source of truth for user preferences.

Reuse the centralized:

- Settings types
- Configuration
- Defaults
- Validation
- Repository
- Service
- Actions

Do not create feature-specific persistence for settings.

Do not invent settings that the current milestone does not require.

---

# 15. UI/UX

Preserve the existing SnippetFlow design system.

Reuse:

- Cards
- Buttons
- Inputs
- Dialogs
- Badges
- Tabs
- Empty states
- Skeletons
- Icons
- Typography
- Design tokens

Do not redesign unrelated areas.

If an existing component is close but needs feature-specific behavior, prefer composition/wrappers over modifying shared components unnecessarily.

Avoid:

- Huge empty containers
- Excessive nested cards
- Duplicated UI
- Unnecessary animations
- Inconsistent spacing

Keep interfaces compact and developer-focused.

---

# 16. Accessibility

Maintain existing accessibility.

Use:

- Semantic HTML
- Keyboard navigation
- Focus management
- Focus-visible states
- ARIA where necessary
- Accessible labels
- Screen-reader-friendly states

Do not sacrifice accessibility for visual effects.

---

# 17. Code Size

Keep files focused.

Prefer files under approximately:

`300–350 lines`

If a file becomes too large:

- Separate responsibilities.
- Extract reusable components/functions.
- Do not simply continue adding code to the same file.

Avoid "God components" and "God services."

---

# 18. Reuse Existing Code

Before creating a new:

- component
- hook
- utility
- service
- repository
- validator
- type
- configuration

search the project first.

If an existing implementation can reasonably be reused, use it.

Do not duplicate functionality under a new name.

---

# 19. Read / Investigation Efficiency

Be token-efficient.

Before implementation:

1. Identify relevant files.
2. Read only what is necessary.
3. Understand existing architecture.
4. Implement.

Do not repeatedly reread identical files.

Do not spend excessive time producing a theoretical architecture report when the existing architecture is already clear.

Do not investigate unrelated features.

---

# 20. Milestone Boundaries

This is extremely important.

Implement ONLY the requested milestone.

If the milestone is a foundation:

DO NOT build the complete feature on top of it.

If the milestone is UI:

DO NOT redesign backend architecture.

If the milestone is a hotfix:

DO NOT refactor unrelated code.

Do not silently expand scope.

When the milestone's completion criteria are met:

STOP.

---

# 21. No Speculative Features

Do not add features because they might be useful later.

Examples:

Do NOT add:

- AI
- analytics
- notifications
- vector search
- team functionality
- billing
- advanced caching

unless the current milestone explicitly requires them.

Future-proof through clean extension points, not unused code.

---

# 22. Browser / UI Testing Policy

Do NOT launch:

- Chrome
- Chromium
- Playwright
- Puppeteer

Do not perform browser-based UI testing.

Do not claim:

- "UI verified"
- "browser tested"
- "confirmed visually"

unless explicitly allowed by a future milestone.

For implementation validation, use code-level checks only.

Report:

> Implementation completed successfully. Manual UI verification is recommended.

---

# 23. Validation

After implementation:

Run:

- ESLint on modified files.
- TypeScript checks relevant to modified files.

Report pre-existing errors separately.

Do not fix unrelated existing errors unless explicitly requested.

Do not expand scope to clean unrelated technical debt.

---

# 24. Seed / Development Data

The existing development seed is the source of truth for realistic local data.

Reuse the existing seed architecture.

Seed data should remain:

- deterministic
- idempotent
- realistic
- relationally correct

Do not add random data directly into application code.

If a feature needs seed data, update the existing seed system.

---

# 25. Error Handling

Use existing error-handling patterns.

Every new server operation should handle:

- authentication failure
- validation failure
- missing resources
- database errors

Do not expose sensitive database/internal errors directly to users.

Reuse existing error utilities.

---

# 26. File Changes

Keep changes focused.

Before modifying a file, determine whether it is actually necessary.

Do not modify unrelated files.

Do not reformat entire files unnecessarily.

Do not change naming/style conventions without reason.

Remove obsolete code when replacing an implementation.

Never leave two competing implementations active.

---

# 27. When Requirements Are Ambiguous

Prefer the existing project architecture and conventions.

Do not invent a large new architecture.

If a decision materially affects:

- database schema
- security
- public API
- data migration
- existing architecture

STOP and ask before making the irreversible change.

For small implementation decisions, choose the simplest option consistent with the project.

---

# 28. Milestone Prompt Format

Future milestone prompts will intentionally be short.

Each milestone will specify only:

- Goal
- Scope
- Important constraints
- Files/areas
- Completion criteria
- Return format

Follow this master document for all other engineering rules.

Do not ask the user to repeat rules already defined here.

---

# 29. Required Completion Report

Keep the final report concise.

Use:

1. Architecture decisions
2. Implementation
3. Files created
4. Files modified/deleted
5. Existing code reused
6. Database/schema decisions
7. Validation
8. Completion summary

Do not provide a long essay.

---

# Final Rule

Build the smallest clean solution that fits the existing SnippetFlow architecture.

Reuse first.

Change only what is necessary.

Do not invent.

Do not duplicate.

Do not expand scope.

When the requested milestone is complete, STOP.