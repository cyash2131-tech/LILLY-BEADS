export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  available: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Review {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  referenceImage?: string;
  preferredColors: string[];
  preferredBeads: string[];
  budget: number;
  deliveryDate: string;
  status: 'Pending' | 'Processing' | 'Approved' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  couponCode?: string;
  subtotal: number;
  shippingCharges: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
}

export interface AppSettings {
  storeName: string;
  logo: string;
  socialInstagram: string;
  socialWhatsApp: string;
  whatsAppNumber: string;
  shippingCharges: number;
  taxPercent: number;
  bannerImages: string[];
}
