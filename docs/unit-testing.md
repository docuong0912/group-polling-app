# Mandatory Unit Testing Instructions

Unit tests are required for every unit of new code. This is a must, not an optional quality improvement: tests protect maintenance and make future changes and migrations safer.

## Requirements

- For every new function, hook, component, state transition, validator, persistence operation, or other independently testable unit, add unit tests for its behavior.
- When modifying an existing unit, add or update tests for every behavior changed or introduced. Do not treat coverage elsewhere as a substitute for tests of the changed behavior.
- Write tests alongside the implementation, in the existing test location and naming style (for example, `name.test.ts` or `name.test.tsx`). Keep each test focused on observable behavior and meaningful outcomes, not internal implementation details.
- Cover the unit's normal behavior and relevant edge cases, including invalid input, empty data, limits, and failure paths where applicable. Test state changes and boundary conditions explicitly.
- For UI units, test user-visible behavior and important interaction/accessibility states using the project's established test tools. Do not omit a UI unit because it is harder to test; identify and address any missing test capability rather than silently skipping the requirement.
- A unit is not complete until its tests pass. Run the relevant test file or suite, then the project's broader test command when appropriate. Also run the applicable lint, type-check, or build checks.
- Never weaken, delete, or skip a meaningful test just to make a change pass. If a requirement cannot be tested with the current setup, explain the blocker and resolve the test setup or ask for guidance before considering the work complete.

## Completion check

Before delivery, verify that every new or behaviorally changed unit has a corresponding test, run the tests, and report the checks performed. A code change without its required unit tests is incomplete.
