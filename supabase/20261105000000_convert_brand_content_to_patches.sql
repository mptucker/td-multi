-- Keep Git as the complete, versioned site model and store only intentional
-- CMS overrides. This prevents an older full CMS document from rolling a site
-- back after a redesign ships. The previous documents are retained as
-- restorable revisions before conversion.

-- Anonymous site reads need the published patch, never an unpublished draft.
-- RLS filters rows, not columns, so restrict the anon role at the column level.
revoke select on table brand_content from anon;
grant select (brand, content, published_at, updated_at) on table brand_content to anon;

insert into content_revisions (entity_type, entity_id, brand, snapshot, action)
select
  'brand_content',
  brand,
  brand,
  jsonb_build_object('content', content, 'draft_content', draft_content),
  'baseline_patch_migration'
from brand_content
where coalesce(content ->> '__cmsPatch', '') <> '1';

-- Lighthouse's versioned model was rebuilt after the stored CMS document. The
-- only newer unpublished edit is the uploaded hero image; preserve it as the
-- draft while making the current Git model the published baseline.
update brand_content
set
  content = '{"__cmsPatch":1}'::jsonb,
  draft_content = jsonb_build_object(
    '__cmsPatch', 1,
    'home', jsonb_build_object(
      'heroImage', jsonb_build_object(
        'src', coalesce(
          draft_content #> '{home,heroImage,src}',
          content #> '{home,heroImage,src}'
        )
      )
    )
  )
where brand = 'lighthouse'
  and coalesce(content ->> '__cmsPatch', '') <> '1';

-- Water Taxi's CMS values contain later operational route and surcharge edits.
-- Retain only those exact fields, allowing all other Git changes to flow through.
update brand_content
set
  content = jsonb_build_object(
    '__cmsPatch', 1,
    'plan', jsonb_build_object(
      'arrival', jsonb_build_object('body', content #> '{plan,arrival,body}'),
      'directions', content #> '{plan,directions}',
      'essentials', content #> '{plan,essentials}'
    ),
    'rules', jsonb_build_object('policyNote', content #> '{rules,policyNote}')
  ),
  draft_content = jsonb_build_object(
    '__cmsPatch', 1,
    'plan', jsonb_build_object(
      'arrival', jsonb_build_object('body', coalesce(draft_content, content) #> '{plan,arrival,body}'),
      'directions', coalesce(draft_content, content) #> '{plan,directions}',
      'essentials', coalesce(draft_content, content) #> '{plan,essentials}'
    ),
    'rules', jsonb_build_object('policyNote', coalesce(draft_content, content) #> '{rules,policyNote}')
  )
where brand = 'water-taxi'
  and coalesce(content ->> '__cmsPatch', '') <> '1';

-- These records either match Git or contain legacy fields that their custom
-- homepages no longer render, so they need no override payload.
update brand_content
set
  content = '{"__cmsPatch":1}'::jsonb,
  draft_content = '{"__cmsPatch":1}'::jsonb
where brand in ('paradise', 'boaterwise', 'towboatus-ntx', 'texomaco')
  and coalesce(content ->> '__cmsPatch', '') <> '1';

-- Git contains the later operational verification for these two facts. Keep
-- Supabase aligned so enabling live CMS reads cannot reintroduce retired
-- rollaway pricing or the former private water-taxi rate.
update facts
set
  label = 'Children under six',
  value = 'Stay free when sharing the existing king bed',
  last_verified = '2026-09-10',
  notes = 'Rollaway offer removed from public copy pending product and fee review.'
where key = 'sundance.rollaway';

update facts
set
  value = '$25/person each way Highport ↔ islands · $150/hr private (up to 6)',
  last_verified = '2026-09-07',
  source_url = 'https://texomawatertaxi.com/'
where key = 'watertaxi.rates';
