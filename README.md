# MAO - Hide & Reveal Text Editor

MAO is a minimalist text editor with selective text visibility features. Hide parts of your text to focus on what matters, or reveal everything when you need the full context.

🔗 **Web**: [https://mao-study-editor.site/](https://mao-study-editor.site/)

[![Demo Video](https://img.youtube.com/vi/ooc6gmsw0lo/0.jpg)](https://youtu.be/ooc6gmsw0lo)

## Features

- **📝 Text Hiding**: Select any text and hide it with `{{ }}` markers
- **👁️ Visibility Toggle**: Switch between masked blocks and color-coded text display
- **🔤 Word-Boundary Detection**: Smart hiding that respects word boundaries
- **📱 Multi-Language Support**: Korean, English, and Japanese
- **💾 Cloud Storage**: Save and sync your documents with Firebase
- **🤖 AI-Powered Titles**: Automatic title generation using OpenAI
- **✏️ Easy Editing**: Edit documents in plain text with `{{ }}` markers
- **📤 Export/Import**: Backup and restore all your documents as JSON

## How It Works

1. **Paste or type** your text into the editor
2. **Select text** you want to hide
3. **Marked text** is automatically wrapped with `{{ }}` markers
4. **Click** on hidden segments to toggle visibility
5. **Use the eye icon** to switch between masked and color-only display modes

### Display Modes

- **👁️ Eye Closed (Default)**: Hidden text appears as gray blocks
- **👁️‍🗨️ Eye Open**: Hidden text shows as gray-colored text (readable but distinct)

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **AI**: OpenAI API (GPT-4)
- **Deployment**: Vercel

## Setup

### Prerequisites

- Node.js 18+ or Bun
- Firebase project
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mao
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Configure Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase config to `app/plugins/firebase.client.ts`

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel:
   - Go to your project settings
   - Add `OPENAI_API_KEY` in Environment Variables

Or deploy via the Vercel dashboard by connecting your Git repository.

## Project Structure

```
mao/
├── app/
│   ├── components/
│   │   ├── TextEditor/      # Main editor components
│   │   │   ├── index.vue    # Editor container
│   │   │   ├── TextLine.vue # Line renderer
│   │   │   ├── HiddenSpan.vue # Segment with hide/show
│   │   │   └── FileList.vue # Document list
│   │   ├── MaoLogo.vue      # App logo
│   │   └── LanguageSwitcher.vue
│   ├── composables/
│   │   ├── useTextEditor.ts # Editor state & logic
│   │   ├── useFirestore.ts  # Firebase operations
│   │   ├── useSession.ts    # Session management
│   │   └── useI18n.ts       # Internationalization
│   ├── plugins/
│   │   └── firebase.client.ts # Firebase initialization
│   ├── types/
│   │   └── editor.ts        # TypeScript types
│   ├── utils/
│   │   └── textSerializer.ts # Text parsing/serialization
│   └── pages/
│       └── index.vue        # Main page
├── server/
│   └── api/
│       └── generate-title.post.ts # OpenAI title generation
└── public/
    ├── favicon.ico
    ├── favicon.svg
    └── og-image.png
```

## Key Concepts

### Document Format

Documents are stored in two formats:

1. **Storage Format** (Firestore): Plain text with `{{ }}` markers
```
Hello {{world}}! This is {{hidden}} text.
```

2. **Render Format** (In-memory): Structured object with segments
```typescript
{
  lines: [{
    segments: [
      { text: "Hello ", hidden: false },
      { text: "world", hidden: true },
      { text: "! This is ", hidden: false },
      { text: "hidden", hidden: true },
      { text: " text.", hidden: false }
    ]
  }]
}
```

### Text Selection & Hiding

- Text selection uses browser's native Selection API
- Word boundary detection ensures complete words are hidden
- Multi-segment selection is supported within a single line
- Cross-line selection is not supported

## Configuration

### Language

Add `?lang=ko`, `?lang=en`, or `?lang=ja` to the URL, or use the language switcher in the UI.

### Firebase Rules

Recommended Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /documents/{sessionId}/files/{fileId} {
      allow read, write: if true; // Adjust based on your auth needs
    }
  }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
