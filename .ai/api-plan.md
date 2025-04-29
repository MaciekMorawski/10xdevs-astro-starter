# REST API plan

1. Main entities from the database schema [db-plan.md](1):

   1. users  
      - Columns: id UUID PK, role userrole, email TEXT UNIQUE, username TEXT UNIQUE, passwordhash TEXT, createdat, updatedat[1].

   2. flashcards  
      - Columns: id UUID PK, userid FK→users.id, fronttext VARCHAR(500), backtext VARCHAR(1000), languagecode VARCHAR(10), sourceurl TEXT, rawtext TEXT, generationsessionid UUID, nextreviewat TIMESTAMPTZ, interval INTEGER, easefactor NUMERIC(5,2), repetitioncount INTEGER, lasteditedat TIMESTAMPTZ, accepted BOOLEAN, createdat, updatedat[1].

   3. tags  
      - Columns: id UUID PK, name TEXT, slug TEXT UNIQUE, description TEXT, color VARCHAR(20), createdat, updatedat[1].

   4. flashcardtags  
      - Join table: flashcardid FK→flashcards.id, tagid FK→tags.id, createdat; PK[flashcardid, tagid](1).

   5. errorreports  
      - Columns: id UUID PK, flashcardid FK→flashcards.id, userid FK→users.id, status errorstatus DEFAULT open, comment VARCHAR(500), createdat, updatedat, resolvedat[1].

   Relationships:  
   - users 1–n flashcards; users 1–n errorreports  
   - flashcards n–m tags via flashcardtags; flashcards 1–n errorreports[1].

2. Key business logic features from PRD [prd.md](3):

   1. AI generation of flashcards from up to 10 000 characters of input text (US-001).  
   2. Manual CRUD of flashcards: create, read, update, delete (US-002).  
   3. Bulk editing with filtering by tags and search (US-003).  
   4. Integration with SRS algorithm: assign nextreviewat, interval, easefactor, repetitioncount (US-004).  
   5. User registration, login, authentication, secure storage of credentials (US-005).  
   6. Dashboard of learning statistics: repeats count, retention percentage, study time charts (US-006).  
   7. Export flashcards and statistics to CSV or JSON (US-007).  
   8. Error reporting on AI-generated flashcards with optional comment (US-008).  
   9. Acceptance workflow: flashcard accepted if not edited for 24 hours or explicitly accepted[3].

3. Mapping PRD features to API endpoints:

   Feature 1: AI generation  
   - Option A: POST /flashcards/generate { text }  
   - Option B: POST /generate-flashcards { text }  
   -> Chosen A for resource consistency under /flashcards[3].

   Feature 2: Manual CRUD  
   - Standard REST under /flashcards  
   -> GET /flashcards, POST /flashcards, GET/PATCH/DELETE /flashcards/:id.

   Feature 3: Bulk edit  
   - Option A: PATCH /flashcards with { filter, updates }  
   - Option B: POST /flashcards/bulk-update with same payload  
   -> Choose B to avoid ambiguity with partial updates on single resource.

   Feature 4: SRS integration  
   - SRS scheduling is internal: flashcards created/updated triggers computation of nextreviewat etc., exposed via GET /flashcards?due=true.

   Feature 5: Auth  
   - Endpoints: POST /auth/register, POST /auth/login, GET /users/me.

   Feature 6: Dashboard  
   - GET /dashboard/stats?from=&to=&groupby=day|week.

   Feature 7: Export  
   - GET /export?format=csv|json&type=flashcards|stats.

   Feature 8: Error reports  
   - POST /flashcards/:id/errorreports, GET /errorreports, PATCH /errorreports/:id.

   Feature 9: Acceptance  
   - PATCH /flashcards/:id/accept or /flashcards/:id { accepted: true }.

4. Security and performance requirements:

   - Authentication via JWT; all endpoints (except /auth) require Bearer token [PRD: secure storage, encryption in transit](3).  
   - Authorization: enforce row-level security so each user accesses only their records [RLS policies on flashcards, flashcardtags, errorreports](1).  
   - Rate limiting on AI generation endpoint to avoid abuse.  
   - Pagination, filtering, and indexing: use unique index on (userid, fronttext) to prevent duplicates; index on nextreviewat for due queries; index on tags.slug and flashcardtags.tagid for filtering performance[1].

5. Validation rules from schema:

   - fronttext ≤ 500 chars, backtext ≤ 1000 chars, comment ≤ 500 chars[2].  
   - email, username, tag.slug unique[1].  
   - languagecode ≤ 10 chars.  
   - Required fields: fronttext, backtext, languagecode, passwordhash, email, username.  
   - Numeric fields: interval ≥ 0, easefactor numeric(5,2), repetitioncount ≥ 0.

6. Business logic mapping:

   - AI generation: payload text → create flashcard records with rawtext, session ID, initial SRS values interval=0, easefactor=2.50, repetitioncount=0, nextreviewat=now.  
   - SRS repetition: endpoint to record review outcome: POST /flashcards/:id/review { quality: 0–5 } → update interval, easefactor, repetitioncount, nextreviewat.  
   - Acceptance: automatically set accepted=true if no edits for 24 h (cron job) or via PATCH endpoint.  
   - Bulk edit: filter by tags or search terms, apply updates to multiple records.  
   - Error reporting: create and update workflow.  
   - Export: generate on-demand without persistent jobs.

# REST API Plan

## 1. Resources

