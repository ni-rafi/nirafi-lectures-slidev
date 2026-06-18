/**
 * Computes the SHA-256 hash of a string using the environment's Web Crypto API.
 */
export async function computeSHA256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (globalThis as unknown as { crypto: Crypto }).crypto;
  if (!cryptoObj || !cryptoObj.subtle) {
    throw new Error('Web Crypto API (crypto.subtle) is not available in this environment.');
  }
  
  const hashBuffer = await cryptoObj.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generates the integrity hash for a lecture's locked status.
 * Message shape: "${subjectId}_${sessionId}_${lectureId}_${locked}_${salt}"
 */
export async function generateLectureStatusHash(
  subjectId: string,
  sessionId: string,
  lectureId: string,
  locked: boolean,
  salt: string
): Promise<string> {
  const message = `${subjectId}_${sessionId}_${lectureId}_${locked}_${salt}`;
  return computeSHA256(message);
}

/**
 * Verifies if the provided hash matches the calculated hash for a lecture's state.
 */
export async function verifyLectureStatusHash(
  subjectId: string,
  sessionId: string,
  lectureId: string,
  locked: boolean,
  hash: string,
  salt: string
): Promise<boolean> {
  if (!hash) return false;
  const calculated = await generateLectureStatusHash(subjectId, sessionId, lectureId, locked, salt);
  return calculated === hash;
}
