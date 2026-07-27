import { createPrivateKey } from 'node:crypto';

/**
 * Normalises a Google service-account private key read from an environment
 * variable into valid PEM.
 *
 * Every common way of getting this wrong fails with the *same* opaque OpenSSL
 * message — `error:1E08010C:DECODER routines::unsupported` — so the error tells
 * you nothing about which mistake was made. Rather than make whoever configures
 * this guess, we accept the shapes people actually paste:
 *
 *   - PEM with real newlines                     (pasted from the .json file)
 *   - PEM with literal \n escapes                (copied out of the JSON string)
 *   - either of the above wrapped in " or '      (quotes copied along with it)
 *   - the entire service-account JSON blob       (whole file pasted in)
 *   - base64 of the PEM                          (some CI docs suggest this)
 *
 * Returns the PEM string, or throws with a message naming the actual problem.
 */
export function normalizePrivateKey(raw: string | undefined): string {
  if (!raw || !raw.trim()) {
    throw new Error('GOOGLE_PRIVATE_KEY is empty');
  }

  let key = raw.trim();

  // The whole service-account JSON, rather than just the key field.
  if (key.startsWith('{')) {
    try {
      const parsed = JSON.parse(key);
      if (typeof parsed.private_key === 'string') {
        key = parsed.private_key.trim();
      }
    } catch {
      /* not JSON after all — fall through and try the other shapes */
    }
  }

  // Surrounding quotes copied along with the value.
  if ((key.startsWith('"') && key.endsWith('"')) ||
      (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  // Literal \n escapes (and \r\n) instead of real newlines.
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');

  // base64 of a PEM.
  if (!key.includes('BEGIN')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8');
      if (decoded.includes('BEGIN')) key = decoded.trim();
    } catch {
      /* not base64 — fall through to the validation below */
    }
  }

  if (!key.includes('BEGIN')) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY does not look like a PEM key — it has no "-----BEGIN..." header. ' +
      'Paste the value of the `private_key` field from the service-account JSON.'
    );
  }

  // OpenSSL rejects a PEM without a trailing newline.
  if (!key.endsWith('\n')) key += '\n';

  // Fail here, with context, rather than deep inside googleapis at request time.
  try {
    createPrivateKey(key);
  } catch (err) {
    throw new Error(
      `GOOGLE_PRIVATE_KEY is present but could not be parsed as a private key (${
        err instanceof Error ? err.message : String(err)
      }). Check that the whole value was copied, including the BEGIN/END lines.`
    );
  }

  return key;
}
