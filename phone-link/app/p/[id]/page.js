import { notFound } from 'next/navigation';
import { db, cleanPhone, ID_RE } from '../../../lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function PublicNumber({ params }) {
  const { id } = await params;
  // Invalid, unknown and deleted links all give the same response.
  if (!ID_RE.test(id)) notFound();

  const { data } = await db().from('links').select('phone').eq('id', id).maybeSingle();
  if (!data) notFound();

  const parsed = cleanPhone(data.phone);

  return (
    <>
      <div className="card center">
        <p className="small">Phone number</p>
        <div className="number">{data.phone}</div>
        {parsed && (
          <a className="btn" href={`tel:${parsed.tel}`}>
            Tap to call
          </a>
        )}
      </div>
      <p className="small center">
        <a href={`/report?id=${id}`}>Report this number</a>
      </p>
    </>
  );
}
