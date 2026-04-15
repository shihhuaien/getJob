export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      api_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          name: string;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          token_hash: string;
          name?: string;
          created_at?: string;
          last_used_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          token_hash?: string;
          name?: string;
          created_at?: string;
          last_used_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          subscription_tier: "free" | "pro";
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: "free" | "pro";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          subscription_tier?: "free" | "pro";
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: Json;
          target_job_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: Json;
          target_job_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: Json;
          target_job_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_title: string;
          job_url: string | null;
          job_description: string | null;
          status: "saved" | "applied" | "interview" | "offer" | "rejected";
          salary_min: number | null;
          salary_max: number | null;
          notes: string | null;
          applied_at: string | null;
          resume_id: string | null;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          job_title: string;
          job_url?: string | null;
          job_description?: string | null;
          status?: "saved" | "applied" | "interview" | "offer" | "rejected";
          salary_min?: number | null;
          salary_max?: number | null;
          notes?: string | null;
          applied_at?: string | null;
          resume_id?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          job_title?: string;
          job_url?: string | null;
          job_description?: string | null;
          status?: "saved" | "applied" | "interview" | "offer" | "rejected";
          salary_min?: number | null;
          salary_max?: number | null;
          notes?: string | null;
          applied_at?: string | null;
          resume_id?: string | null;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cover_letters: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          job_application_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          job_application_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          job_application_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company: string | null;
          title: string | null;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          notes: string | null;
          follow_up_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          company?: string | null;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          notes?: string | null;
          follow_up_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          company?: string | null;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          notes?: string | null;
          follow_up_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      subscription_tier: "free" | "pro";
      application_status:
        | "saved"
        | "applied"
        | "interview"
        | "offer"
        | "rejected";
    };
  };
}
