# src/lib/claude-md/

Behavioral template content, validation, and rendering. The future `install` command consumes `renderTemplate(template)` to write `~/.claude/CLAUDE.md` on the user's machine.

## Content

- `claude-md-template.json`: behavioral rules grouped by section. Schema below.
- `claude-md-template.js`: imports the JSON via `with { type: 'json' }` and re-exports it as `template`.

## Public functions

- `validateTemplate(template)`: pure. Throws `InvalidTemplateError` on schema mismatch with a message indicating the offending path (e.g. `sections[2].rules[0].directive`). Returns the template on success.
- `renderTemplate(template)`: pure. Receives a validated template, returns a markdown string.

The remaining exports (`validateSection`, `validateRule`, `validateRuleExample`, `renderSection`, `renderRule`, `renderRuleExample`, `isObject`, `isNonEmptyString`, `isNonEmptyArray`) are implementation details kept in their own files for SRP and testability.

## Schema

```
{
  version: string,
  sections: Array<{
    id: string,
    title: string,
    rules: Array<{
      directive: string,
      rationale?: string,
      example?: { bad: string, good: string }
    }>
  }>
}
```

The JSON `version` field is independent from the package version. The future `update` command will compare installed vs available template versions to decide merge behavior.

## Output format

`# Agent rules` heading, sections as `##`, rules as a bullet list. Optional `rationale` renders as an indented blockquote (`  > `); optional `example` renders as an indented `Example:` block with `❌ <bad>` and `✓ <good>` lines.
