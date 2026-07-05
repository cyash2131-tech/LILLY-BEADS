import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db, firebaseEnabled, DbOperationType, handleFirestoreError } from './firebase';
import { Product, Category, Order, CustomRequest, Review, AppSettings } from './types';

// SEED DATA
const defaultCategories: Category[] = [
  {
    id: 'bracelets',
    name: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    description: 'Handcrafted, cute beaded bracelets made with pearls, flowers, and custom charms.'
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    description: 'Stunning chokers, daisy chains, and pendant necklaces designed to complete your outfit.'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
    description: 'Instagram-worthy phone straps, keychains, and cute custom additions.'
  }
];

const defaultProducts: Product[] = [
  {
    id: 'prod-blossom-bracelet',
    name: 'Blossom Flower Beaded Bracelet',
    description: 'A dainty bracelet featuring hand-woven seed bead daisy flowers in beautiful pastel pink and soft yellow. Perfect for stacking and layering with other pastels! Made with high-tensile elastic thread for comfortable daily wear.',
    price: 18,
    salePrice: 15,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'bracelets',
    stock: 12,
    featured: true,
    available: true,
    rating: 4.8,
    reviewsCount: 14
  },
  {
    id: 'prod-pastel-pearl',
    name: 'Pastel Dream Pearl Bracelet',
    description: 'Genuine freshwater cultured pearls mixed with high-quality pastel acrylic heart beads and a 14k gold-plated lobster clasp. Combines classic elegance with a cute, modern Y2K Instagram aesthetic.',
    price: 22,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'bracelets',
    stock: 5,
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 8
  },
  {
    id: 'prod-cherry-blossom',
    name: 'Cherry Blossom Charm Bracelet',
    description: 'Delicate hand-crafted cherry charms paired with rose-quartz glass beads. This piece symbolizes springtime renewal and adds a subtle, feminine pink pop to any cozy look.',
    price: 16,
    salePrice: 12,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'bracelets',
    stock: 15,
    featured: false,
    available: true,
    rating: 4.5,
    reviewsCount: 4
  },
  {
    id: 'prod-daisy-choker',
    name: 'Chunky Daisy Chain Choker',
    description: 'Our signature beaded daisy chain choker. Featuring custom seed bead flowers hand-woven together in soft lavender, mint green, and marshmallow pink. Features an adjustable silver-plated chain closure.',
    price: 28,
    salePrice: 24,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'necklaces',
    stock: 8,
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: 'prod-sweetheart-choker',
    name: 'Sweetheart Pearl Choker Necklace',
    description: 'A gorgeous statement choker featuring a baby pink resin heart charm nestled among beautiful premium faux pearls and iridescent seed beads. Perfect for picnic dates and romantic summer fits.',
    price: 32,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'necklaces',
    stock: 4,
    featured: true,
    available: true,
    rating: 5.0,
    reviewsCount: 12
  },
  {
    id: 'prod-lavender-teddy',
    name: 'Cozy Lavender Teddy Necklace',
    description: 'An adorable minimalist necklace with a lavender seed bead chain and a tiny pastel clay teddy bear pendant. Handcrafted with precision and love.',
    price: 25,
    salePrice: 19,
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'necklaces',
    stock: 20,
    featured: false,
    available: true,
    rating: 4.7,
    reviewsCount: 6
  },
  {
    id: 'prod-cotton-candy-strap',
    name: 'Cotton Candy Phone Charm Strap',
    description: 'Decorate your phone with our highly requested phone strap! Made with pastel stars, glowing smiley faces, pearl beads, and custom heart details. Simply loops through any phone case opening.',
    price: 12,
    salePrice: 9,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'accessories',
    stock: 30,
    featured: true,
    available: true,
    rating: 4.9,
    reviewsCount: 25
  },
  {
    id: 'prod-lilac-cloud-keychain',
    name: 'Lilac Cloud Soft Keychain',
    description: 'A cute beaded keychain for your backpack, car keys, or AirPods case. Featuring soft lilac cloud charms, silver stars, and transparent pastel beads with a durable clasp.',
    price: 14,
    images: [
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'accessories',
    stock: 10,
    featured: false,
    available: true,
    rating: 4.6,
    reviewsCount: 3
  }
];

const defaultReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-blossom-bracelet',
    customerName: 'Aria M.',
    rating: 5,
    comment: 'Literally the cutest bracelet I own! The flowers are perfectly woven, and it stretches so nicely on my wrist without pinching. Will order more for my besties!',
    date: '2026-06-15'
  },
  {
    id: 'rev-2',
    productId: 'prod-daisy-choker',
    customerName: 'Chloe T.',
    rating: 5,
    comment: 'Got so many compliments on this choker during a picnic last week! The pastel colors are absolutely perfect, and the metal extender chain lets me adjust the length easily.',
    date: '2026-06-20'
  },
  {
    id: 'rev-3',
    productId: 'prod-cotton-candy-strap',
    customerName: 'Sophie L.',
    rating: 5,
    comment: 'So cute and durable! My phone has been dangling from it and it is still super strong. Highly recommend for the Pinterest vibe!',
    date: '2026-06-28'
  },
  {
    id: 'rev-4',
    productId: 'prod-sweetheart-choker',
    customerName: 'Isabella G.',
    rating: 5,
    comment: 'The pearls are gorgeous and the baby pink heart feels very high-quality. Packaged with cute stickers too!',
    date: '2026-07-02'
  }
];

