import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/* ------------------------------------------------------------------ *
 * Access gate for the hidden agency-wholesale offer.
 *
 * The route is /p/:token — the real token is a URL PARAM, never a literal
 * in the source or the shipped bundle, so it can't be recovered by
 * inspecting the JS (or this repo). All that ships is the SHA-256 hash
 * below; the plaintext token lives ONLY in the URL put in the pitch email.
 *
 * The offer's own chunk (PartnersPage) is lazy-loaded ONLY after the hash
 * verifies, so its markup + canonical URL never reach a visitor who
 * doesn't have the link. A wrong/absent token renders the ordinary 404 —
 * no hint that a real page lives at this path.
 *
 * To rotate the token: pick a new one, run
 *   printf 'NEW-TOKEN' | shasum -a 256
 * paste the hex into EXPECTED_HASH, and hand out /p/NEW-TOKEN.
 * ------------------------------------------------------------------ */
const EXPECTED_HASH =
  'c45f5bf0e59f7d679d5ccf38e30cd840d6c3da9896858d86b42d70f05214ee12';

// Loaded only on a verified token — keeps the offer out of every other bundle.
const PartnersPage = lazy(() => import('./PartnersPage'));
const NotFoundPage = lazy(() => import('./NotFoundPage'));

const sha256Hex = async (input) => {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

const PartnersGate = () => {
  const { token = '' } = useParams();
  // checking | ok | denied. Hashing runs client-side only (effect), so this
  // never executes during the static build — no browser globals at module
  // scope, no SSR/hydration divergence.
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;
    sha256Hex(token)
      .then((hex) => {
        if (active) setStatus(hex === EXPECTED_HASH ? 'ok' : 'denied');
      })
      .catch(() => {
        if (active) setStatus('denied');
      });
    return () => {
      active = false;
    };
  }, [token]);

  // While checking, render a transparent placeholder (matches .route-backdrop)
  // so a valid token never flashes the 404 before the async hash resolves.
  if (status === 'checking') {
    return <div className="route-fallback" aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
      {status === 'ok' ? <PartnersPage token={token} /> : <NotFoundPage />}
    </Suspense>
  );
};

export default PartnersGate;
