# Dokument wymagań produktu (PRD) - Flashcards AI

## 1. Przegląd produktu

Flashcards AI to aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych przy użyciu sztucznej inteligencji oraz metod manualnych. Produkt łączy automatyczne generowanie fiszek z możliwością ręcznej edycji, zbiorowej edycji z filtrowaniem oraz przeglądu statystyk nauki. Aplikacja integruje sprawdzony, open-source’owy algorytm powtórek (SRS) i zapewnia bezpieczny system kont użytkowników.

## 2. Problem użytkownika

Użytkownicy (np. studenci, osoby uczące się języków) mają problem z czasochłonnym, manualnym tworzeniem fiszek. W efekcie korzystanie z metody spaced repetition, która jest efektywna w nauce, jest ograniczone. Produkt ma na celu przyspieszenie procesu tworzenia fiszek i podniesienie komfortu oraz dostępności technik powtórek.

## 3. Wymagania funkcjonalne

1. Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (do 10 000 znaków).
2. Możliwość manualnego tworzenia, przeglądania, edytowania i usuwania fiszek.
3. Funkcja zbiorczej edycji fiszek z filtrowaniem po tagach i wyszukiwaniem.
4. Integracja z open-source’owym algorytmem powtórek (SRS).
5. System kont użytkowników umożliwiający bezpieczne przechowywanie danych fiszek, z szyfrowaniem danych w tranzycie i spoczynku.
6. Mechanizm akceptacji fiszek, w którym fiszka zostaje zaakceptowana, gdy przez 24 godziny nie została edytowana lub przez wyraźne działanie użytkownika.
7. Eksport danych (fiszki oraz statystyki nauki) do formatów CSV i JSON.
8. Dashboard prezentujący statystyki nauki (liczba powtórzeń, procent zapamiętania, czas nauki) z wykresami słupkowymi i kołowymi.
9. Interfejs zgłaszania błędów AI z możliwością dodawania komentarzy.

## 4. Granice produktu

W ramach MVP system obejmuje:

- Webową platformę (wersja mobilna na początek nie jest przewidywana).
- Podstawowy system kont użytkowników (logowanie, rejestracja, autoryzacja).
- Generację fiszek przy użyciu AI z wykorzystaniem API OpenAI/Claude poprzez warstwę pośrednią.
- Prosty, responsywny interfejs z dbałością o dostępność (zgodność z WCAG 2.1 AA).

Elementy wyłączone z MVP:

- Własny, zaawansowany algorytm powtórek (typ SuperMemo, Anki).
- Import fiszek z wielu formatów (PDF, DOCX, itp.).
- Współdzielenie zestawów fiszek między użytkownikami.
- Zaawansowana hierarchiczna organizacja fiszek (foldery, tagi) – temat na przyszłe wersje.
- Obsługa obrazów.
- Aplikacje mobilne.

## 5. Historyjki użytkowników

### US-001

ID: US-001  
Tytuł: Generowanie fiszek z tekstu  
Opis: Jako student chcę wygenerować fiszki z podręcznika poprzez wklejenie tekstu, aby zaoszczędzić czas potrzebny na ręczne tworzenie fiszek.  
Kryteria akceptacji:

- Użytkownik wprowadza tekst (do 10 000 znaków).
- AI generuje zestaw fiszek na podstawie wprowadzonego tekstu.
- Użytkownik może zaakceptować lub edytować wygenerowane fiszki.

### US-002

ID: US-002  
Tytuł: Przeglądanie, edycja i usuwanie fiszek  
Opis: Jako użytkownik chcę móc przeglądać, edytować i usuwać fiszki, abym miał pełną kontrolę nad swoim materiałem do nauki.  
Kryteria akceptacji:

- Interfejs umożliwia wyświetlenie listy fiszek.
- Użytkownik może wybrać pojedynczą fiszkę do edycji.
- Użytkownik może usunąć wybraną fiszkę z systemu.

