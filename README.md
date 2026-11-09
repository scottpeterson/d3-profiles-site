# D3 WBB School Report Cards site

Static site for `profiles.thed3statlab.com`. Design and launch steps:
`~/projects/d3-bball-npi/docs/BACKEND_PLAN.md` and
`~/projects/d3-bball-npi/plans/profiles_launch.md`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Public landing page with the buy button |
| `signin.html` | Email sign-in; sign-in links land here, then open the app |
| `thanks.html` | Page Stripe returns to after payment |
| `app.html` | The report, built by `generate_school_profiles.py --app ~/projects/d3-profiles-site`. Holds no school data; loads it from Supabase after sign-in |
| `profiles-app.js` | Sign-in, data loading, and profile fetches |
| `config.js` | Supabase URL, public (anon) key, Stripe Payment Link, price label |
| `site.css` | Styles for the landing, sign-in, and thank-you pages |

## Run locally

```bash
cd ~/projects/d3-profiles-site && python3 -m http.server 8787
```

Then open http://localhost:8787. Supabase allows sign-in links back to this
address only while its redirect URLs list `http://localhost:8787/**`.

## Refresh the app page

```bash
cd ~/projects/d3-bball-npi && uv run python generate_school_profiles.py --app ~/projects/d3-profiles-site
uv run python publish_profiles.py
```

Update the program count on the landing page (411 for 2026-27) when it changes.
