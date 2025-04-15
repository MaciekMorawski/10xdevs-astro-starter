# Flashcards AI

## 1. Project Description
Flashcards AI is a web application that streamlines the creation of educational flashcards using artificial intelligence alongside manual methods. Users can:
- Generate flashcards from text input (up to 10,000 characters) using AI.
- Create, view, edit, and delete flashcards manually.
- Edit flashcards in bulk with filtering by tags and keyword search.
- Leverage a proven Spaced Repetition System (SRS) algorithm for optimized learning.
- Securely manage user accounts with encryption for data in transit and at rest.
- Export flashcards and learning statistics to CSV and JSON formats.
- Access a dashboard displaying learning metrics through bar and pie charts.
- Report AI errors with additional comments for system improvement.

## 2. Tech Stack
- **Astro 5**
- **TypeScript 5**
- **React 19**
- **Tailwind CSS 4**
- **Shadcn/ui**

## 3. Getting Started Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/flashcards-ai.git
   cd flashcards-ai
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:3000` to view the application.

## 4. Available Scripts
- `npm run dev`  
  Starts the development server with hot reloading.
- `npm run build`  
  Builds the application for production.
- `npm run preview`  
  Serves the production build locally.
- `npm run lint`  
  Runs ESLint to check code quality.
- `npm run lint:fix`  
  Automatically fixes ESLint issues.

## 5. Project Structure
```md
.
├── src/
│   ├── layouts/    # Astro layouts
│   ├── pages/      # Astro pages
│   │   └── api/    # API endpoints
│   ├── components/ # UI components (Astro & React)
│   └── assets/     # Static assets
├── public/         # Public assets
```

## 6. Project Scope
The MVP of Flashcards AI includes:
- AI-driven flashcard generation from provided text.
- Manual flashcard creation and editing.
- Bulk editing with tag filtering and search functionality.
- Integration with an open-source SRS algorithm.
- Secure user registration, login, and data management.
- Data export options for flashcards and learning statistics.
- A dashboard displaying key learning metrics.

## 7. Project Status
The project is currently in the MVP stage. Future enhancements include expanded features for mobile responsiveness, advanced SRS algorithms, and further automation in flashcard generation.

## 8. License
This project is licensed under the [MIT License](LICENSE).

For more detailed documentation, please refer to the [Product Requirements Document](./prd.md).