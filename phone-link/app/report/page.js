import { reportLink } from '../actions';
import { ID_RE } from '../../lib/db';

export const metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function Report({ searchParams }) {
  const sp = await searchParams;

  if (sp?.done) {
    return (
      <>
        <h1>Thank you</h1>
        <p>Your report was received and will be reviewed. Reported numbers that were shared without permission are removed.</p>
        <a className="btn secondary" href="/">Back to home</a>
      </>
    );
  }

  const id = ID_RE.test(sp?.id || '') ? sp.id : '';

  return (
    <>
      <h1>Report a number</h1>
      <p>Use this if a number was published here without the owner's permission.</p>
      <form action={reportLink} className="card">
        <label htmlFor="id">Link ID</label>
        <input id="id" name="id" type="text" defaultValue={id} required maxLength={12} />
        <label htmlFor="reason" style={{ marginTop: 12 }}>What is the problem? (optional)</label>
        <textarea id="reason" name="reason" rows={4} maxLength={1000} />
        <button type="submit">Send report</button>
      </form>
    </>
  );
}
