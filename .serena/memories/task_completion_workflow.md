# Task Completion Workflow

After completing a task (feature, bug fix, refactor):

1. **Format Code**:
   ```bash
   pnpm run format
   ```

2. **Lint Code**:
   ```bash
   pnpm run lint
   ```
   Ensure no warnings/errors remain (strict linting is in place).

3. **Type Check**:
   ```bash
   pnpm run check-types
   ```

4. **Test**:
   - Run relevant unit/e2e tests within the modified service(s).
   - If a new feature was added, ensure a test was created.

5. **Build**:
   - Verify that the project builds successfully.
   ```bash
   pnpm run build
   ```
