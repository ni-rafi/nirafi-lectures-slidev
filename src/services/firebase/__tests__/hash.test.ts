import { describe, it, expect } from 'vitest';
import { computeSHA256, generateLectureStatusHash, verifyLectureStatusHash } from '../hash';

describe('hash.ts cryptographic security helpers', () => {
  const salt = 'test-secret-salt-12345';

  it('computes expected SHA-256 hex string', async () => {
    const hash = await computeSHA256('hello-world');
    expect(hash).toBe('afa27b44d43b02a9fea41d13cedc2e4016cfcf87c5dbf990e593669aa8ce286d');
  });

  it('generates reproducible lecture status hash signature', async () => {
    const hash1 = await generateLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, salt);
    const hash2 = await generateLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, salt);
    const hash3 = await generateLectureStatusHash('subject-a', 'session-1', 'lecture-1', true, salt);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64);
  });

  it('verifies valid hash signature correctly', async () => {
    const hash = await generateLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, salt);
    const isValid = await verifyLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, hash, salt);
    expect(isValid).toBe(true);
  });

  it('rejects invalid, modified, or blank signatures', async () => {
    const hash = await generateLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, salt);
    
    // Different locked status
    const isValid1 = await verifyLectureStatusHash('subject-a', 'session-1', 'lecture-1', true, hash, salt);
    // Modified hash
    const isValid2 = await verifyLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, hash + 'a', salt);
    // Blank hash
    const isValid3 = await verifyLectureStatusHash('subject-a', 'session-1', 'lecture-1', false, '', salt);

    expect(isValid1).toBe(false);
    expect(isValid2).toBe(false);
    expect(isValid3).toBe(false);
  });
});
