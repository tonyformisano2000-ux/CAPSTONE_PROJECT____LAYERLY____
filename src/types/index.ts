export type UserRole = "CUSTOMER" | "DESIGNER" | "ADMIN";
export type DesignerLevel = "PROFESSIONAL" | "AMATEUR";
export type OrderStatus = "PENDING" | "PAID" | "FAILED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profilePhotoUrl?: string;
  backgroundPhotoUrl?: string;
  location?: string;
  tags?: string[];
  stripeCustomerId?: string;
  createdAt: string;

  iban?: string;
  designerLevel?: DesignerLevel;
}

export interface Design {
  id: string;
  title: string;
  subtitle?: string;
  publishedAt: string;
  designerId: string;
  technology: string;
  stlFileUrl: string;
  description?: string;
  photoUrls: string[];
  videoUrls?: string[];
  rating: number; // 1-5
  price: number;
  tags: string[];
}

export interface Comment {
  id: string;
  designId: string;
  userId: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  stripePaymentIntentId?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  designId: string;
  priceAtPurchase: number;
}

export interface CartItem {
  designId: string;
  priceSnapshot: number;
}

export interface MainAction{
    type:string;
    payload?:unknown;
}

export interface Mainstate{
    main:{
        count:number;
    }
}

export interface CartContentState{
  content:Array<CartItem>;
}

export interface CartAction{
  type:string,
  payload?:CartItem;
}