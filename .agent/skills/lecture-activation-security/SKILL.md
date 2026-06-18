---
name: lecture-activation-security
description: Guides managing real-time lecture activations, custom claims, and cryptographic signatures.
---

# Lecture Activation & Security Skill

This skill documents how to manage, verify, and modify the lock (activation) states of lectures in this workspace.

---

## 1. Architecture Overview

Lecture lock states are synced in real-time between administrators and students:
1. **Admins** toggle a lecture's state directly on their dashboard using inline switch controls.
2. **Firestore** updates are listened to in real-time by all student clients via the `onSnapshot` subscription in `<LectureStatusProvider>`.
3. **Crypto Signatures** (SHA-256) verify that updates are authentic and prevent students from directly editing Firestore to unlock lectures.
4. **Router Guards** (`<LectureRouteGuard>`) intercept direct navigation attempts to locked lectures and redirect students to the homepage.

---

## 2. Database Data Structure

All lecture lock states for a given subject and session are grouped inside a single document in the `lecture_status` collection to minimize Firestore read counts.

* **Collection Path**: `lecture_status`
* **Document ID**: `${subjectId}_${sessionId}` (e.g. `quantity-surveying_session-2026`)
* **Document Content**:
```json
{
  "lectures": {
    "{lectureId}": {
      "locked": boolean,
      "updatedAt": number,
      "hash": string
    }
  }
}
```

---

## 3. Cryptographic Signature Validation

To prevent direct Firestore manipulation, any update to `locked` state must be accompanied by a valid SHA-256 signature hash.

### 3.1 Hash Computation Formula
The hash is calculated by concatenating key fields with a secret salt:
$$\text{hash} = \text{SHA256}(\text{subjectId} + \text{"\_"} + \text{sessionId} + \text{"\_"} + \text{lectureId} + \text{"\_"} + \text{locked} + \text{"\_"} + \text{salt})$$
* **Salt Source**: Configured via the `VITE_ADMIN_HASH_SALT` environment variable.

### 3.2 Client-Side Validation
* When status records are loaded, `<LectureStatusProvider>` automatically validates their hash signature.
* If a status record has a **mismatched or missing hash**, the verification fails, and the lecture is forced to a **locked state** on the client for security.

---

## 4. Admin Role Identification

Admins are identified via standard Firebase custom claims:
* **Custom Claims**: Checks `tokenResult.claims['is_admin'] === true` or `tokenResult.claims['isAdmin'] === true` or `tokenResult.claims['role'] === 'admin'`.
* **Offline Fallback**: In offline/mock mode, if the user registration number matches `VITE_MOCK_ADMIN_REGISTRATION` (default: `0000000000`), they are treated as an admin.

---

## 5. UI and Routing Guidelines

### 5.1 Route Protection
Any route displaying presentation content (e.g., slide decks, blog views) must be wrapped inside the `<LectureRouteGuard>` component.
* If the guard detects a locked status, it redirects the student to the dashboard with location state: `{ alertMessage: 'This lecture is currently locked.' }`.

### 5.2 Inline Toggles
* When the logged-in user is an admin, `<LectureCard>` renders an inline toggle switch in the footer.
* The toggle triggers `setLectureLocked` which recalculates the signature using `VITE_ADMIN_HASH_SALT` and writes it to Firestore.
