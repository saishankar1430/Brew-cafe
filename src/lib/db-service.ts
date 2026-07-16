import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { menu as initialMenu, MenuItem } from "./menu-data";

// Error capturing interface and function matching the Firebase Integration Skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Interfaces
export interface DbReservation {
  id?: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  notes: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt?: unknown;
  emailSent?: boolean;
  emailSentAt?: string;
  confirmationEmailBody?: string;
}

export interface DbOrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface DbOrder {
  id?: string;
  items: DbOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  customerName: string;
  customerEmail: string;
  pickupTime?: string;
  createdAt?: unknown;
}

export interface DbReview {
  id?: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
  approved: boolean;
  createdAt?: unknown;
}

// 1. RESERVATIONS
export async function addReservation(reservation: Omit<DbReservation, "status" | "createdAt">) {
  const path = "reservations";
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      ...reservation,
      guests: Number(reservation.guests),
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function getReservations(): Promise<DbReservation[]> {
  const path = "reservations";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as DbReservation;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateReservationStatus(id: string, status: DbReservation["status"]) {
  const path = `reservations/${id}`;
  try {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteReservation(id: string) {
  const path = `reservations/${id}`;
  try {
    const docRef = doc(db, "reservations", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 2. ORDERS
export async function addOrder(order: Omit<DbOrder, "status" | "createdAt">) {
  const path = "orders";
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      ...order,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function getOrders(): Promise<DbOrder[]> {
  const path = "orders";
  try {
    const colRef = collection(db, path);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as DbOrder;
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateOrderStatus(id: string, status: DbOrder["status"]) {
  const path = `orders/${id}`;
  try {
    const docRef = doc(db, "orders", id);
    await updateDoc(docRef, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteOrder(id: string) {
  const path = `orders/${id}`;
  try {
    const docRef = doc(db, "orders", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 3. REVIEWS
export async function addReview(review: Omit<DbReview, "approved" | "createdAt">) {
  const path = "reviews";
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, {
      ...review,
      approved: false, // Default to false so admin can moderate
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function getReviews(all = false): Promise<DbReview[]> {
  const path = "reviews";
  try {
    const colRef = collection(db, path);
    let q = query(colRef, orderBy("createdAt", "desc"));
    if (!all) {
      q = query(colRef, where("approved", "==", true), orderBy("createdAt", "desc"));
    }
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      } as DbReview;
    });

    // If empty and not asking for all, seed standard ones and return them!
    if (results.length === 0 && !all) {
      await seedDefaultReviews();
      return getReviews(false);
    }

    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function updateReviewApproval(id: string, approved: boolean) {
  const path = `reviews/${id}`;
  try {
    const docRef = doc(db, "reviews", id);
    await updateDoc(docRef, { approved });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteReview(id: string) {
  const path = `reviews/${id}`;
  try {
    const docRef = doc(db, "reviews", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 4. MENU MANAGEMENT
export async function getMenuItems(): Promise<MenuItem[]> {
  const path = "menu";
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    if (results.length === 0) {
      await seedDefaultMenu();
      return getMenuItems();
    }
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function addMenuItem(item: Omit<MenuItem, "id">) {
  const path = "menu";
  try {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, item);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>) {
  const path = `menu/${id}`;
  try {
    const docRef = doc(db, "menu", id);
    await updateDoc(docRef, item);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteMenuItem(id: string) {
  const path = `menu/${id}`;
  try {
    const docRef = doc(db, "menu", id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// 5. SEED DATA HELPERS
async function seedDefaultReviews() {
  const colRef = collection(db, "reviews");
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) {
    console.log("Seeding default reviews...");
    const defaultReviews = [
      {
        name: "Amelia Hart",
        role: "Regular since 2019",
        rating: 5,
        text: "The kind of place where you accidentally spend three hours. The saffron latte alone is worth the trip.",
        avatar: "https://i.pravatar.cc/120?img=47",
        approved: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Julien Bertrand",
        role: "Food writer",
        rating: 5,
        text: "Every detail is considered — the pour, the paper, the light. It reads like a well-edited essay.",
        avatar: "https://i.pravatar.cc/120?img=12",
        approved: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Priya Menon",
        role: "Architect",
        rating: 5,
        text: "One of the last spaces in the city that still values quiet. I bring every visiting client here.",
        avatar: "https://i.pravatar.cc/120?img=32",
        approved: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Marco Rinaldi",
        role: "Photographer",
        rating: 5,
        text: "The light at 4pm turns the room gold. And the pistachio tiramisu is a small crime.",
        avatar: "https://i.pravatar.cc/120?img=68",
        approved: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        name: "Sara Okafor",
        role: "Novelist",
        rating: 5,
        text: "I've written most of a book from the corner table. They never rush you. They just refill the water.",
        avatar: "https://i.pravatar.cc/120?img=45",
        approved: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    for (const r of defaultReviews) {
      await addDoc(colRef, {
        ...r,
        createdAt: Timestamp.fromDate(r.createdAt),
      });
    }
  }
}

async function seedDefaultMenu() {
  const colRef = collection(db, "menu");
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) {
    console.log("Seeding default menu items...");
    for (const item of initialMenu) {
      const { id, ...itemWithoutId } = item;
      // We can use the custom id as doc id so they match up nicely
      await setDoc(doc(colRef, id), {
        ...itemWithoutId,
        available: item.available ?? true,
      });
    }
  }
}
