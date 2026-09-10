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
