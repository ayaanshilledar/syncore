

# Project Development Rules

## Core Principles

* Keep implementations minimal and straightforward.
* Fix the root cause, not the symptom.
* Do not introduce unnecessary abstractions, dependencies, utilities, or files.
* Prefer existing project patterns over creating new patterns.
* Before changing code, understand the existing architecture and data flow.
* Do not modify configuration or infrastructure files unless the change is required.
* Avoid over-engineering. Build only what is needed.

## Code Quality

* No AI-generated comments, explanatory comments, or unnecessary inline comments.
* Code should be self-explanatory through clear naming and structure.
* Do not add comments just to explain obvious code.
* Do not leave TODOs, temporary hacks, debug logs, or dead code.
* Do not duplicate existing logic when it can reasonably be reused.
* Keep functions and components focused on a single responsibility.

## File Size

* Keep every source file under **300 lines** whenever reasonably possible.
* If a file approaches 300 lines, split it by responsibility.
* Do not split files artificially just to satisfy the limit.
* Prefer small, focused modules over large monolithic files.

## Project Structure

* Follow a predictable and consistent folder structure.
* Place files according to responsibility, not convenience.
* Keep feature-specific code close to the feature that uses it.
* Separate UI, business logic, data access, utilities, and types when they become meaningfully complex.
* Avoid dumping unrelated components or utilities into generic folders.
* Do not create unnecessary `utils`, `helpers`, `services`, or `components` files without a clear reason.

## Naming Conventions

* Use clear, descriptive names.
* Components: `PascalCase`.
* Hooks: `useSomething`.
* Functions and variables: `camelCase`.
* Constants: `UPPER_SNAKE_CASE` only when appropriate.
* Files should follow the existing project convention consistently.
* Avoid vague names such as `data`, `thing`, `helper`, `misc`, or `temp`.

## Architecture

* Understand the existing architecture before introducing changes.
* Keep business logic out of presentation components when it becomes non-trivial.
* Keep API/database logic separate from UI code.
* Reuse existing abstractions before creating new ones.
* Do not create abstractions for one-off operations.
* Prefer composition over deeply nested or overly generic abstractions.

## Changes

* Make the smallest change that correctly solves the problem.
* Do not rewrite working code unnecessarily.
* Do not change unrelated files.
* Do not introduce formatting changes across unrelated code.
* Preserve existing behavior unless the task explicitly requires changing it.
* When fixing a bug, identify and fix the underlying cause rather than adding a workaround.

## Dependencies

* Do not add a dependency when the existing stack can solve the problem cleanly.
* Check whether a package is already installed before adding another one.
* Do not introduce multiple libraries for the same responsibility.

## Before Finishing

* Check the files you changed.
* Remove unused imports and variables.
* Remove debug code and temporary changes.
* Run linting and type checking when available.
* Run the relevant build/test command when practical.
* Ensure the implementation follows the existing project structure and conventions.


