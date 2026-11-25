import { createLink } from './actions';

const ERRORS = {
  invalid: 'That does not look like a valid phone number. Use digits, with an optional + at the start.',
  rate: 'Too many links created from your network recently. Please try again later.',
  server: 'Something went wrong on our side. Please try again.',
};

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const error = ERRORS[sp?.error];

  return (
    <>
      <h1>Phone Link</h1>
      <p>Enter a phone number and get a private link. Only people who have the link can see the number.</p>

      {error && <div className="msg err">{error}</div>}
      {sp?.deleted && <div className="msg ok">Your link was deleted.</div>}

      <form action={createLink} className="card">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" placeholder="+372 5555 5555" required autoComplete="off" />
        {/* Honeypot field for bots */}
        <input className="hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button type="submit">Generate link</button>
      </form>

      <p className="small">
        Links are permanent until you delete them. There is no public list or search of numbers. Anyone who has
        a link can share it, so only create links for numbers you are allowed to share.
      </p>
    </>
  );
}
