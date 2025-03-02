export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      available_achievements: {
        Row: {
          created_at: string
          description: string
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          title?: string
        }
        Relationships: []
      }
      chat: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image: string[] | null
          role: string
          session: string | null
          user: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image?: string[] | null
          role: string
          session?: string | null
          user: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image?: string[] | null
          role?: string
          session?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guild_showcase: {
        Row: {
          created_at: string
          guild_id: number | null
          id: number
          showcase_id: string | null
        }
        Insert: {
          created_at?: string
          guild_id?: number | null
          id?: number
          showcase_id?: string | null
        }
        Update: {
          created_at?: string
          guild_id?: number | null
          id?: number
          showcase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guild_channels_guild_id_fkey"
            columns: ["guild_id"]
            isOneToOne: false
            referencedRelation: "guilds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guild_showcase_showcase_id_fkey"
            columns: ["showcase_id"]
            isOneToOne: false
            referencedRelation: "showcase"
            referencedColumns: ["id"]
          },
        ]
      }
      guilds: {
        Row: {
          created_at: string
          guild_name: string | null
          id: number
          owner: string | null
        }
        Insert: {
          created_at?: string
          guild_name?: string | null
          id?: number
          owner?: string | null
        }
        Update: {
          created_at?: string
          guild_name?: string | null
          id?: number
          owner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guilds_user_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chatid: string
          content: string
          created_at: string
          id: number
          image: string[] | null
          role: string
        }
        Insert: {
          chatid: string
          content: string
          created_at?: string
          id?: number
          image?: string[] | null
          role: string
        }
        Update: {
          chatid?: string
          content?: string
          created_at?: string
          id?: number
          image?: string[] | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chatid_fkey"
            columns: ["chatid"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          current_project: number | null
          id: string
          username: string
          xp: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_project?: number | null
          id: string
          username: string
          xp?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_project?: number | null
          id?: string
          username?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_project_fkey"
            columns: ["current_project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_attachments: {
        Row: {
          created_at: string
          id: number
          project: number
        }
        Insert: {
          created_at?: string
          id?: number
          project: number
        }
        Update: {
          created_at?: string
          id?: number
          project?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_attachments_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roadmap: {
        Row: {
          completed: boolean
          created_at: string
          id: number
          position: number
          project: number
          task: string
        }
        Insert: {
          completed: boolean
          created_at?: string
          id?: number
          position: number
          project: number
          task: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: number
          position?: number
          project?: number
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_roadmap_project_fkey"
            columns: ["project"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string
          id: number
          progress: number
          title: string
          user: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          progress?: number
          title: string
          user: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          progress?: number
          title?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_chat: {
        Row: {
          content: string | null
          id: number
          image: string[] | null
          project_id: number | null
          role: string | null
          user: string | null
        }
        Insert: {
          content?: string | null
          id?: number
          image?: string[] | null
          project_id?: number | null
          role?: string | null
          user?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          image?: string[] | null
          project_id?: number | null
          role?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_chat_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_chat_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      showcase: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          project_id: number | null
          showcase_name: string | null
          user: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          project_id?: number | null
          showcase_name?: string | null
          user?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          project_id?: number | null
          showcase_name?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "showcase_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showcase_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement: number
          created_at: string
          id: number
          user: string
        }
        Insert: {
          achievement: number
          created_at?: string
          id?: number
          user: string
        }
        Update: {
          achievement?: number
          created_at?: string
          id?: number
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_achievement_fkey"
            columns: ["achievement"]
            isOneToOne: false
            referencedRelation: "available_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
