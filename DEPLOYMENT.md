# Independent deployment

## Supabase

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication > Users, create the single administrator account.
4. Copy the project URL, anon key and service role key from Project Settings > API.

## Vercel

1. Import this GitHub repository into Vercel.
2. Add the four variables shown in `.env.example`.
3. Deploy, then optionally attach a custom domain.

Never commit the service role key or any `.env.local` file.
