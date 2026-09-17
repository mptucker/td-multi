-- Run once in the Supabase project backing td-multi's CMS.
-- Preserve the invited role and site assignments when a verified user signs in
-- or an administrator approves an already-present access request.
create or replace function cms_normalize_phone(raw_phone text) returns text
language sql immutable set search_path = public as $$
  select case
    when length(regexp_replace(raw_phone, '[^0-9]', '', 'g')) = 10
      then '+1' || regexp_replace(raw_phone, '[^0-9]', '', 'g')
    when length(regexp_replace(raw_phone, '[^0-9]', '', 'g')) = 11
      and left(regexp_replace(raw_phone, '[^0-9]', '', 'g'), 1) = '1'
      then '+' || regexp_replace(raw_phone, '[^0-9]', '', 'g')
    else null
  end
$$;

create or replace function cms_apply_invite(target_user_id uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare
  auth_phone text;
  invitation cms_invites%rowtype;
begin
  if auth.uid() is null or (target_user_id <> auth.uid() and not cms_is_admin()) then
    raise exception 'Not authorized to grant this invitation';
  end if;
  select cms_normalize_phone(phone) into auth_phone
  from auth.users where id = target_user_id and phone_confirmed_at is not null;
  if auth_phone is null then return false; end if;
  select * into invitation from cms_invites
  where cms_normalize_phone(phone) = auth_phone
  order by created_at desc limit 1 for update;
  if invitation.phone is null then return false; end if;
  insert into cms_users (user_id, display_name, phone, role, active)
  values (target_user_id, invitation.display_name, auth_phone, invitation.role, true)
  on conflict (user_id) do update set display_name = excluded.display_name, phone = excluded.phone, role = excluded.role, active = true;
  delete from cms_user_sites where user_id = target_user_id;
  insert into cms_user_sites (user_id, brand)
  select target_user_id, unnest(invitation.sites)
  on conflict do nothing;
  delete from cms_invites where phone = invitation.phone;
  delete from cms_access_requests where user_id = target_user_id;
  return true;
end $$;
revoke all on function cms_apply_invite(uuid) from public;
grant execute on function cms_apply_invite(uuid) to authenticated;

create or replace function cms_claim_invite() returns boolean
language plpgsql security definer set search_path = public as $$
begin
  return cms_apply_invite(auth.uid());
end $$;
grant execute on function cms_claim_invite() to authenticated;

drop policy if exists "update own cms access request" on cms_access_requests;
create policy "update own cms access request" on cms_access_requests
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