### US-003

ID: US-003  
Tytuł: Edycja zbiorcza z filtrowaniem  
Opis: Jako użytkownik chcę edytować fiszki zbiorczo, korzystając z opcji filtrowania po tagach i wyszukiwania, aby usprawnić zarządzanie dużą liczbą fiszek.  
Kryteria akceptacji:

- Użytkownik może filtrować fiszki według tagów.
- Interfejs umożliwia edycję wielu fiszek jednocześnie.
- Użytkownik może wyszukać fiszki za pomocą słów kluczowych.

### US-004

ID: US-004  
Tytuł: Integracja z algorytmem powtórek (SRS)  
Opis: Jako użytkownik chcę, aby moje fiszki były integrowane z algorytmem powtórek, co pozwoli mi efektywniej utrwalać materiał.  
Kryteria akceptacji:

- System automatycznie włącza fiszki do cyklu powtórek według algorytmu SRS.
- Użytkownik otrzymuje przypomnienia o zaplanowanych powtórkach.
- Statystyki powtórek są widoczne w dashboardzie.

### US-005

ID: US-005  
Tytuł: Rejestracja i autoryzacja użytkownika  
Opis: Jako nowy użytkownik chcę założyć konto oraz się zalogować, aby móc bezpiecznie przechowywać moje fiszki.  
Kryteria akceptacji:

- Użytkownik może zarejestrować konto za pomocą adresu e-mail.
- System wymaga uwierzytelnienia przy logowaniu.
- Dane użytkownika są szyfrowane zarówno w tranzycie, jak i w spoczynku.

### US-006

ID: US-006  
Tytuł: Dashboard statystyk nauki  
Opis: Jako użytkownik chcę mieć dostęp do dashboardu, który prezentuje statystyki mojej nauki (liczba powtórzeń, procent zapamiętania, czas nauki) w formie wykresów.  
Kryteria akceptacji:

- Dashboard wyświetla wykresy słupkowe i kołowe prezentujące statystyki nauki.
- Użytkownik może przeglądać historyczne dane dotyczące nauki.
- Aktualizacja statystyk następuje automatycznie.

### US-007

ID: US-007  
Tytuł: Eksport danych  
Opis: Jako użytkownik chcę móc eksportować moje fiszki i statystyki nauki do plików CSV/JSON w celu archiwizacji i analizy poza systemem.  
Kryteria akceptacji:

- Użytkownik wybiera opcję eksportu danych.
- System generuje plik CSV lub JSON z aktualnymi danymi.
- Użytkownik otrzymuje potwierdzenie zakończenia eksportu.

### US-008

ID: US-008  
Tytuł: Zgłaszanie błędów AI  
Opis: Jako użytkownik chcę mieć możliwość zgłoszenia błędów w generowanych fiszkach wraz z komentarzami, aby system mógł się doskonalić.  
Kryteria akceptacji:

- Użytkownik może kliknąć opcję "Zgłoś błąd" przy fiszce.
- System umożliwia dodanie komentarza opisującego problem.
- Zgłoszenie jest rejestrowane i dostępne dla administratorów.

## 6. Metryki sukcesu

1. Co najmniej 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkowników (brak edycji przez 24 godziny lub explicit akceptacja).
2. 75% fiszek tworzonych przez użytkowników korzysta z funkcji generacji przez AI (weryfikacja poprzez logi systemowe).
3. Średni czas tworzenia zestawu fiszek nie przekracza 5 minut (mierzone w testach użyteczności).
4. Ocena łatwości użycia aplikacji wynosi co najmniej 4/5 w ankietach użytkowników.
5. Wskaźniki techniczne:
   - Skalowalność architektury dla ponad 10 000 użytkowników.
   - Testy A/B jakości generowanych fiszek wykazujące min. 90% poprawności.

