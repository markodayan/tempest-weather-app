# Commit Message Convention

This repo follows [Conventional Commits](https://www.conventionalcommits.org/), adapted with scopes specific to this project. It exists so the commit history itself documents progress against `docs/assignment-instructions.md` and `docs/strategy.md` (well-structured commit history is one of the assignment's bonus points).

## Format

```
<type>(<scope>): <summary>

<optional body>
```

- **summary**: imperative mood ("add", not "added"/"adds"), lowercase, no trailing period, ideally under ~70 characters.
- **body** (optional): wrap around 72 chars. Explain *why*, not what — the diff already shows what changed. Use it for trade-offs, rejected alternatives, or context a reviewer wouldn't get from the code alone.

## Types

| Type       | Use for                                                              |
|------------|-----------------------------------------------------------------------|
| `feat`     | A new user-facing feature (e.g. search suggestions, unit toggles)     |
| `fix`      | A bug fix                                                              |
| `refactor` | Code change that changes neither behavior nor public API              |
| `style`    | Formatting/whitespace only — not CSS/visual changes (those are `feat`/`fix`) |
| `test`     | Adding or adjusting tests                                              |
| `docs`     | Documentation only (`docs/`, `README.md`, `CLAUDE.md`)                 |
| `chore`    | Tooling, dependencies, config that isn't a build-output change         |
| `build`    | Changes to the build system itself (Vite, tsconfig, bundling)          |
| `perf`     | Performance improvement                                                |

## Scopes

Match the scope to the part of the app the commit touches. Common ones for this project:

- `app` — top-level app shell / layout
- `search-bar` — the `SearchBar` component (search input, suggestions, preference toggles)
- `weather-days` — the `WeatherDays` component (7-day tile grid)
- `weather-detail` — the `SelectedDayReport` component
- `geocode` / `forecast` — Open-Meteo data-layer code for each API
- `playground` — the `playground/` sandbox
- `config` — eslint/tsconfig/vite config not covered by `build`
- `docs` / `planning` — planning and reference docs

If a commit doesn't cleanly fit one scope, prefer splitting the commit over inventing a vague scope (e.g. `misc`).

## Examples

```
feat(search-bar): add debounced geocoding suggestions dropdown

fix(weather-grid): correct day index when selecting a past-day tile

chore(playground): add tsx-powered playground for exercising API code

docs(planning): add assignment brief, strategy, api, and component notes
```

## Guidelines

- One logical change per commit — if a change touches unrelated concerns (e.g. a dependency bump *and* a new component), split it.
- Prefer several small, reviewable commits over one large one, especially across a feature's lifecycle (e.g. `feat(search-bar): scaffold component` → `feat(search-bar): wire up geocoding` → `test(search-bar): add suggestion selection tests`).
- Reference the relevant `docs/` planning doc in the body when a commit resolves a `[TBC]` item or deviates from the documented plan.