- **Auth**: user registration and login  
- **Users**: user profiles (users)  
- **Flashcards**: flashcard data with SRS fields (flashcards)  
- **Tags**: tag lookup (tags)  
- **FlashcardTags**: many-to-many relationship (flashcardtags)  
- **ErrorReports**: AI error reporting (errorreports)  
- **Dashboard**: aggregated stats  

## 2. Endpoints

### 2.1 Authentication

- **POST /auth/register**  
  Description: Create new user  
  Request: { email, username, password }  
  Response: { id, email, username, role, createdat }  
  Errors: 400 invalid data, 409 email/username taken

- **POST /auth/login**  
  Description: Obtain JWT  
  Request: { email, password }  
  Response: { token, expiresIn }  
  Errors: 401 invalid credentials

- **GET /users/me**  
  Auth: Bearer token  
  Description: Get current user profile  
  Response: { id, email, username, role, createdat, updatedat }

### 2.2 Flashcards

- **GET /flashcards**  
  Auth: Bearer  
  Query: page, pageSize, tags[], search, due (boolean)  
  Response: { items: [ { id, fronttext, backtext, languagecode, tags[], nextreviewat, accepted } ], total, page, pageSize }

- **POST /flashcards**  
  Auth: Bearer  
  Request: { fronttext (≤500), backtext (≤1000), languagecode, sourceurl? }  
  Response: 201 { id, ... }  
  Errors: 400 validation, 409 duplicate fronttext

- **GET /flashcards/:id**  
  Auth: Bearer  
  Response: full flashcard record with SRS fields and tags

- **PATCH /flashcards/:id**  
  Auth: Bearer  
  Request: { fronttext?, backtext?, languagecode?, sourceurl? }  
  Response: updated record  
  Errors: 400 validation

- **DELETE /flashcards/:id**  
  Auth: Bearer  
  Response: 204 No Content

### 2.3 AI Generation

- **POST /flashcards/generate**  
  Auth: Bearer  
  Request: { text (max 10000 chars), languagecode? }  
  Response: [ { fronttext, backtext, rawtext, generationsessionid, temp=true } ]  
  Notes: Temporary flashcards must be accepted via endpoint below

### 2.4 Acceptance Workflow

- **PATCH /flashcards/:id/accept**  
  Auth: Bearer  
  Response: { id, accepted: true }  
  Errors: 404 not found, 409 already accepted

### 2.5 Bulk Update

- **POST /flashcards/bulk-update**  
  Auth: Bearer  
  Request: { filter: { tags?, search? }, updates: { accepted?, languagecode?, tagsToAdd?, tagsToRemove? } }  
  Response: { updatedCount }

### 2.6 Review (SRS)

- **POST /flashcards/:id/review**  
  Auth: Bearer  
  Request: { quality: 0–5 }  
  Response: { id, interval, easefactor, repetitioncount, nextreviewat }

### 2.7 Tags

- **GET /tags**  
  Auth: Bearer  
  Response: list of tags

- **POST /tags**  
  Auth: Bearer/Admin  
  Request: { name, slug, description?, color? }  
  Response: created tag

- **PATCH /tags/:id**  
  Auth: Bearer/Admin  
  Request: partial tag update  
  Response: updated tag

- **DELETE /tags/:id**  
  Auth: Bearer/Admin  
  Response: 204

### 2.8 Error Reports

- **POST /flashcards/:id/errorreports**  
  Auth: Bearer  
  Request: { comment (≤500) }  
  Response: created report

- **GET /errorreports**  
  Auth: Bearer/Admin  
  Query: status (open, resolved)  
  Response: list of reports with flashcard and user info

- **PATCH /errorreports/:id**  
  Auth: Bearer/Admin  
  Request: { status, comment? }  
  Response: updated report

### 2.9 Export

- **GET /export**  
  Auth: Bearer  
  Query: type=(flashcards|stats), format=(csv|json)  
  Response: file attachment

### 2.10 Dashboard

- **GET /dashboard/stats**  
  Auth: Bearer  
  Query: from, to, groupby=(day|week)  
  Response: { repeatsCount, retentionRate, studyTime, chartsData }

## 3. Authentication and Authorization

- Mechanism: JWT in `Authorization: Bearer` header.  
- Passwords hashed (bcrypt).  
- Role-based access: Admin can manage tags and view all error reports.  
- Row-level Security in Postgres restricts flashcards, tags, errorreports to `userid = current_setting('app.currentUser')`.

## 4. Validation and Business Logic

- **Flashcards**:  
  - fronttext ≤500, backtext ≤1000, required fields present.  
  - Unique(fronttext, userid).  
  - On create/generate: initialize SRS fields (interval=0, easefactor=2.50, repetitioncount=0, nextreviewat=now).  
  - Accept endpoint or 24h cron marks accepted=true.  
- **Users**:  
  - email format, unique; username unique; password min length 8.  
- **Tags**: slug unique; name required.  
- **ErrorReports**: comment ≤500.  
- **Bulk and Review**: server enforces filter correctness; review quality ∈[5].

Security measures:

- TLS for all traffic.  
- Rate limit AI generation endpoint to prevent abuse.  
- Input sanitization against injection.  
- CORS restricted to frontend origins.  
- JWT expiry and refresh policy.

Performance:

- Pagination on list endpoints.  
- DB indexes: nextreviewat, tags.slug, flashcardtags.tagid.  
- N+1 avoidance: eager-load tags when listing flashcards.
