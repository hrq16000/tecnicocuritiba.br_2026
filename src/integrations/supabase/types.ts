export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bairro_photo_proofs: {
        Row: {
          aprovada: boolean
          bairro_slug: string
          created_at: string
          id: string
          legenda: string | null
          observacoes: string | null
          route_path: string
          secao: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          aprovada?: boolean
          bairro_slug: string
          created_at?: string
          id?: string
          legenda?: string | null
          observacoes?: string | null
          route_path: string
          secao: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          aprovada?: boolean
          bairro_slug?: string
          created_at?: string
          id?: string
          legenda?: string | null
          observacoes?: string | null
          route_path?: string
          secao?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      click_events: {
        Row: {
          attribution_channel: string | null
          bairro: string | null
          cidade: string | null
          created_at: string
          cta_location: string | null
          cta_position: string | null
          customer_type: string | null
          equipamento: string | null
          event_type: string
          funnel_stage: string | null
          id: string
          modalidade: string | null
          path: string | null
          problema: string | null
          route_type: string | null
          servico: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          variant: string | null
          viewport_bucket: string | null
          viewport_width: number | null
        }
        Insert: {
          attribution_channel?: string | null
          bairro?: string | null
          cidade?: string | null
          created_at?: string
          cta_location?: string | null
          cta_position?: string | null
          customer_type?: string | null
          equipamento?: string | null
          event_type: string
          funnel_stage?: string | null
          id?: string
          modalidade?: string | null
          path?: string | null
          problema?: string | null
          route_type?: string | null
          servico?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant?: string | null
          viewport_bucket?: string | null
          viewport_width?: number | null
        }
        Update: {
          attribution_channel?: string | null
          bairro?: string | null
          cidade?: string | null
          created_at?: string
          cta_location?: string | null
          cta_position?: string | null
          customer_type?: string | null
          equipamento?: string | null
          event_type?: string
          funnel_stage?: string | null
          id?: string
          modalidade?: string | null
          path?: string | null
          problema?: string | null
          route_type?: string | null
          servico?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          variant?: string | null
          viewport_bucket?: string | null
          viewport_width?: number | null
        }
        Relationships: []
      }
      click_events_daily: {
        Row: {
          attribution_channel: string | null
          consolidated_at: string
          cta_location: string | null
          customer_type: string | null
          event_count: number
          event_date: string
          event_type: string
          funnel_stage: string | null
          generalized: boolean
          id: string
          path: string | null
          route_type: string | null
          servico: string | null
          viewport_bucket: string | null
        }
        Insert: {
          attribution_channel?: string | null
          consolidated_at?: string
          cta_location?: string | null
          customer_type?: string | null
          event_count: number
          event_date: string
          event_type: string
          funnel_stage?: string | null
          generalized?: boolean
          id?: string
          path?: string | null
          route_type?: string | null
          servico?: string | null
          viewport_bucket?: string | null
        }
        Update: {
          attribution_channel?: string | null
          consolidated_at?: string
          cta_location?: string | null
          customer_type?: string | null
          event_count?: number
          event_date?: string
          event_type?: string
          funnel_stage?: string | null
          generalized?: boolean
          id?: string
          path?: string | null
          route_type?: string | null
          servico?: string | null
          viewport_bucket?: string | null
        }
        Relationships: []
      }
      consent_events: {
        Row: {
          ads: boolean
          analytics: boolean
          created_at: string
          id: string
          path: string | null
          policy_version: string | null
          session_id: string | null
          source: string | null
        }
        Insert: {
          ads: boolean
          analytics: boolean
          created_at?: string
          id?: string
          path?: string | null
          policy_version?: string | null
          session_id?: string | null
          source?: string | null
        }
        Update: {
          ads?: boolean
          analytics?: boolean
          created_at?: string
          id?: string
          path?: string | null
          policy_version?: string | null
          session_id?: string | null
          source?: string | null
        }
        Relationships: []
      }
      funnel_submissions: {
        Row: {
          atendido_em: string | null
          atendido_por: string | null
          created_at: string
          equipamento: string | null
          gclid: string | null
          id: string
          marca: string | null
          media_paths: Json
          notas_admin: string | null
          requires_coleta: boolean
          session_id: string
          sintoma: string | null
          status_atendimento: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wa_message: string | null
        }
        Insert: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string
          equipamento?: string | null
          gclid?: string | null
          id?: string
          marca?: string | null
          media_paths?: Json
          notas_admin?: string | null
          requires_coleta?: boolean
          session_id: string
          sintoma?: string | null
          status_atendimento?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wa_message?: string | null
        }
        Update: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string
          equipamento?: string | null
          gclid?: string | null
          id?: string
          marca?: string | null
          media_paths?: Json
          notas_admin?: string | null
          requires_coleta?: boolean
          session_id?: string
          sintoma?: string | null
          status_atendimento?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wa_message?: string | null
        }
        Relationships: []
      }
      og_validation_status: {
        Row: {
          canonical: string | null
          checked_at: string
          city_slug: string
          created_at: string
          fb_error: string | null
          fb_status: string | null
          http_status: number | null
          id: string
          linkedin_error: string | null
          linkedin_status: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          raw: Json | null
          url: string
        }
        Insert: {
          canonical?: string | null
          checked_at?: string
          city_slug: string
          created_at?: string
          fb_error?: string | null
          fb_status?: string | null
          http_status?: number | null
          id?: string
          linkedin_error?: string | null
          linkedin_status?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          raw?: Json | null
          url: string
        }
        Update: {
          canonical?: string | null
          checked_at?: string
          city_slug?: string
          created_at?: string
          fb_error?: string | null
          fb_status?: string | null
          http_status?: number | null
          id?: string
          linkedin_error?: string | null
          linkedin_status?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          raw?: Json | null
          url?: string
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          cliente_nome: string | null
          created_at: string
          equipamento: string | null
          etapas: Json
          fotos: Json
          id: string
          marca_modelo: string | null
          modalidade: string | null
          observacoes_publicas: string | null
          previsao_conclusao: string | null
          protocolo: string
          sintomas: string | null
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          cliente_nome?: string | null
          created_at?: string
          equipamento?: string | null
          etapas?: Json
          fotos?: Json
          id?: string
          marca_modelo?: string | null
          modalidade?: string | null
          observacoes_publicas?: string | null
          previsao_conclusao?: string | null
          protocolo: string
          sintomas?: string | null
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          cliente_nome?: string | null
          created_at?: string
          equipamento?: string | null
          etapas?: Json
          fotos?: Json
          id?: string
          marca_modelo?: string | null
          modalidade?: string | null
          observacoes_publicas?: string | null
          previsao_conclusao?: string | null
          protocolo?: string
          sintomas?: string | null
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      os_lookup_attempts: {
        Row: {
          created_at: string
          found: boolean
          id: string
          ip_hash: string
          latency_ms: number | null
          outcome: string | null
          path: string | null
          telefone_hash: string
        }
        Insert: {
          created_at?: string
          found?: boolean
          id?: string
          ip_hash: string
          latency_ms?: number | null
          outcome?: string | null
          path?: string | null
          telefone_hash: string
        }
        Update: {
          created_at?: string
          found?: boolean
          id?: string
          ip_hash?: string
          latency_ms?: number | null
          outcome?: string | null
          path?: string | null
          telefone_hash?: string
        }
        Relationships: []
      }
      os_verification_codes: {
        Row: {
          attempts: number
          code_hash: string
          code_plain: string | null
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          ip_hash: string
          telefone_hash: string
          telefone_masked: string | null
        }
        Insert: {
          attempts?: number
          code_hash: string
          code_plain?: string | null
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          ip_hash: string
          telefone_hash: string
          telefone_masked?: string | null
        }
        Update: {
          attempts?: number
          code_hash?: string
          code_plain?: string | null
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          ip_hash?: string
          telefone_hash?: string
          telefone_masked?: string | null
        }
        Relationships: []
      }
      quick_wins_backlog: {
        Row: {
          acao: string | null
          cluster: string | null
          created_at: string
          created_by: string | null
          evidencia: string | null
          hipotese: string
          id: string
          marco: string
          prioridade: number
          responsavel: string | null
          resultado: string | null
          status: string
          titulo: string
          updated_at: string
          url_path: string
        }
        Insert: {
          acao?: string | null
          cluster?: string | null
          created_at?: string
          created_by?: string | null
          evidencia?: string | null
          hipotese: string
          id?: string
          marco?: string
          prioridade?: number
          responsavel?: string | null
          resultado?: string | null
          status?: string
          titulo: string
          updated_at?: string
          url_path: string
        }
        Update: {
          acao?: string | null
          cluster?: string | null
          created_at?: string
          created_by?: string | null
          evidencia?: string | null
          hipotese?: string
          id?: string
          marco?: string
          prioridade?: number
          responsavel?: string | null
          resultado?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          url_path?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_name: string
          author_photo_url: string | null
          authorized_publication: boolean
          city: string | null
          client_phone: string | null
          comment: string
          created_at: string
          google_review_url: string | null
          id: string
          neighborhood: string | null
          origin_path: string | null
          origin_protocol: string | null
          published: boolean
          rating: number
          review_date: string
          service_closed_at: string | null
          service_slug: string | null
          source: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          author_name: string
          author_photo_url?: string | null
          authorized_publication?: boolean
          city?: string | null
          client_phone?: string | null
          comment: string
          created_at?: string
          google_review_url?: string | null
          id?: string
          neighborhood?: string | null
          origin_path?: string | null
          origin_protocol?: string | null
          published?: boolean
          rating: number
          review_date?: string
          service_closed_at?: string | null
          service_slug?: string | null
          source?: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          author_name?: string
          author_photo_url?: string | null
          authorized_publication?: boolean
          city?: string | null
          client_phone?: string | null
          comment?: string
          created_at?: string
          google_review_url?: string | null
          id?: string
          neighborhood?: string | null
          origin_path?: string | null
          origin_protocol?: string | null
          published?: boolean
          rating?: number
          review_date?: string
          service_closed_at?: string | null
          service_slug?: string | null
          source?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      telemetry_retention_runs: {
        Row: {
          created_at: string
          details: Json
          dry_run: boolean
          id: string
          outcome: string
          period_end: string | null
          period_start: string | null
          rows_deleted: number
          rows_scanned: number
          rows_suppressed: number
          rows_written: number
          run_type: string
        }
        Insert: {
          created_at?: string
          details?: Json
          dry_run?: boolean
          id?: string
          outcome: string
          period_end?: string | null
          period_start?: string | null
          rows_deleted?: number
          rows_scanned?: number
          rows_suppressed?: number
          rows_written?: number
          run_type: string
        }
        Update: {
          created_at?: string
          details?: Json
          dry_run?: boolean
          id?: string
          outcome?: string
          period_end?: string | null
          period_start?: string | null
          rows_deleted?: number
          rows_scanned?: number
          rows_suppressed?: number
          rows_written?: number
          run_type?: string
        }
        Relationships: []
      }
      url_audit_checks: {
        Row: {
          conferido_em: string
          conferido_por: string | null
          conferido_por_email: string | null
          evidencia: Json | null
          id: string
          item: string
          marco: string | null
          observacao: string | null
          resultado: string
          url_path: string
        }
        Insert: {
          conferido_em?: string
          conferido_por?: string | null
          conferido_por_email?: string | null
          evidencia?: Json | null
          id?: string
          item: string
          marco?: string | null
          observacao?: string | null
          resultado: string
          url_path: string
        }
        Update: {
          conferido_em?: string
          conferido_por?: string | null
          conferido_por_email?: string | null
          evidencia?: Json | null
          id?: string
          item?: string
          marco?: string | null
          observacao?: string | null
          resultado?: string
          url_path?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      reviews_public: {
        Row: {
          author_name: string | null
          author_photo_url: string | null
          city: string | null
          comment: string | null
          created_at: string | null
          id: string | null
          neighborhood: string | null
          rating: number | null
          review_date: string | null
          service_slug: string | null
        }
        Insert: {
          author_name?: string | null
          author_photo_url?: string | null
          city?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          neighborhood?: string | null
          rating?: number | null
          review_date?: string | null
          service_slug?: string | null
        }
        Update: {
          author_name?: string | null
          author_photo_url?: string | null
          city?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string | null
          neighborhood?: string | null
          rating?: number | null
          review_date?: string | null
          service_slug?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      consolidate_click_events: {
        Args: { p_until?: string }
        Returns: {
          rows_scanned: number
          rows_suppressed: number
          rows_written: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_qa_click_event: {
        Args: {
          _created_at: string
          _session_id: string
          _utm_campaign: string
          _utm_medium: string
          _utm_source: string
        }
        Returns: boolean
      }
      purge_click_events_aggregates: {
        Args: { p_dry_run?: boolean }
        Returns: {
          candidate_rows: number
          deleted_rows: number
        }[]
      }
      purge_click_events_raw: {
        Args: { p_dry_run?: boolean }
        Returns: {
          blocked_days: number
          candidate_rows: number
          deleted_rows: number
        }[]
      }
      telemetry_baseline_comercial: { Args: never; Returns: string }
      telemetry_guard_selftest: { Args: never; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
