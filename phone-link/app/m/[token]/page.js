import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { db, sha, getOrigin, TOKEN_RE } from '../../../lib/db';
import { updateNumber, deleteLink } from '../../actions';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function Manage({ params, searchParams }) {
  const { token } = await params;
  const sp = await searchParams;
  if (!TOKEN_RE.test(token)) notFound();

  const { data } = await db()
    .from('links')
    .select('id, phone')
    .eq('manage_hash', sha(token))
    .maybeSingle();
  if (!data) notFound();

  const origin = await getOrigin(headers);
  const shareUrl = `${origin}/p/${data.id}`;
  const manageUrl = `${origin}/m/${token}`;

  return (
    <>
      <h1>Your link is ready</h1>

      {sp?.saved && <div className="msg ok">Number updated. The link stays the same.</div>}
      {sp?.error && <div className="msg err">That does not look like a valid phone number.</div>}

      <h2>Share this link</h2>
      <p>Anyone with this link can see the number. Send it to the people you want to reach you.</p>
      <div className="linkbox">{shareUrl}</div>
      <a className="btn secondary" href={shareUrl}>Open link</a>

      <h2>Keep this private page</h2>
      <p>
        This management page is the only way to change or delete the number. Bookmark it and do not share it.
        If you lose it, we cannot recover it.
      </p>
      <div className="linkbox">{manageUrl}</div>

      <h2>Change the number</h2>
      <form action={updateNumber} className="card">
        <input type="hidden" name="token" value={token} />
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" defaultValue={data.phone} required />
        <button type="submit">Save</button>
      </form>

      <h2>Delete the link</h2>
      <form action={deleteLink} className="card">
        <input type="hidden" name="token" value={token} />
        <p>This permanently removes the number and makes the share link stop working.</p>
        <button type="submit" className="danger">Delete permanently</button>
      </form>
    </>
  );
}
