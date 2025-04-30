# API Endpoint Implementation Plan: Generations Endpoint (POST /generations)

## 1. Przegląd punktu końcowego

Endpoint służy do inicjacji procesu generowania propozycji fiszek przez AI na podstawie podanego tekstu. Walidacja sprawdza, czy długość tekstu mieści się w przedziale od 1000 do 10000 znaków. W zależności od wyniku wywoływana jest usługa AI, a następnie zapisywane są metadane generacji i zwracane propozycje fiszek.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /generations
- **Parametry:**
  - **Wymagane (w ciele żądania):**
    - `source_text`: string (1000-10000 znaków)
- **Request Body Example:**

  ```json
  {
    "source_text": "User provided text that must contain between 1000 and 10000 characters..."
  }
  ```

## 3. Wykorzystywane typy

DTO/Command Model:
GenerateFlashcardsCommand (typ reprezentujący dane wejściowe)
GenerationCreateResponseDto (typ reprezentujący odpowiedź z metadanymi oraz propozycjami fiszek)
FlashcardProposalDto (typ reprezentujący pojedynczą propozycję fiszki)

## 4. Szczegóły odpowiedzi

- **Status 201 (Created)**:

Zwracany obiekt zawiera:

- `generation_id`: number
- `flashcards_proposals`: array of FlashcardProposalDto
- `generated_count`: number

- **Response Body Example:**

  ```json
  {
    "generation_id": 123,
    "flashcards_proposals": [
      { "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }
    ],
    "generated_count": 5
  }
  ```

- **Kody błędów**:
-- 400: Nieprawidłowe dane wejściowe.
-- 401: Nieautoryzowany dostęp.
-- 500: Błąd wewnętrzny (np. problem z usługą AI).

## 5. Przepływ danych

Użytkownik wysyła żądanie POST z "source_text".
Serwer weryfikuje, czy "source_text" spełnia wymogi długości.
Po udanej walidacji, logika serwisu (np. generationService) wywołuje zewnętrzną usługę AI.
Metadane generacji (takie jak model, generated_count, duration) są zapisywane w tabeli generations.
W przypadku błędu usługi AI, informacje zapisywane są w tabeli generation_error_logs.
Po pomyślnym wykonaniu, odpowiedź zawiera generation_id oraz propozycje fiszek.

## 6. Względy bezpieczeństwa

Uwierzytelnienie: Endpoint dostępny tylko dla autoryzowanych użytkowników, korzystających z tokenów Supabase Auth.
Autoryzacja: Polityki RLS umożliwiają dostęp tylko do danych powiązanych z danym użytkownikiem.
Walidacja danych wejściowych: Upewnić się, że "source_text" mieści się w określonym zakresie.
Szyfrowanie: Wszystkie dane przesyłane przez HTTPS, a dane wrażliwe odpowiednio chronione.

## 7. Obsługa błędów

Błędne dane wejściowe (400):
Jeśli długość "source_text" jest mniejsza niż 1000 lub większa niż 10000 znaków.
Nieautoryzowany dostęp (401):
Brak tokena lub nieprawidłowy token.
Błąd serwera (500):
Awaria usługi AI, problem z zapisem do bazy lub inne nieoczekiwane błędy.
Każdy błąd powinien być logowany, a komunikaty błędów powinny być przyjazne dla użytkownika, nie ujawniając wrażliwych informacji.

## 8. Rozważania dotyczące wydajności

Upewnić się, że usługa walidacji danych działa szybko, aby nie blokować głównego wątku.
Optymalizacja wywołań do usługi AI – użycie asynchronicznych wywołań i poprawne zarządzanie timeoutami.
Paginacja i ograniczenie żądań w innych endpointach mogą być punktem odniesienia, choć w tym przypadku nie dotyczy to bezpośrednio pojedynczego żądania generacji.

## 9. Etapy wdrożenia

Walidacja wejścia:
Zaimplementować sprawdzanie długości "source_text" w kontrolerze lub dedykowanym middleware.
Integracja z usługą AI:
Wyodrębnić logikę wywołania usługi AI do nowego serwisu (np. genearionService w katalogu src/lib/services).
Upewnić się, że usługa obsługuje asynchroniczność i timeouty.
Operacje na bazie danych:
Zapisać metadane generacji w tabeli generations.
W przypadku błędów, zapisać logi w generation_error_logs.
Obsługa odpowiedzi API:
W przypadku powodzenia, zwrócić status 201 z obiektem typu GenerationCreateResponseDto.
W przypadku błędów (400, 401, 500), zwrócić właściwy kod stanu i format błędu.
Testy jednostkowe i integracyjne:
Stworzyć testy walidujące długość "source_text".
Przetestować integrację z usługą AI (można użyć mocków).
Zweryfikować poprawność zapisu danych w bazie.
Dokumentacja:
Zaktualizować dokumentację API oraz diagramy przepływu danych.
Przegląd i wdrożenie:
Code review, testy end-to-end oraz wdrożenie na środowisko staging przed produkcją.
