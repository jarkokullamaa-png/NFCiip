'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { db, sha, newId, newToken, cleanPhone, TOKEN_RE, ID_RE } from '../lib/db';

const MAX_LINKS_PER_HOUR = 10;

export async function createLink(formData) {
  // Honeypot: real people never fill this hidden field.
  if (formData.get('website')) redirect('/');

  const phone = cleanPhone(formData.get('phone'));
  if (!phone) redirect('/?error=invalid');

  const h = await headers();
  const ip = (h.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const ipHash = sha('ip:' + ip + ':' + (process.env.IP_SALT || ''));

  const supabase = db();
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  const { count } = await supabase
    .from('links')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);
  if ((count ?? 0) >= MAX_LINKS_PER_HOUR) redirect('/?error=rate');

  const token = newToken();
  const { error } = await supabase.from('links').insert({
    id: newId(),
    manage_hash: sha(token),
    phone: phone.display,
    ip_hash: ipHash,
  });
  if (error) redirect('/?error=server');

  // The private management page also shows the shareable link.
  redirect(`/m/${token}`);
}

export async function updateNumber(formData) {
  const token = String(formData.get('token') || '');
  if (!TOKEN_RE.test(token)) redirect('/');
  const phone = cleanPhone(formData.get('phone'));
  if (!phone) redirect(`/m/${token}?error=invalid`);

  const { error } = await db()
    .from('links')
    .update({ phone: phone.display })
    .eq('manage_hash', sha(token));
  if (error) redirect(`/m/${token}?error=server`);
  redirect(`/m/${token}?saved=1`);
}

export async function deleteLink(formData) {
  const token = String(formData.get('token') || '');
  if (!TOKEN_RE.test(token)) redirect('/');
  await db().from('links').delete().eq('manage_hash', sha(token));
  redirect('/?deleted=1');
}

export async function reportLink(formData) {
  const id = String(formData.get('id') || '');
  if (!ID_RE.test(id)) redirect('/');
  const reason = String(formData.get('reason') || '').slice(0, 1000);
  await db().from('reports').insert({ link_id: id, reason });
  redirect('/report?done=1');
}
