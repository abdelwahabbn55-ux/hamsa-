export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "nouvelle"
  | "confirmee"
  | "en_preparation"
  | "prete"
  | "en_livraison"
  | "terminee"
  | "annulee";

export type OrderType = "retrait" | "livraison";

export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
}

export interface ShopSettings {
  id: number;
  is_open_override: boolean | null;
  whatsapp_number: string | null;
  followers_count: number | null;
  rating: number | null;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  address: string | null;
  note: string | null;
  status: OrderStatus;
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
}

export interface DbRelationship {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: {
          id?: string;
          name: string;
          sort_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: DbRelationship[];
      };
      items: {
        Row: MenuItem;
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: DbRelationship[];
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          order_number?: number;
          customer_name: string;
          customer_phone: string;
          order_type: OrderType;
          address?: string | null;
          note?: string | null;
          status?: OrderStatus;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: number;
          customer_name?: string;
          customer_phone?: string;
          order_type?: OrderType;
          address?: string | null;
          note?: string | null;
          status?: OrderStatus;
          total?: number;
          created_at?: string;
        };
        Relationships: DbRelationship[];
      };
      order_items: {
        Row: OrderItem;
        Insert: {
          id?: string;
          order_id: string;
          item_id?: string | null;
          item_name: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          item_id?: string | null;
          item_name?: string;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: DbRelationship[];
      };
      shop_settings: {
        Row: ShopSettings;
        Insert: {
          id?: number;
          is_open_override?: boolean | null;
          whatsapp_number?: string | null;
          followers_count?: number | null;
          rating?: number | null;
        };
        Update: {
          id?: number;
          is_open_override?: boolean | null;
          whatsapp_number?: string | null;
          followers_count?: number | null;
          rating?: number | null;
        };
        Relationships: DbRelationship[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
