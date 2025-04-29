# Definiowanie schematu bazy danych

## 1. Tabele

### users  

Tabela przechowuje konta użytkowników z rolami, danymi uwierzytelniającymi i znacznikami czasu.  

- id UUID PRIMARY KEY  
- role user_role NOT NULL DEFAULT 'user'  
- email TEXT NOT NULL UNIQUE  
- username TEXT NOT NULL UNIQUE  
- password_hash TEXT NOT NULL  
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()[1]

### flashcards  

Tabela przechowuje fiszki wraz z danymi SRS, tekstem, sesją AI i flagą akceptacji.  

- id UUID PRIMARY KEY  
- user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- front_text VARCHAR(500) NOT NULL  
- back_text VARCHAR(1000) NOT NULL  
- language_code VARCHAR(10) NOT NULL  
- source_url TEXT  
- raw_text TEXT NOT NULL  
- generation_session_id UUID NOT NULL  
- next_review_at TIMESTAMPTZ NOT NULL  
- interval INTEGER NOT NULL  
- ease_factor NUMERIC(5,2) NOT NULL  
- repetition_count INTEGER NOT NULL DEFAULT 0  
- last_edited_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- accepted BOOLEAN NOT NULL DEFAULT false  
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()[1]

### tags  

Tabela służy do tagowania fiszek bez hierarchii.  

- id UUID PRIMARY KEY  
- name TEXT NOT NULL  
- slug TEXT NOT NULL UNIQUE  
- description TEXT  
- color VARCHAR(20)  
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()[1]

### flashcard_tags  

Tabela łącząca fiszki z tagami (wiele-do-wielu).  

- flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE  
- tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE  
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- PRIMARY KEY[flashcard_id, tag_id](1)

### error_reports  

Tabela zgłoszeń błędów w wygenerowanych fiszkach.  

- id UUID PRIMARY KEY  
- flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE  
- user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE  
- status error_status NOT NULL DEFAULT 'open'  
- comment VARCHAR(500)  
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- updated_at TIMESTAMPTZ NOT NULL DEFAULT now()  
- resolved_at TIMESTAMPTZ[1]

## 2. Relacje  

- users 1-* flashcards  
- users 1-* error_reports  
- flashcards *-* tags przez flashcard_tags  
- flashcards 1-* error_reports  

## 3. Indeksy  

- UNIQUE INDEX ON flashcards(user_id, front_text) zapobiegający duplikatom fiszek per użytkownik[1]  
- INDEX ON flashcards(next_review_at) dla szybszego wyszukiwania zaplanowanych powtórek  
- INDEX ON tags(slug) przyspieszający filtrowanie po slugu  
- INDEX ON flashcard_tags(tag_id) dla przyspieszenia wyszukiwania fiszek po tagach  

## 4. Zasady PostgreSQL (RLS)  

- Włączenie row-level security na tabelach flashcards, flashcard_tags i error_reports  
- Polityka umożliwiająca SELECT/INSERT/UPDATE/DELETE tylko wierszy, gdzie user_id = current_setting('app.current_user_id')::UUID[1]  

## 5. Uwagi  

- Wszystkie znaczniki czasu korzystają z typu TIMESTAMPTZ z domyślnym now() dla wsparcia stref czasowych.  
- ease_factor przechowywany jako NUMERIC pozwala na precyzyjne wartości ułamkowe.  
- generation_session_id może w przyszłości zostać powiązany z dedykowaną tabelą sesji AI.  
- W MVP eksport danych odbywa się on-demand bez prowadzenia historii zadań exportjobs.

Citations:
[1] <https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_e2e6dc18-ab4e-4c94-a53d-5eeb2a8c30d2/8a2eb3f8-311d-4688-8f67-401788f03fc4/session-plan-db.md>
[2] <https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_e2e6dc18-ab4e-4c94-a53d-5eeb2a8c30d2/899a32cd-b5c8-4cfb-8db8-0b7d2ab99896/prd.md>
[3] <https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_e2e6dc18-ab4e-4c94-a53d-5eeb2a8c30d2/af7b8c25-533d-4546-a8e6-74a69aa6c057/package.json>
[4] <https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_e2e6dc18-ab4e-4c94-a53d-5eeb2a8c30d2/aa17dbb8-b59e-423c-a5de-1a7e5863d865/tech-stack.md>

---
Odpowiedź od Perplexity: pplx.ai/share