const defaultSettings: AppSettings = {
  storeName: 'Lilyy Beads',
  logo: 'Lilyy Beads 🌸',
  socialInstagram: 'https://instagram.com/lilyybeads.handmade',
  socialWhatsApp: 'https://wa.me/1234567890',
  whatsAppNumber: '+1 (234) 567-890',
  shippingCharges: 4.99,
  taxPercent: 8,
  bannerImages: [
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop'
  ]
};

// INITIALIZE LOCAL STORAGE WRAPPERS
function getLocal<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const StorageManager = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (firebaseEnabled && db) {
      const path = 'products';
      try {
        const snap = await getDocs(collection(db, path));
        const list: Product[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Product);
        });
        // If empty in Firebase (new project), we write seed data
        if (list.length === 0) {
          for (const prod of defaultProducts) {
            await setDoc(doc(db, path, prod.id), prod);
            list.push(prod);
          }
        }
        return list;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    return getLocal<Product[]>('lilyy_products', defaultProducts);
  },

  async getProductById(id: string): Promise<Product | null> {
    if (firebaseEnabled && db) {
      const path = `products/${id}`;
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Product;
        }
        return null;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    const list = getLocal<Product[]>('lilyy_products', defaultProducts);
    return list.find(p => p.id === id) || null;
  },

  async saveProduct(product: Product): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `products/${product.id}`;
      try {
        await setDoc(doc(db, 'products', product.id), product);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    const list = getLocal<Product[]>('lilyy_products', defaultProducts);
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) {
      list[index] = product;
    } else {
      list.push(product);
    }
    setLocal('lilyy_products', list);
  },

  async deleteProduct(id: string): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `products/${id}`;
      try {
        await deleteDoc(doc(db, 'products', id));
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.DELETE, path);
      }
    }
    const list = getLocal<Product[]>('lilyy_products', defaultProducts);
    const filtered = list.filter(p => p.id !== id);
    setLocal('lilyy_products', filtered);
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (firebaseEnabled && db) {
      const path = 'categories';
      try {
        const snap = await getDocs(collection(db, path));
        const list: Category[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Category);
        });
        if (list.length === 0) {
          for (const cat of defaultCategories) {
            await setDoc(doc(db, path, cat.id), cat);
            list.push(cat);
          }
        }
        return list;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    return getLocal<Category[]>('lilyy_categories', defaultCategories);
  },

  async saveCategory(category: Category): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `categories/${category.id}`;
      try {
        await setDoc(doc(db, 'categories', category.id), category);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    const list = getLocal<Category[]>('lilyy_categories', defaultCategories);
    const index = list.findIndex(c => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    setLocal('lilyy_categories', list);
  },

  async deleteCategory(id: string): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `categories/${id}`;
      try {
        await deleteDoc(doc(db, 'categories', id));
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.DELETE, path);
      }
    }
    const list = getLocal<Category[]>('lilyy_categories', defaultCategories);
    const filtered = list.filter(c => c.id !== id);
    setLocal('lilyy_categories', filtered);
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (firebaseEnabled && db) {
      const path = 'orders';
      try {
        const snap = await getDocs(collection(db, path));
        const list: Order[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Order);
        });
        return list;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    return getLocal<Order[]>('lilyy_orders', []);
  },

  async saveOrder(order: Order): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `orders/${order.id}`;
      try {
        await setDoc(doc(db, 'orders', order.id), order);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    const list = getLocal<Order[]>('lilyy_orders', []);
    list.push(order);
    setLocal('lilyy_orders', list);
  },

  async updateOrderStatus(orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `orders/${orderId}`;
      try {
        const updateData: any = { orderStatus: status };
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        await updateDoc(doc(db, 'orders', orderId), updateData);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.UPDATE, path);
      }
    }
    const list = getLocal<Order[]>('lilyy_orders', []);
    const index = list.findIndex(o => o.id === orderId);
    if (index >= 0) {
      list[index].orderStatus = status;
      if (paymentStatus) list[index].paymentStatus = paymentStatus;
      setLocal('lilyy_orders', list);
    }
  },

  // CUSTOM REQUESTS
  async getCustomRequests(): Promise<CustomRequest[]> {
    if (firebaseEnabled && db) {
      const path = 'custom_requests';
      try {
        const snap = await getDocs(collection(db, path));
        const list: CustomRequest[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as CustomRequest);
        });
        return list;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    return getLocal<CustomRequest[]>('lilyy_custom_requests', []);
  },

  async saveCustomRequest(request: CustomRequest): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `custom_requests/${request.id}`;
      try {
        await setDoc(doc(db, 'custom_requests', request.id), request);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    const list = getLocal<CustomRequest[]>('lilyy_custom_requests', []);
    list.push(request);
    setLocal('lilyy_custom_requests', list);
  },

  async updateCustomRequestStatus(id: string, status: CustomRequest['status']): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `custom_requests/${id}`;
      try {
        await updateDoc(doc(db, 'custom_requests', id), { status });
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.UPDATE, path);
      }
    }
    const list = getLocal<CustomRequest[]>('lilyy_custom_requests', []);
    const index = list.findIndex(r => r.id === id);
    if (index >= 0) {
      list[index].status = status;
      setLocal('lilyy_custom_requests', list);
    }
  },

  // REVIEWS
  async getReviews(productId?: string): Promise<Review[]> {
    if (firebaseEnabled && db) {
      const path = 'reviews';
      try {
        const snap = await getDocs(collection(db, path));
        const list: Review[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Review);
        });
        if (list.length === 0) {
          for (const rev of defaultReviews) {
            await setDoc(doc(db, path, rev.id), rev);
            list.push(rev);
          }
        }
        return productId ? list.filter(r => r.productId === productId) : list;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    const list = getLocal<Review[]>('lilyy_reviews', defaultReviews);
    return productId ? list.filter(r => r.productId === productId) : list;
  },

  async addReview(review: Review): Promise<void> {
    if (firebaseEnabled && db) {
      const path = `reviews/${review.id}`;
      try {
        await setDoc(doc(db, 'reviews', review.id), review);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    const list = getLocal<Review[]>('lilyy_reviews', defaultReviews);
    list.push(review);
    setLocal('lilyy_reviews', list);
  },

  // SETTINGS
  async getSettings(): Promise<AppSettings> {
    if (firebaseEnabled && db) {
      const path = 'settings/general';
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          return snap.data() as AppSettings;
        } else {
          await setDoc(doc(db, 'settings', 'general'), defaultSettings);
          return defaultSettings;
        }
      } catch (err) {
        handleFirestoreError(err, DbOperationType.GET, path);
      }
    }
    return getLocal<AppSettings>('lilyy_settings', defaultSettings);
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    if (firebaseEnabled && db) {
      const path = 'settings/general';
      try {
        await setDoc(doc(db, 'settings', 'general'), settings);
        return;
      } catch (err) {
        handleFirestoreError(err, DbOperationType.WRITE, path);
      }
    }
    setLocal('lilyy_settings', settings);
  }
};
