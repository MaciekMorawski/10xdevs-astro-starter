
import type { Database } from './db/database.types';

/**

DTO reprezentujący pojedynczą fiszkę w odpowiedziach API.

Bazuje na wierszu tabeli flashcards bez pola userid.
*/
export type FlashcardDto = Omit<
Database['public']['Tables']['flashcards']['Row'],'userid';

/**

Meta-informacje o paginacji dla list.
*/
export interface PaginationDto {
page: number;
limit: number;
total: number;
}

/**

Command Model do tworzenia pojedynczej fiszki.

Zawiera tylko pola wymagane przez endpoint POST /flashcards.
*/
export type CreateFlashcardDto = Pick<
Database['public']['Tables']['flashcards']['Insert'],
'front' | 'back' | 'source' | 'generationid'

;

/**

Wrapper dla batchowego tworzenia fiszek.
*/
export interface CreateFlashcardsRequest {
flashcards: CreateFlashcardDto[];
}

/**

Command Model do aktualizacji istniejącej fiszki.

Wyklucza pola generowane przez bazę (id, createdat, updatedat) i userid.
*/
export type UpdateFlashcardDto = Omit<
Database['public']['Tables']['flashcards']['Update'],
'id' | 'userid' | 'createdat' | 'updatedat'

;

/**

DTO pojedynczej propozycji fiszki wygenerowanej przez AI.

Używane w odpowiedzi POST /generations.
*/
export type FlashcardProposalDto = Pick<
CreateFlashcardDto,
'front' | 'back' | 'source'

;

/**

Odpowiedź po zainicjowaniu generacji AI, zawiera ID sesji,

liczbę wygenerowanych fiszek oraz same propozycje.
*/
export interface CreateGenerationResponseDto {
generationid: number;
flashcardProposals: FlashcardProposalDto[];
generatedcount: number;
}

/**

Command Model do zainicjowania procesu generacji fiszek przez AI.
*/
export interface CreateGenerationDto {
sourcetext: string;
}

/**

DTO reprezentujący wiersz tabeli generations bez userid.
*/
export type GenerationDto = Omit<
Database['public']['Tables']['generations']['Row'],
'userid'

;

/**

Szczegółowy DTO generacji, zawiera jej metadane i powiązane fiszki.
*/
export interface GenerationDetailDto extends GenerationDto {
flashcards: FlashcardDto[];
}

/**

DTO dla logów błędów generacji (tabela generationerrorlogs) bez userid.
*/
export type GenerationErrorLogDto = Omit<
Database['public']['Tables']['generationerrorlogs']['Row'],
'userid'

;
