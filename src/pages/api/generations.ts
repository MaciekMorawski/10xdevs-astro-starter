import { z } from "zod";
import type { APIRoute } from "astro";
import type { GenerateFlashcardsCommand } from "../../types";
import { GenerationService } from "../../lib/services/generation.service";

export const prerender = false;

// Validation schema for the request body
const generateFlashcardsSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Text must be at least 1000 characters")
    .max(10000, "Text must not exceed 10000 characters"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await locals.supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Parse and validate the request body
    const body = (await request.json()) as GenerateFlashcardsCommand;
    const validatedData = generateFlashcardsSchema.parse(body);

    // Initialize service and generate flashcards
    const generationService = new GenerationService(locals.supabase);
    const result = await generationService.generateFlashcards(validatedData.source_text, user.id);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // For database or other internal errors, log the error but return a generic message
    if (error instanceof Error) {
      // In production, this should use a proper logging service
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
