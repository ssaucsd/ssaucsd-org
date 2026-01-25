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
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
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
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string;
          description: string | null;
          end_time: string;
          id: string;
          image_url: string;
          location: string;
          start_time: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_time: string;
          id?: string;
          image_url?: string;
          location: string;
          start_time: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_time?: string;
          id?: string;
          image_url?: string;
          location?: string;
          start_time?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          email: string;
          first_name: string;
          graduation_year: number | null;
          id: string;
          instrument: string | null;
          is_onboarded: boolean;
          last_name: string;
          major: string | null;
          preferred_name: string | null;
          role: Database["public"]["Enums"]["role"];
        };
        Insert: {
          email: string;
          first_name: string;
          graduation_year?: number | null;
          id: string;
          instrument?: string | null;
          is_onboarded?: boolean;
          last_name: string;
          major?: string | null;
          preferred_name?: string | null;
          role?: Database["public"]["Enums"]["role"];
        };
        Update: {
          email?: string;
          first_name?: string;
          graduation_year?: number | null;
          id?: string;
          instrument?: string | null;
          is_onboarded?: boolean;
          last_name?: string;
          major?: string | null;
          preferred_name?: string | null;
          role?: Database["public"]["Enums"]["role"];
        };
        Relationships: [];
      };
      resource_tags: {
        Row: {
          created_at: string;
          resource_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          resource_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          resource_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "resource_tags_resource_id_fkey";
            columns: ["resource_id"];
            isOneToOne: false;
            referencedRelation: "resources";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "resource_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      resources: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_pinned: boolean;
          link: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_pinned?: boolean;
          link: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_pinned?: boolean;
          link?: string;
          name?: string;
        };
        Relationships: [];
      };
      rsvps: {
        Row: {
          created_at: string;
          event_id: string;
          id: string;
          status: Database["public"]["Enums"]["rsvp_status"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          id?: string;
          status?: Database["public"]["Enums"]["rsvp_status"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          id?: string;
          status?: Database["public"]["Enums"]["rsvp_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rsvps_user_id_profiles_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          display_order: number;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          display_order?: number;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      role: "admin" | "user";
      rsvp_status: "going" | "maybe" | "not_going";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      role: ["admin", "user"],
      rsvp_status: ["going", "maybe", "not_going"],
    },
  },
} as const;
