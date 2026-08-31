import { SubmitEvent } from "react";
import { ThreadDetailsDto } from "./dto/thread_details_dto";

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

export type InitialCartInput = Cart | null | undefined;

export const emptyCart: Cart = {
  id: "guest",
  userId: undefined,
  cartItems: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export * from "./interfaces/index";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
}

export interface UserChatProps {
  user: AuthUser | null;
}

export interface ChatHeaderProps {
  thread: ThreadDetailsDto;
  connected: boolean;
  online: boolean;
  typing: boolean;
  lastSeen?: string;
}

export interface ChatMessagesProps {
  thread: ThreadDetailsDto;
  selfRole: "user" | "admin";
}

export interface ChatComposerProps {
  value: string;
  loading: boolean;
  clearSignal: number;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export interface StartConversationFormProps {
  user: AuthUser | null;
  guestName: string;
  guestEmail: string;
  message: string;
  error: string;
  loading: boolean;
  onGuestNameChange: (value: string) => void;
  onGuestEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void | Promise<void>;
}
