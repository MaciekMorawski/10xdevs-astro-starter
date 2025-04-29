<conversation_summary>
<decisions>
1. Kolekcje fiszek realizowane przez płaskie tagi, bez oddzielnej encji „deck”/„set”.  
2. Statystyki przechowywane jako agregaty na poziomie fiszki, bez surowych logów sesji.  
3. W schemacie SRS minimalne atrybuty: next_review_at, interval, ease_factor, repetition_count.  
4. Dla każdej fiszki przechowujemy źródłowy tekst i identyfikator sesji generacji AI.  
5. Historia edycji ograniczona do last_edited_at i flagi accepted, bez pełnej tabeli zmian.  
6. Ograniczenia długości: front_text 500 znaków; back_text 1000 znaków; komentarz błędu 500 znaków.  
7. Klucze główne jako UUID.  
8. Role użytkowników: user i admin.  
9. Oddzielna tabela error_reports z fk do flashcard_id i user_id, ze statusem i workflow.  
10. Eksport na żądanie bez śledzenia zadań export_jobs; format CSV/JSON i opcjonalna nazwa pliku.  
11. W MVP wyszukiwanie proste (LIKE/ILIKE), bez kolumn TSVECTOR/pg_trgm.  
12. Dane przechowywane bezterminowo, brak automatycznej archiwizacji/usuwania.  
13. Tabela users: id, role, email, username, password_hash, created_at, updated_at.  
14. Brak mechanizmu soft-delete.  
15. Tagi płaskie z atrybutami name, slug, description, color.  
16. Fiszki wspierają wielojęzyczność (language_code) i opcjonalne source_url.  
17. Timestampy (created_at, updated_at) jako timestamptz default now() we wszystkich tabelach.  
18. Unikalny indeks (user_id, front_text) dla zapobiegania duplikatom.  
19. RLS wymusza user_id = current_user w zapytaniach, ale nie blokuje batch updates.
</decisions>

<matched_recommendations>
1. Definiowanie klarownych wymagań i ograniczeń dla MVP (Best Practice: „Define Clear Requirements”)[4].  
2. Normalizacja danych przez osobne tabele i relacje many-to-many (Best Practice: „Normalize Your Data”)[4].  
3. Priorytet bezpieczeństwa: szyfrowanie danych, RLS, hashowanie haseł (Best Practice: „Prioritise Security”)[4].  
4. Planowanie skalowalności: UUID dla kluczy, prosty schemat, późniejsze dodanie indeksów FTS (Best Practice: „Plan for Scalability”)[4].  
5. Testowanie i iteracyjne udoskonalanie – MVP z możliwością późniejszej rozbudowy (Best Practice: „Test and Iterate”)[4].
</matched_recommendations>

<database_planning_summary>
Schemat bazy danych MVP Flashcards AI obejmuje pięć głównych entitów:  
• users – konta użytkowników (UUID, rola, email, username, password_hash, created_at, updated_at).  
• flashcards – fiszki (UUID, fk user_id, front_text, back_text, language_code, source_url, next_review_at, interval, ease_factor, repetition_count, last_edited_at, accepted_flag, timestamps).  
• tags – etykiety (UUID, name, slug, description, color).  
• flashcard_tags – relacja many-to-many między flashcards i tags.  
• error_reports – zgłoszenia błędów AI (UUID, fk flashcard_id, fk user_id, status ENUM{open,resolved}, created_at, updated_at, resolved_at, resolution_comment).  

Relacje:  
– users 1:n flashcards  
– flashcards n:m tags (przez flashcard_tags)  
– users 1:n error_reports; flashcards 1:n error_reports  

Bezpieczeństwo:  
– UUID dla kluczy głównych i zewnętrznych  
– RLS wymuszające user_id = current_user  
– Haszowane hasła, szyfrowanie w tranzycie i spoczynku  

Skalowalność i wydajność:  
– Unikalny indeks na (user_id, front_text)  
– Proste wyszukiwanie tekstowe z LIKE/ILIKE; rezerwa na FTS w przyszłości  
– Użycie timestamptz dla wszystkich dat, automatyczne uwzględnienie strefy czasowej  

Pozostała funkcjonalność AI:  
– Przechowywanie źródłowego tekstu i sesji generacji  
– Uproszczony workflow akceptacji fiszek (flagą accepted lub upływem 24 godzin)
</database_planning_summary>

<unresolved_issues>
1. Określenie polityki retencji danych (archiwizacja lub usuwanie po czasie).  
2. Potencjalne wprowadzenie mechanizmu soft-delete w przyszłych iteracjach.  
3. Rozbudowa wyszukiwania – hierarchiczne tagi i pełnotekstowe indeksy FTS.  
4. Ewentualna tabela export_jobs dla śledzenia zadań eksportu.  
5. Szczegóły dotyczące rozbudowanego workflow edycji i historii zmian.
</unresolved_issues>
</conversation_summary>

