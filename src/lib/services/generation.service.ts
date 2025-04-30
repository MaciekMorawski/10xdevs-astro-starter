import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { FlashcardProposalDto, GenerationCreateResponseDto } from "../../types";

export class GenerationService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async generateFlashcards(sourceText: string, userId: string): Promise<GenerationCreateResponseDto> {
    const startTime = Date.now();
    try {
      // Step 1: Create generation record in database
      const { data: generation, error: dbError } = await this.supabase
        .from("generations")
        .insert([
          {
            source_text_length: sourceText.length,
            source_text_hash: await this.computeHash(sourceText),
            model: "gpt-4",
            user_id: userId,
            generated_count: 0,
            generation_duration: 0,
          },
        ])
        .select("id")
        .single();

      if (dbError) throw dbError;

      // Step 2: Generate flashcards using AI (mocked for now)
      const flashcardsProposals = await this.callAIService(sourceText);

      // Step 3: Update generation record with results
      const generationDuration = Date.now() - startTime;
      const { error: updateError } = await this.supabase
        .from("generations")
        .update({
          generated_count: flashcardsProposals.length,
          generation_duration: generationDuration,
        })
        .eq("id", generation.id);

      if (updateError) throw updateError;

      return {
        generation_id: generation.id,
        flashcards_proposals: flashcardsProposals,
        generated_count: flashcardsProposals.length,
      };
    } catch (error) {
      // Log error to generation_error_logs table
      await this.logGenerationError(error, sourceText.length, userId);
      throw error;
    }
  }

  private async computeHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  private async callAIService(_sourceText: string): Promise<FlashcardProposalDto[]> {
    // TODO: Implement actual AI service call using the sourceText parameter
    // Mock implementation for development
    return [
      {
        front: "What is a mock implementation?",
        back: "A temporary replacement for actual functionality during development.",
        source: "ai-full",
      },
    ];
  }

  private async logGenerationError(error: unknown, textLength: number, userId: string): Promise<void> {
    try {
      await this.supabase.from("generation_error_logs").insert([
        {
          error_code: "GENERATION_FAILED",
          error_message: error instanceof Error ? error.message : String(error),
          model: "gpt-4",
          source_text_length: textLength,
          source_text_hash: await this.computeHash(error instanceof Error ? error.message : String(error)),
          user_id: userId,
        },
      ]);
    } catch (logError) {
      // In a production environment, this should use a proper logging service
      throw new Error(`Failed to log generation error: ${String(logError)}`);
    }
  }
}
