# Kick Start Records Store

## Set up

Install Supabase client

```bash
npm i @supabase/supabase-js
```

To use a schema, e.g., "product" with Supabase, you need to create your schema, then run the following to make it accessible from the supabase client:

```
GRANT USAGE ON SCHEMA product TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA product TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA product TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA product TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA product GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA product GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA product GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
```

Installed v3^ of TailwindCSS. v4 is out, but VS Code intellisense doesn't work right yet.