<conversation_summary>
<decisions>
1. Kolekcje fiszek realizowane przez płaskie tagi, bez oddzielnej encji „deck”/„set”.  
2. Statystyki przechowywane jako agregaty na poziomie fiszki, bez surowych logów sesji.  
3. W schemacie SRS minimalne atrybuty: next_review_at, interval, ease_factor, repetition_count.  
4. Dla każdej fiszki przechowujemy źródłowy tekst i identyfikator sesji generacji AI.  
5. Historia edycji ograniczona do last_edited_at i flagi accepted, bez pełnej tabeli zmian.  
6. Ograniczenia długości: front_text 500 znaków; back_text 1000 znaków; komentarz błędu 500 znaków.  
7. Klucze główne jako UUID.  
8. Role użytkowników: user i admin.  
9. Oddzielna tabela error_reports z fk do flashcard_id i user_id, ze statusem i workflow.  
10. Eksport na żądanie bez śledzenia zadań export_jobs; format CSV/JSON i opcjonalna nazwa pliku.  
11. W MVP wyszukiwanie proste (LIKE/ILIKE), bez kolumn TSVECTOR/pg_trgm.  
12. Dane przechowywane bezterminowo, brak automatycznej archiwizacji/usuwania.  
13. Tabela users: id, role, email, username, password_hash, created_at, updated_at.  
14. Brak mechanizmu soft-delete.  
15. Tagi płaskie z atrybutami name, slug, description, color.  
16. Fiszki wspierają wielojęzyczność (language_code) i opcjonalne source_url.  
17. Timestampy (created_at, updated_at) jako timestamptz default now() we wszystkich tabelach.  
18. Unikalny indeks (user_id, front_text) dla zapobiegania duplikatom.  
19. RLS wymusza user_id = current_user w zapytaniach, ale nie blokuje batch updates.
</decisions>

<matched_recommendations>
1. Definiowanie klarownych wymagań i ograniczeń dla MVP (Best Practice: „Define Clear Requirements”)[4].  
2. Normalizacja danych przez osobne tabele i relacje many-to-many (Best Practice: „Normalize Your Data”)[4].  
3. Priorytet bezpieczeństwa: szyfrowanie danych, RLS, hashowanie haseł (Best Practice: „Prioritise Security”)[4].  
4. Planowanie skalowalności: UUID dla kluczy, prosty schemat, późniejsze dodanie indeksów FTS (Best Practice: „Plan for Scalability”)[4].  
5. Testowanie i iteracyjne udoskonalanie – MVP z możliwością późniejszej rozbudowy (Best Practice: „Test and Iterate”)[4].
</matched_recommendations>

<database_planning_summary>
Schemat bazy danych MVP Flashcards AI obejmuje pięć głównych entitów:  
• users – konta użytkowników (UUID, rola, email, username, password_hash, created_at, updated_at).  
• flashcards – fiszki (UUID, fk user_id, front_text, back_text, language_code, source_url, next_review_at, interval, ease_factor, repetition_count, last_edited_at, accepted_flag, timestamps).  
• tags – etykiety (UUID, name, slug, description, color).  
• flashcard_tags – relacja many-to-many między flashcards i tags.  
• error_reports – zgłoszenia błędów AI (UUID, fk flashcard_id, fk user_id, status ENUM{open,resolved}, created_at, updated_at, resolved_at, resolution_comment).  

Relacje:  
– users 1:n flashcards  
– flashcards n:m tags (przez flashcard_tags)  
– users 1:n error_reports; flashcards 1:n error_reports  

Bezpieczeństwo:  
– UUID dla kluczy głównych i zewnętrznych  
– RLS wymuszające user_id = current_user  
– Haszowane hasła, szyfrowanie w tranzycie i spoczynku  

Skalowalność i wydajność:  
– Unikalny indeks na (user_id, front_text)  
– Proste wyszukiwanie tekstowe z LIKE/ILIKE; rezerwa na FTS w przyszłości  
– Użycie timestamptz dla wszystkich dat, automatyczne uwzględnienie strefy czasowej  

Pozostała funkcjonalność AI:  
– Przechowywanie źródłowego tekstu i sesji generacji  
– Uproszczony workflow akceptacji fiszek (flagą accepted lub upływem 24 godzin)
</database_planning_summary>

<unresolved_issues>
1. Określenie polityki retencji danych (archiwizacja lub usuwanie po czasie).  
2. Potencjalne wprowadzenie mechanizmu soft-delete w przyszłych iteracjach.  
3. Rozbudowa wyszukiwania – hierarchiczne tagi i pełnotekstowe indeksy FTS.  
4. Ewentualna tabela export_jobs dla śledzenia zadań eksportu.  
5. Szczegóły dotyczące rozbudowanego workflow edycji i historii zmian.
</unresolved_issues>
</conversation_summary>
