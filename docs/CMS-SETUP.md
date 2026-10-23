# CMS activation

The publishing workspace uses the existing Supabase Phone provider and Twilio
configuration. It does not use ADMIN_PASSWORD.

1. Run supabase/schema.sql in the project's Supabase SQL editor.
2. Visit /admin, request a one-time code, and complete sign-in. The first login
   creates a pending access request.
3. Bootstrap the first administrator once in the SQL editor, replacing the phone:

   ~~~sql
   insert into public.cms_users (user_id, display_name, phone, role, active)
   select id, 'Michael', phone, 'admin', true
   from auth.users
   where phone = '+19035550123'
   on conflict (user_id) do update
   set role = 'admin', active = true;
   ~~~

4. Reload /admin. Further access requests, roles, deactivation, and site
   assignments are managed from the Staff screen.

The first administrator is intentionally bootstrapped in SQL so an anonymous
visitor can never claim the initial admin role.

## TowBoatUS North Texas / TIDE

TowBoatUS operational content remains in the existing TIDE Supabase project.
Configure `TBUS_SUPABASE_URL`, `TBUS_SUPABASE_ANON_KEY`, and
`TBUS_SUPABASE_SERVICE_ROLE_KEY` in Vercel. The public page reads published
`tbus_*` records with the TIDE anonymous key. The shared CMS authenticates staff
against the primary CMS project, then proxies authorized TowBoatUS edits to
TIDE server-side; the TIDE service-role key is never sent to the browser.

## Prompt-driven Site Studio

`/studio` uses the same phone sign-in, roles, and per-site assignments as the
CMS, but it changes site source code rather than CMS content. Editors and site
managers can request a change; only directors and administrators can approve a
reviewed preview for production.

Add these server-only variables to the `td-multi` Vercel project for Production,
Preview, and Development:

~~~text
OPENAI_API_KEY=...
OPENAI_STUDIO_MODEL=gpt-6-astra
GITHUB_STUDIO_TOKEN=...
GITHUB_STUDIO_REPO=mptucker/td-multi
GITHUB_STUDIO_BASE_BRANCH=master
~~~

Use a fine-grained GitHub token restricted to `mptucker/td-multi` with:

- Contents: read and write
- Pull requests: read and write
- Deployments: read
- Commit statuses: read

Studio creates a separate `studio/...` branch and pull request for every
request. The repository's existing Vercel integration builds that branch. The
review screen discovers the Vercel URL from the commit status and keeps the
change out of production until a director or administrator clicks the explicit
approval button.

Studio's server-side allowlist blocks changes to authentication, API routes,
Supabase code and migrations, middleware, environment files, package files,
analytics, and deployment configuration. It accepts screenshots as context but
does not create images.

## Google Analytics reporting

The CMS Analytics tab uses the Google Analytics Data API with server-only
service-account credentials and the user's existing site assignments. Complete
the Google and Vercel configuration in
[`docs/GA4-CMS-ANALYTICS.md`](./GA4-CMS-ANALYTICS.md).
