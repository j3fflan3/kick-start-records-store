export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  product: {
    Tables: {
      artist: {
        Row: {
          artist_attributes: Json | null;
          artist_id: string;
          country_id: number | null;
          created: string | null;
          description: string | null;
          name: string;
          record_label_id: string | null;
          updated: string | null;
        };
        Insert: {
          artist_attributes?: Json | null;
          artist_id?: string;
          country_id?: number | null;
          created?: string | null;
          description?: string | null;
          name: string;
          record_label_id?: string | null;
          updated?: string | null;
        };
        Update: {
          artist_attributes?: Json | null;
          artist_id?: string;
          country_id?: number | null;
          created?: string | null;
          description?: string | null;
          name?: string;
          record_label_id?: string | null;
          updated?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artist_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "country";
            referencedColumns: ["country_id"];
          },
          {
            foreignKeyName: "artist_record_label_id_fkey";
            columns: ["record_label_id"];
            isOneToOne: false;
            referencedRelation: "record_label";
            referencedColumns: ["record_label_id"];
          }
        ];
      };
      artist_image_mm: {
        Row: {
          artist_id: string;
          created: string | null;
          image_id: string;
          updated: string | null;
        };
        Insert: {
          artist_id: string;
          created?: string | null;
          image_id: string;
          updated?: string | null;
        };
        Update: {
          artist_id?: string;
          created?: string | null;
          image_id?: string;
          updated?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "artist_image_mm_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artist";
            referencedColumns: ["artist_id"];
          },
          {
            foreignKeyName: "artist_image_mm_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "image";
            referencedColumns: ["image_id"];
          }
        ];
      };
      california_zip_codes: {
        Row: {
          code: string;
          zip_id: string;
        };
        Insert: {
          code: string;
          zip_id?: string;
        };
        Update: {
          code?: string;
          zip_id?: string;
        };
        Relationships: [];
      };
      catalog: {
        Row: {
          artist_id: string | null;
          available_stock: number;
          catalog_id: string;
          created: string | null;
          description: string | null;
          item_attributes: Json;
          max_stock_threshold: number;
          name: string;
          on_reorder: boolean;
          price: number;
          product_type: Database["product"]["Enums"]["product_type_enum"];
          record_format:
            | Database["product"]["Enums"]["record_format_enum"]
            | null;
          record_genre:
            | Database["product"]["Enums"]["record_genre_enum"]
            | null;
          restock_threshold: number;
          sku: string | null;
          upc: string | null;
          updated: string | null;
          weight: number | null;
        };
        Insert: {
          artist_id?: string | null;
          available_stock?: number;
          catalog_id?: string;
          created?: string | null;
          description?: string | null;
          item_attributes: Json;
          max_stock_threshold?: number;
          name: string;
          on_reorder?: boolean;
          price: number;
          product_type: Database["product"]["Enums"]["product_type_enum"];
          record_format?:
            | Database["product"]["Enums"]["record_format_enum"]
            | null;
          record_genre?:
            | Database["product"]["Enums"]["record_genre_enum"]
            | null;
          restock_threshold?: number;
          sku?: string | null;
          upc?: string | null;
          updated?: string | null;
          weight?: number | null;
        };
        Update: {
          artist_id?: string | null;
          available_stock?: number;
          catalog_id?: string;
          created?: string | null;
          description?: string | null;
          item_attributes?: Json;
          max_stock_threshold?: number;
          name?: string;
          on_reorder?: boolean;
          price?: number;
          product_type?: Database["product"]["Enums"]["product_type_enum"];
          record_format?:
            | Database["product"]["Enums"]["record_format_enum"]
            | null;
          record_genre?:
            | Database["product"]["Enums"]["record_genre_enum"]
            | null;
          restock_threshold?: number;
          sku?: string | null;
          upc?: string | null;
          updated?: string | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "catalog_artist_id_fkey";
            columns: ["artist_id"];
            isOneToOne: false;
            referencedRelation: "artist";
            referencedColumns: ["artist_id"];
          }
        ];
      };
      catalog_image_mm: {
        Row: {
          catalog_id: string;
          created: string | null;
          image_id: string;
          updated: string | null;
        };
        Insert: {
          catalog_id: string;
          created?: string | null;
          image_id: string;
          updated?: string | null;
        };
        Update: {
          catalog_id?: string;
          created?: string | null;
          image_id?: string;
          updated?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "catalog_image_mm_catalog_id_fkey";
            columns: ["catalog_id"];
            isOneToOne: false;
            referencedRelation: "catalog";
            referencedColumns: ["catalog_id"];
          },
          {
            foreignKeyName: "catalog_image_mm_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "image";
            referencedColumns: ["image_id"];
          }
        ];
      };
      country: {
        Row: {
          alpha2: string | null;
          alpha3: string | null;
          country_id: number;
          created: string | null;
          forbidden: boolean | null;
          name: string | null;
          updated: string | null;
        };
        Insert: {
          alpha2?: string | null;
          alpha3?: string | null;
          country_id?: never;
          created?: string | null;
          forbidden?: boolean | null;
          name?: string | null;
          updated?: string | null;
        };
        Update: {
          alpha2?: string | null;
          alpha3?: string | null;
          country_id?: never;
          created?: string | null;
          forbidden?: boolean | null;
          name?: string | null;
          updated?: string | null;
        };
        Relationships: [];
      };
      image: {
        Row: {
          caption: string | null;
          file_name: string;
          height: number | null;
          image_id: string;
          image_uom:
            | Database["product"]["Enums"]["image_unit_of_measurement"]
            | null;
          is_primary: boolean | null;
          uri: string;
          width: number | null;
        };
        Insert: {
          caption?: string | null;
          file_name: string;
          height?: number | null;
          image_id?: string;
          image_uom?:
            | Database["product"]["Enums"]["image_unit_of_measurement"]
            | null;
          is_primary?: boolean | null;
          uri: string;
          width?: number | null;
        };
        Update: {
          caption?: string | null;
          file_name?: string;
          height?: number | null;
          image_id?: string;
          image_uom?:
            | Database["product"]["Enums"]["image_unit_of_measurement"]
            | null;
          is_primary?: boolean | null;
          uri?: string;
          width?: number | null;
        };
        Relationships: [];
      };
      order: {
        Row: {
          canceled: string | null;
          created: string | null;
          email: string;
          fulfilled: string | null;
          order_id: string;
          order_number: string | null;
          paypal_order_id: string | null;
          shipping: number | null;
          subtotal: number | null;
          tax: number | null;
          tracking_number: string | null;
          updated: string | null;
          user_id: string | null;
        };
        Insert: {
          canceled?: string | null;
          created?: string | null;
          email: string;
          fulfilled?: string | null;
          order_id?: string;
          order_number?: string | null;
          paypal_order_id?: string | null;
          shipping?: number | null;
          subtotal?: number | null;
          tax?: number | null;
          tracking_number?: string | null;
          updated?: string | null;
          user_id?: string | null;
        };
        Update: {
          canceled?: string | null;
          created?: string | null;
          email?: string;
          fulfilled?: string | null;
          order_id?: string;
          order_number?: string | null;
          paypal_order_id?: string | null;
          shipping?: number | null;
          subtotal?: number | null;
          tax?: number | null;
          tracking_number?: string | null;
          updated?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      order_catalog_mm: {
        Row: {
          catalog_id: string;
          count: number | null;
          created: string | null;
          order_catalog_mm_id: string;
          order_id: string;
        };
        Insert: {
          catalog_id: string;
          count?: number | null;
          created?: string | null;
          order_catalog_mm_id?: string;
          order_id: string;
        };
        Update: {
          catalog_id?: string;
          count?: number | null;
          created?: string | null;
          order_catalog_mm_id?: string;
          order_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_catalog_mm_catalog_id_fkey";
            columns: ["catalog_id"];
            isOneToOne: false;
            referencedRelation: "catalog";
            referencedColumns: ["catalog_id"];
          },
          {
            foreignKeyName: "order_catalog_mm_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "order";
            referencedColumns: ["order_id"];
          }
        ];
      };
      record_label: {
        Row: {
          country_id: number | null;
          created: string | null;
          description: string | null;
          label_attributes: Json | null;
          name: string;
          record_label_id: string;
          updated: string | null;
        };
        Insert: {
          country_id?: number | null;
          created?: string | null;
          description?: string | null;
          label_attributes?: Json | null;
          name: string;
          record_label_id?: string;
          updated?: string | null;
        };
        Update: {
          country_id?: number | null;
          created?: string | null;
          description?: string | null;
          label_attributes?: Json | null;
          name?: string;
          record_label_id?: string;
          updated?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "record_label_country_id_fkey";
            columns: ["country_id"];
            isOneToOne: false;
            referencedRelation: "country";
            referencedColumns: ["country_id"];
          }
        ];
      };
      record_label_image_mm: {
        Row: {
          created: string | null;
          image_id: string;
          record_label_id: string;
          updated: string | null;
        };
        Insert: {
          created?: string | null;
          image_id: string;
          record_label_id: string;
          updated?: string | null;
        };
        Update: {
          created?: string | null;
          image_id?: string;
          record_label_id?: string;
          updated?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "record_label_image_mm_image_id_fkey";
            columns: ["image_id"];
            isOneToOne: false;
            referencedRelation: "image";
            referencedColumns: ["image_id"];
          },
          {
            foreignKeyName: "record_label_image_mm_record_label_id_fkey";
            columns: ["record_label_id"];
            isOneToOne: false;
            referencedRelation: "record_label";
            referencedColumns: ["record_label_id"];
          }
        ];
      };
      shopping_cart: {
        Row: {
          created: string | null;
          email: string | null;
          expires: string | null;
          fulfilled: string | null;
          shopping_cart_id: string;
          is_anonymous: boolean | null;
          state: Database["product"]["Enums"]["cart_state"] | null;
          updated: string | null;
          user_id: string | null;
        };
        Insert: {
          created?: string | null;
          email?: string | null;
          expires?: string | null;
          fulfilled?: string | null;
          shopping_cart_id?: string;
          is_anonymous?: boolean | null;
          state?: Database["product"]["Enums"]["cart_state"] | null;
          updated?: string | null;
          user_id?: string | null;
        };
        Update: {
          created?: string | null;
          email?: string | null;
          expires?: string | null;
          fulfilled?: string | null;
          shopping_cart_id?: string;
          is_anonymous?: boolean | null;
          state?: Database["product"]["Enums"]["cart_state"] | null;
          updated?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      shopping_cart_catalog_mm: {
        Row: {
          catalog_id: string | null;
          count: number | null;
          created: string | null;
          shopping_cart_id: string | null;
          shopping_cart_catalog_mm_id: string;
        };
        Insert: {
          catalog_id?: string | null;
          count?: number | null;
          created?: string | null;
          shopping_cart_id?: string | null;
          shopping_cart_catalog_mm_id?: string;
        };
        Update: {
          catalog_id?: string | null;
          count?: number | null;
          created?: string | null;
          shopping_cart_id?: string | null;
          shopping_cart_catalog_mm_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shopping_cart_catalog_mm_catalog_id_fkey";
            columns: ["catalog_id"];
            isOneToOne: false;
            referencedRelation: "catalog";
            referencedColumns: ["catalog_id"];
          },
          {
            foreignKeyName: "shopping_cart_catalog_mm_shopping_cart_id_fkey";
            columns: ["shopping_cart_id"];
            isOneToOne: false;
            referencedRelation: "shopping_cart";
            referencedColumns: ["shopping_cart_id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_to_catalog: {
        Args: {
          _artist_name: string;
          _product_type: Database["product"]["Enums"]["product_type_enum"];
          _record_format: Database["product"]["Enums"]["record_format_enum"];
          _record_genre: Database["product"]["Enums"]["record_genre_enum"];
          _price: number;
          _item_attributes: Json;
          _weight?: number;
        };
        Returns: {
          artist_id: string | null;
          available_stock: number;
          catalog_id: string;
          created: string | null;
          description: string | null;
          item_attributes: Json;
          max_stock_threshold: number;
          name: string;
          on_reorder: boolean;
          price: number;
          product_type: Database["product"]["Enums"]["product_type_enum"];
          record_format:
            | Database["product"]["Enums"]["record_format_enum"]
            | null;
          record_genre:
            | Database["product"]["Enums"]["record_genre_enum"]
            | null;
          restock_threshold: number;
          sku: string | null;
          upc: string | null;
          updated: string | null;
          weight: number | null;
        }[];
      };
      add_to_shopping_cart: {
        Args: { _catalog_id: string; _is_anonymous?: boolean; _count?: number };
        Returns: Json;
      };
      create_catalog: {
        Args: {
          _artist_id: string;
          _name: string;
          _description: string;
          _product_type: Database["product"]["Enums"]["product_type_enum"];
          _price: number;
          _record_format?: Database["product"]["Enums"]["record_format_enum"];
          _record_genre?: Database["product"]["Enums"]["record_genre_enum"];
          _available_stock?: number;
          _restock_threshold?: number;
          _max_stock_threshold?: number;
          _on_reorder?: boolean;
          _item_attributes?: Json;
          _sku?: string;
          _upc?: string;
        };
        Returns: string;
      };
      create_order_placeholder: {
        Args: { _email: string };
        Returns: Json;
      };
      gen_ksr_order_number: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_artist: {
        Args: { _artist_id: string; _maxresults?: number };
        Returns: Json;
      };
      get_artists: {
        Args: { _record_label_id?: string; _maxresults?: number };
        Returns: Json;
      };
      get_jwt: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_labels: {
        Args: { _label?: string; _maxresults?: number };
        Returns: Json;
      };
      get_records: {
        Args: { _catalog_id?: string; _max_results?: number };
        Returns: Json;
      };
      get_shopping_cart: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_shopping_cart_items: {
        Args: { _user_id: string; _is_anonymous: boolean };
        Returns: {
          shopping_cart_id: string;
          catalog_id: string;
          count: number;
        }[];
      };
      get_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      merge_shopping_carts: {
        Args: { _anon_user_id: string };
        Returns: Json;
      };
      shopping_cart_exists: {
        Args: { _user_id: string; _is_anonymous?: boolean };
        Returns: boolean;
      };
      shopping_cart_item_exists: {
        Args: { _user_id: string; _catalog_id: string };
        Returns: boolean;
      };
      update_shopping_cart: {
        Args: { _catalog_id: string; _count: number; _email?: string };
        Returns: Json;
      };
    };
    Enums: {
      address_type: "Shipping" | "Billing" | "Both";
      cart_state: "Cart" | "Processing" | "OrderPlaced";
      image_unit_of_measurement: "px" | "em" | "%";
      product_type_enum: "Record" | "Clothing" | "Accessories" | "Books";
      record_format_enum:
        | "CD"
        | "Cassette"
        | "DigitalDownload"
        | "VinylLP"
        | "VinylEP"
        | "VinylSingle";
      record_genre_enum: "Metal" | "Rock" | "Punk" | "Alternative";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      [_ in never]: never;
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

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  product: {
    Enums: {
      address_type: ["Shipping", "Billing", "Both"],
      cart_state: ["Cart", "Processing", "OrderPlaced"],
      image_unit_of_measurement: ["px", "em", "%"],
      product_type_enum: ["Record", "Clothing", "Accessories", "Books"],
      record_format_enum: [
        "CD",
        "Cassette",
        "DigitalDownload",
        "VinylLP",
        "VinylEP",
        "VinylSingle",
      ],
      record_genre_enum: ["Metal", "Rock", "Punk", "Alternative"],
    },
  },
  public: {
    Enums: {},
  },
} as const;
