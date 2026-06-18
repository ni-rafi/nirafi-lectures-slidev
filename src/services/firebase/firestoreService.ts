import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  type Firestore,
  type DocumentData
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { ZodType } from 'zod';

export interface FirestoreDefinition<T> {
  collectionPath: string;
  schema: ZodType<T>;
  roles?: {
    read?: string[];
    write?: string[];
  };
}

export const firestoreService = {
  getDb(): Firestore {
    const db = getFirestore();
    if (!db) {
      throw new Error('[FirestoreService] Firebase Firestore is not initialized.');
    }
    return db;
  },

  /**
   * Performs client-side role validation against the currently logged-in user's claims.
   * Throws an error if access is denied.
   */
  async checkGuard<T>(def: FirestoreDefinition<T>, operation: 'read' | 'write'): Promise<void> {
    if (!def.roles) {
      return; // Public / no roles required
    }

    const requiredRoles = def.roles[operation];
    if (!requiredRoles || requiredRoles.length === 0) {
      return; // No specific roles required for this operation
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('[FirestoreService] Access Denied: User is not authenticated.');
    }

    // Force refresh token to get latest custom claims
    const tokenResult = await currentUser.getIdTokenResult(true);
    const userRole = tokenResult.claims['role'] as string || (tokenResult.claims['isAdmin'] ? 'admin' : 'student');

    const hasPermission = requiredRoles.includes(userRole);
    if (!hasPermission) {
      throw new Error(`[FirestoreService] Access Denied: Role "${userRole}" is not authorized for this action.`);
    }
  },

  /**
   * Adds a new document with validation.
   */
  async create<T extends { id?: string | undefined }>(def: FirestoreDefinition<T>, data: Omit<T, 'id'>): Promise<T> {
    await this.checkGuard(def, 'write');

    // Validate data using Zod schema
    const validatedData = def.schema.parse({ ...data, id: 'temp_id' }) as DocumentData;
    // Remove temporary ID before writing to Firestore
    delete validatedData['id'];

    const db = this.getDb();
    const docRef = await addDoc(collection(db, def.collectionPath), validatedData);

    return {
      id: docRef.id,
      ...validatedData
    } as unknown as T;
  },

  /**
   * Sets/creates a document with a specific ID.
   */
  async set<T extends { id?: string | undefined }>(def: FirestoreDefinition<T>, id: string, data: Omit<T, 'id'>): Promise<T> {
    await this.checkGuard(def, 'write');

    const validatedData = def.schema.parse({ ...data, id }) as DocumentData;
    delete validatedData['id'];

    const db = this.getDb();
    const docRef = doc(db, def.collectionPath, id);
    await setDoc(docRef, validatedData);

    return {
      id,
      ...validatedData
    } as unknown as T;
  },


  /**
   * Retrieves a document by ID.
   */
  async getById<T extends { id?: string | undefined }>(def: FirestoreDefinition<T>, id: string): Promise<T | null> {
    await this.checkGuard(def, 'read');

    const db = this.getDb();
    const docSnap = await getDoc(doc(db, def.collectionPath, id));

    if (!docSnap.exists()) {
      return null;
    }

    const rawData = { id: docSnap.id, ...docSnap.data() };
    return def.schema.parse(rawData);
  },

  /**
   * Retrieves all documents in a collection.
   */
  async getAll<T extends { id?: string | undefined }>(def: FirestoreDefinition<T>): Promise<T[]> {
    await this.checkGuard(def, 'read');

    const db = this.getDb();
    const querySnapshot = await getDocs(collection(db, def.collectionPath));
    
    const results: T[] = [];
    querySnapshot.forEach((docSnap) => {
      const rawData = { id: docSnap.id, ...docSnap.data() };
      results.push(def.schema.parse(rawData));
    });

    return results;
  },

  /**
   * Updates fields of an existing document.
   */
  async update<T>(def: FirestoreDefinition<T>, id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    await this.checkGuard(def, 'write');

    const db = this.getDb();
    const docRef = doc(db, def.collectionPath, id);
    
    // Validate partial data shape if needed, or update directly.
    await updateDoc(docRef, data as DocumentData);
  },

  /**
   * Deletes a document by ID.
   */
  async delete<T>(def: FirestoreDefinition<T>, id: string): Promise<void> {
    await this.checkGuard(def, 'write');

    const db = this.getDb();
    await deleteDoc(doc(db, def.collectionPath, id));
  },

  /**
   * Subscribes to collection snapshots in real-time.
   */
  subscribe<T extends { id?: string | undefined }>(def: FirestoreDefinition<T>, callback: (items: T[]) => void): () => void {
    // Subscription requires read permission
    this.checkGuard(def, 'read').catch((err) => {
      console.error('[FirestoreService] Subscription unauthorized:', err);
    });

    const db = this.getDb();
    return onSnapshot(collection(db, def.collectionPath), (querySnapshot) => {
      const results: T[] = [];
      querySnapshot.forEach((docSnap) => {
        try {
          const rawData = { id: docSnap.id, ...docSnap.data() };
          results.push(def.schema.parse(rawData));
        } catch (e) {
          console.warn(`[FirestoreService] Failed to parse document ${docSnap.id}:`, e);
        }
      });
      callback(results);
    }, (error) => {
      console.warn(`[FirestoreService] Real-time subscription failed for ${def.collectionPath}:`, error);
    });
  }
};

