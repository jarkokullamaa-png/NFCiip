import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1>Link not found</h1>
      <p>This link does not exist or was deleted.</p>
      <Link className="btn secondary" href="/">Create your own link</Link>
    </>
  );
}
