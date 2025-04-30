import type { SupabaseClient } from "../../db/supabase.client";
import type { FlashcardProposalDto, GenerationCreateResponseDto } from "../../types";

// Default user ID for MVP (we'll replace this with actual auth later)
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

export class GenerationService {
  constructor(private supabase: SupabaseClient) {}

  async generateFlashcards(sourceText: string): Promise<GenerationCreateResponseDto> {
    const startTime = Date.now();
    try {
      // Step 1: Create generation record in database with required fields
      const { data: generation, error: dbError } = await this.supabase
        .from("generations")
        .insert({
          source_text_length: sourceText.length,
          source_text_hash: await this.computeHash(sourceText),
          model: "gpt-4",
          generated_count: 0, // Required field, will update after generation
          generation_duration: 0, // Required field, will update after generation
          user_id: DEFAULT_USER_ID,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      // Step 2: Generate flashcards using AI (mocked for now)
      const flashcardsProposals = await this.callAIService(sourceText);

      // Step 3: Update generation record with actual results
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
      await this.logGenerationError(error, sourceText.length);
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

  private async callAIService(): Promise<FlashcardProposalDto[]> {
    // TODO: Implement actual AI service call
    return [
      {
        front: "What is a mock implementation?",
        back: "A temporary replacement for actual functionality during development.",
        source: "ai-full",
      },
    ];
  }

  private async logGenerationError(error: unknown, textLength: number): Promise<void> {
    try {
      const errorHash = await this.computeHash(error instanceof Error ? error.message : String(error));

      await this.supabase.from("generation_error_logs").insert({
        error_code: "GENERATION_FAILED",
        error_message: error instanceof Error ? error.message : String(error),
        model: "gpt-4",
        source_text_length: textLength,
        source_text_hash: errorHash,
        user_id: DEFAULT_USER_ID,
      });
    } catch (logError) {
      throw new Error(`Failed to log generation error: ${String(logError)}`);
    }
  }
}
