import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  onSnapshot,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// User Profile
export async function createUserProfile(user) {
  const userRef = doc(db, 'users', user.uid, 'profile', 'info');
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      settings: { defaultFormat: 'keyTakeaways' },
    });
  }
}

export async function getUserSettings(userId) {
  const userRef = doc(db, 'users', userId, 'profile', 'info');
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data().settings : { defaultFormat: 'keyTakeaways' };
}

export async function updateUserSettings(userId, settings) {
  const userRef = doc(db, 'users', userId, 'profile', 'info');
  await updateDoc(userRef, { settings });
}

// Distills
export async function createDistill(userId, distillData) {
  const distillsRef = collection(db, 'users', userId, 'distills');
  const docRef = await addDoc(distillsRef, {
    ...distillData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDistill(userId, distillId, data) {
  const distillRef = doc(db, 'users', userId, 'distills', distillId);
  await updateDoc(distillRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDistill(userId, distillId) {
  const distillRef = doc(db, 'users', userId, 'distills', distillId);
  const snapshot = await getDoc(distillRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    // Decrement collection count if distill belonged to one
    if (data.collectionId) {
      const collRef = doc(db, 'users', userId, 'collections', data.collectionId);
      await updateDoc(collRef, { distillCount: increment(-1) }).catch(() => {});
    }
  }

  await deleteDoc(distillRef);
}

export async function getDistill(userId, distillId) {
  const distillRef = doc(db, 'users', userId, 'distills', distillId);
  const snapshot = await getDoc(distillRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export function subscribeToDistills(userId, callback, limitCount = 50) {
  const distillsRef = collection(db, 'users', userId, 'distills');
  const q = query(distillsRef, orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const distills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(distills);
  });
}

export async function getRecentDistills(userId, count = 6) {
  const distillsRef = collection(db, 'users', userId, 'distills');
  const q = query(distillsRef, orderBy('createdAt', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Collections
export async function createCollection(userId, name, color = '#818CF8') {
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const docRef = await addDoc(collectionsRef, {
    name,
    color,
    createdAt: serverTimestamp(),
    distillCount: 0,
  });
  return docRef.id;
}

export async function deleteCollection(userId, collectionId) {
  // Delete all distills that belonged to this collection
  const distillsRef = collection(db, 'users', userId, 'distills');
  const q = query(distillsRef, where('collectionId', '==', collectionId));
  const snapshot = await getDocs(q);
  const deletes = snapshot.docs.map(d =>
    deleteDoc(doc(db, 'users', userId, 'distills', d.id))
  );
  await Promise.all(deletes);

  const collRef = doc(db, 'users', userId, 'collections', collectionId);
  await deleteDoc(collRef);
}

export function subscribeToCollections(userId, callback) {
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const q = query(collectionsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const collections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(collections);
  });
}

export async function addDistillToCollection(userId, distillId, collectionId) {
  await updateDistill(userId, distillId, { collectionId });
  const collRef = doc(db, 'users', userId, 'collections', collectionId);
  await updateDoc(collRef, { distillCount: increment(1) });
}

export async function removeDistillFromCollection(userId, distillId, collectionId) {
  await updateDistill(userId, distillId, { collectionId: null });
  const collRef = doc(db, 'users', userId, 'collections', collectionId);
  await updateDoc(collRef, { distillCount: increment(-1) });
}

// Delete All User Data
export async function deleteAllUserData(userId) {
  // Delete all distills
  const distillsRef = collection(db, 'users', userId, 'distills');
  const distillSnap = await getDocs(distillsRef);
  const distillDeletes = distillSnap.docs.map(d => deleteDoc(d.ref));

  // Delete all collections
  const collectionsRef = collection(db, 'users', userId, 'collections');
  const collSnap = await getDocs(collectionsRef);
  const collDeletes = collSnap.docs.map(d => deleteDoc(d.ref));

  await Promise.all([...distillDeletes, ...collDeletes]);

  // Reset user profile settings
  const userRef = doc(db, 'users', userId, 'profile', 'info');
  await updateDoc(userRef, { settings: { defaultFormat: 'keyTakeaways' } });
}

// Stats
export async function getDistillStats(userId) {
  const distillsRef = collection(db, 'users', userId, 'distills');
  const snapshot = await getDocs(distillsRef);
  const distills = snapshot.docs.map(doc => doc.data());

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeek = distills.filter(d => d.createdAt?.toDate?.() > weekAgo).length;

  const formatCounts = {};
  let totalPages = 0;
  distills.forEach(d => {
    if (d.outputFormat) {
      formatCounts[d.outputFormat] = (formatCounts[d.outputFormat] || 0) + 1;
    }
    if (d.sourceInfo?.pageCount) {
      totalPages += d.sourceInfo.pageCount;
    }
  });

  const mostUsedFormat = Object.entries(formatCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

  return {
    total: distills.length,
    thisWeek,
    mostUsedFormat,
    totalPages,
  };
}
