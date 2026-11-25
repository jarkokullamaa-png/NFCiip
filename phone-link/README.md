# Phone Link

A tiny website where anyone can enter a phone number and get a private, permanent link that shows it.

- No public list, search or directory of numbers.
- Each link uses a random 72-bit id, so it cannot be guessed.
- The creator gets a separate private management page to change or delete the number.
- Pages are marked `noindex` and send no referrer.
- Rate limit of 10 new links per hour per network, plus a honeypot field and a report page.

Stack: Next.js (App Router) + Supabase (database) + Vercel (hosting).

## Setup

### 1. Supabase
1. Create a free project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase.sql` and run it.
3. Go to **Project Settings -> API** and copy the **Project URL** and the **service_role** key.

### 2. Run locally
```bash
cp .env.example .env.local   # then fill in the three values
npm install
npm run dev
```
Open http://localhost:3000.

### 3. Deploy on Vercel
1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Add the three environment variables from `.env.example` in the project settings.
4. Deploy. Add a custom domain later if you want a shorter link.

## Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret. It is only used on the server. Row Level Security is enabled with no policies, so the public key cannot read any numbers.
- Reports are stored in the `reports` table. To remove a reported number, delete the matching row (`id` = the reported link id) from `links` in the Supabase dashboard.
- Anyone with a share link can pass it on. The link is the permission to see the number.
