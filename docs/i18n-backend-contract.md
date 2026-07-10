# Internationalization contract for Edge Functions

The mobile client now sends `locale: "pt-BR" | "en"` to all generated-content functions.

## `generate-plan`

Input: `{ theme, days, locale }`. Return canonical Portuguese-independent book slugs already used by the app (for example `genesis`, `joao`, and `1corintios`). Generate `summary` in `locale`.

## `generate-daily`

Input: `{ theme, reference, passageText, day, totalDays, locale }`. Generate both `reflection` and `prayer` in `locale`; never translate or replace the supplied Bible passage.

## `report-content`

Input now includes `locale` alongside the existing report context. Store it with the report so reviewers can evaluate the generated text in the correct language.

Reject unsupported locale values and default missing locale values to `pt-BR` only for backward compatibility with older clients.