```// filepath: .ai/prd.md
# Dokument wymagań produktu (PRD) - Flashcards AI

## 1. Przegląd produktu
Flashcards AI to aplikacja webowa umożliwiająca tworzenie fiszek edukacyjnych przy użyciu sztucznej inteligencji oraz metod manualnych. Produkt łączy automatyczne generowanie fiszek z możliwością ręcznej edycji, zbiorowej edycji z filtrowaniem oraz przeglądu statystyk nauki. Aplikacja integruje sprawdzony, open-source’owy algorytm powtórek (SRS) i zapewnia bezpieczny system kont użytkowników.

## 2. Problem użytkownika
Użytkownicy (np. studenci, osoby uczące się języków) mają problem z czasochłonnym, manualnym tworzeniem fiszek. W efekcie korzystanie z metody spaced repetition, która jest efektywna w nauce, jest ograniczone. Produkt ma na celu przyspieszenie procesu tworzenia fiszek i podniesienie komfortu oraz dostępności technik powtórek.

## 3. Wymagania funkcjonalne
1. Generowanie fiszek przez AI na podstawie wprowadzonego tekstu (do 10 000 znaków).
2. Możliwość manualnego tworzenia, przeglądania, edytowania i usuwania fiszek.
3. Funkcja zbiorczej edycji fiszek z filtrowaniem po tagach i wyszukiwaniem.
4. Integracja z open-source’owym algorytmem powtórek (SRS).
5. System kont użytkowników umożliwiający bezpieczne przechowywanie danych fiszek, z szyfrowaniem danych w tranzycie i spoczynku.
6. Mechanizm akceptacji fiszek, w którym fiszka zostaje zaakceptowana, gdy przez 24 godziny nie została edytowana lub przez wyraźne działanie użytkownika.
7. Eksport danych (fiszki oraz statystyki nauki) do formatów CSV i JSON.
8. Dashboard prezentujący statystyki nauki (liczba powtórzeń, procent zapamiętania, czas nauki) z wykresami słupkowymi i kołowymi.
9. Interfejs zgłaszania błędów AI z możliwością dodawania komentarzy.

## 4. Granice produktu
W ramach MVP system obejmuje:
- Webową platformę (wersja mobilna na początek nie jest przewidywana).
- Podstawowy system kont użytkowników (logowanie, rejestracja, autoryzacja).
- Generację fiszek przy użyciu AI z wykorzystaniem API OpenAI/Claude poprzez warstwę pośrednią.
- Prosty, responsywny interfejs z dbałością o dostępność (zgodność z WCAG 2.1 AA).

Elementy wyłączone z MVP:
- Własny, zaawansowany algorytm powtórek (typ SuperMemo, Anki).
- Import fiszek z wielu formatów (PDF, DOCX, itp.).
- Współdzielenie zestawów fiszek między użytkownikami.
- Zaawansowana hierarchiczna organizacja fiszek (foldery, tagi) – temat na przyszłe wersje.
- Obsługa obrazów.
- Aplikacje mobilne.

## 5. Historyjki użytkowników

### US-001
ID: US-001  
Tytuł: Generowanie fiszek z tekstu  
Opis: Jako student chcę wygenerować fiszki z podręcznika poprzez wklejenie tekstu, aby zaoszczędzić czas potrzebny na ręczne tworzenie fiszek.  
Kryteria akceptacji:
- Użytkownik wprowadza tekst (do 10 000 znaków).
- AI generuje zestaw fiszek na podstawie wprowadzonego tekstu.
- Użytkownik może zaakceptować lub edytować wygenerowane fiszki.

### US-002
ID: US-002  
Tytuł: Przeglądanie, edycja i usuwanie fiszek  
Opis: Jako użytkownik chcę móc przeglądać, edytować i usuwać fiszki, abym miał pełną kontrolę nad swoim materiałem do nauki.  
Kryteria akceptacji:
- Interfejs umożliwia wyświetlenie listy fiszek.
- Użytkownik może wybrać pojedynczą fiszkę do edycji.
- Użytkownik może usunąć wybraną fiszkę z systemu.

### US-003
ID: US-003  
Tytuł: Edycja zbiorcza z filtrowaniem  
Opis: Jako użytkownik chcę edytować fiszki zbiorczo, korzystając z opcji filtrowania po tagach i wyszukiwania, aby usprawnić zarządzanie dużą liczbą fiszek.  
Kryteria akceptacji:
- Użytkownik może filtrować fiszki według tagów.
- Interfejs umożliwia edycję wielu fiszek jednocześnie.
- Użytkownik może wyszukać fiszki za pomocą słów kluczowych.

### US-004
ID: US-004  
Tytuł: Integracja z algorytmem powtórek (SRS)  
Opis: Jako użytkownik chcę, aby moje fiszki były integrowane z algorytmem powtórek, co pozwoli mi efektywniej utrwalać materiał.  
Kryteria akceptacji:
- System automatycznie włącza fiszki do cyklu powtórek według algorytmu SRS.
- Użytkownik otrzymuje przypomnienia o zaplanowanych powtórkach.
- Statystyki powtórek są widoczne w dashboardzie.

### US-005
ID: US-005  
Tytuł: Rejestracja i autoryzacja użytkownika  
Opis: Jako nowy użytkownik chcę założyć konto oraz się zalogować, aby móc bezpiecznie przechowywać moje fiszki.  
Kryteria akceptacji:
- Użytkownik może zarejestrować konto za pomocą adresu e-mail.
- System wymaga uwierzytelnienia przy logowaniu.
- Dane użytkownika są szyfrowane zarówno w tranzycie, jak i w spoczynku.

### US-006
ID: US-006  
Tytuł: Dashboard statystyk nauki  
Opis: Jako użytkownik chcę mieć dostęp do dashboardu, który prezentuje statystyki mojej nauki (liczba powtórzeń, procent zapamiętania, czas nauki) w formie wykresów.  
Kryteria akceptacji:
- Dashboard wyświetla wykresy słupkowe i kołowe prezentujące statystyki nauki.
- Użytkownik może przeglądać historyczne dane dotyczące nauki.
- Aktualizacja statystyk następuje automatycznie.

### US-007
ID: US-007  
Tytuł: Eksport danych  
Opis: Jako użytkownik chcę móc eksportować moje fiszki i statystyki nauki do plików CSV/JSON w celu archiwizacji i analizy poza systemem.  
Kryteria akceptacji:
- Użytkownik wybiera opcję eksportu danych.
- System generuje plik CSV lub JSON z aktualnymi danymi.
- Użytkownik otrzymuje potwierdzenie zakończenia eksportu.

### US-008
ID: US-008  
Tytuł: Zgłaszanie błędów AI  
Opis: Jako użytkownik chcę mieć możliwość zgłoszenia błędów w generowanych fiszkach wraz z komentarzami, aby system mógł się doskonalić.  
Kryteria akceptacji:
- Użytkownik może kliknąć opcję "Zgłoś błąd" przy fiszce.
- System umożliwia dodanie komentarza opisującego problem.
- Zgłoszenie jest rejestrowane i dostępne dla administratorów.

## 6. Metryki sukcesu
1. Co najmniej 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkowników (brak edycji przez 24 godziny lub explicit akceptacja).
2. 75% fiszek tworzonych przez użytkowników korzysta z funkcji generacji przez AI (weryfikacja poprzez logi systemowe).
3. Średni czas tworzenia zestawu fiszek nie przekracza 5 minut (mierzone w testach użyteczności).
4. Ocena łatwości użycia aplikacji wynosi co najmniej 4/5 w ankietach użytkowników.
5. Wskaźniki techniczne:
   - Skalowalność architektury dla ponad 10 000 użytkowników.
   - Testy A/B jakości generowanych fiszek wykazujące min. 90% poprawności.
