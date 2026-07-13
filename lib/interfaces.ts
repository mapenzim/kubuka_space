export interface MerchandiseItem {
  id: string;
  title: string;
  body: string;
  price: number;
}

export interface CartItem {
  id: string;
  merchandise: MerchandiseItem;
  quantity: number;
}

export interface Cart {
  id: string;
  userId?: string;
  cartItems: CartItem[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type GuestCartItem = {
  merchandise: MerchandiseItem;
  quantity: number;
};

export type GuestCart = GuestCartItem[];

export const initialCart: Cart = {
  id: "guest",
  userId: undefined,
  cartItems: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null as any,
};

export type InitialCartInput = Cart | null | undefined;

export const emptyCart: Cart = {
  id: "guest",
  userId: undefined,
  cartItems: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null as any,
};

// Enums mapped from your Prisma schema
export type ThreadStatus = "unread" | "read" | "archived";
export type MessageDirection = "incoming" | "outgoing";

// Backend types
export interface Message {
  id: string;
  threadId: string;
  direction: MessageDirection;
  content: string;
  timestamp: Date;
  readAt: Date | null;
}

export interface Thread {
  id: string;
  sender: string;
  email: string;
  status: ThreadStatus;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  dateArchived: Date | null;
  messages: Message[];
}

// UI type
export interface UIThread {
  id: string;
  sender: string;
  email: string;
  messages: {
    id: string;
    role: "user" | "admin" | "bot";
    content: string;
    timestamp: string;
  }[];
}

export interface UIMessage {
  id: string;
  role: "user" | "admin" | "bot";
  content: string;
  timestamp: string;
}