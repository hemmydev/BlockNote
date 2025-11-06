# BlockNote Installation and Setup Guide

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Framework-Specific Setup](#framework-specific-setup)
4. [UI Package Selection](#ui-package-selection)
5. [Project Configuration](#project-configuration)
6. [Common Issues and Solutions](#common-issues-and-solutions)

---

## System Requirements

### Prerequisites

- **Node.js**: 16.x or higher (18.x or higher recommended)
- **React**: 17.x or higher (19.x supported)
- **Package Manager**: npm, yarn, or pnpm
- **TypeScript** (optional but recommended): 4.5 or higher

### Browser Compatibility

BlockNote supports all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

**Note**: IE11 is not supported.

---

## Installation Methods

### Method 1: Using Mantine UI (Recommended for Beginners)

Mantine provides a complete, polished UI with minimal setup.

```bash
# Using npm
npm install @blocknote/core @blocknote/react @blocknote/mantine

# Using yarn
yarn add @blocknote/core @blocknote/react @blocknote/mantine

# Using pnpm
pnpm add @blocknote/core @blocknote/react @blocknote/mantine
```

**Basic Usage:**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

### Method 2: Using shadcn/ui

Perfect for projects already using shadcn/ui and Tailwind CSS.

```bash
# Install dependencies
npm install @blocknote/core @blocknote/react @blocknote/shadcn

# shadcn/ui peer dependencies
npm install @radix-ui/react-popover @radix-ui/react-toolbar
```

**Basic Usage:**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

### Method 3: Using Ariakit (Best for Accessibility)

Ariakit provides the best accessibility support with ARIA-compliant components.

```bash
npm install @blocknote/core @blocknote/react @blocknote/ariakit
```

**Basic Usage:**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/ariakit";
import "@blocknote/ariakit/style.css";

function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

### Method 4: Core Only (Custom UI)

For advanced users who want to build custom UI from scratch.

```bash
npm install @blocknote/core @blocknote/react
```

**Basic Usage:**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/react";

function Editor() {
  const editor = useCreateBlockNote();

  return (
    <BlockNoteView
      editor={editor}
      // Disable all default UI
      formattingToolbar={false}
      linkToolbar={false}
      sideMenu={false}
      slashMenu={false}
    />
  );
}
```

---

## Framework-Specific Setup

### Create React App

1. **Create new app:**

```bash
npx create-react-app my-blocknote-app
cd my-blocknote-app
```

2. **Install BlockNote:**

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
```

3. **Update src/App.js:**

```jsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

function App() {
  const editor = useCreateBlockNote();
  return (
    <div className="App">
      <BlockNoteView editor={editor} />
    </div>
  );
}

export default App;
```

4. **Run:**

```bash
npm start
```

### Next.js (App Router)

1. **Create new app:**

```bash
npx create-next-app@latest my-blocknote-app
cd my-blocknote-app
```

2. **Install BlockNote:**

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
```

3. **Create editor component (app/components/Editor.tsx):**

```tsx
"use client"; // Important: Mark as client component

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

4. **Use in page (app/page.tsx):**

```tsx
import Editor from "./components/Editor";

export default function Home() {
  return (
    <main>
      <h1>My BlockNote Editor</h1>
      <Editor />
    </main>
  );
}
```

5. **Handle SSR properly with dynamic import:**

```tsx
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./components/Editor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Home() {
  return (
    <main>
      <Editor />
    </main>
  );
}
```

### Next.js (Pages Router)

1. **Create editor component (components/Editor.tsx):**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

2. **Use with dynamic import (pages/index.tsx):**

```tsx
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1>My BlockNote Editor</h1>
      <Editor />
    </div>
  );
}
```

### Vite + React

1. **Create new app:**

```bash
npm create vite@latest my-blocknote-app -- --template react-ts
cd my-blocknote-app
```

2. **Install BlockNote:**

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
```

3. **Update src/App.tsx:**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

function App() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}

export default App;
```

4. **Run:**

```bash
npm run dev
```

### Remix

1. **Create editor component (app/components/Editor.tsx):**

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

2. **Use in route (app/routes/_index.tsx):**

```tsx
import { ClientOnly } from "remix-utils/client-only";
import Editor from "~/components/Editor";

export default function Index() {
  return (
    <div>
      <h1>My BlockNote Editor</h1>
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <Editor />}
      </ClientOnly>
    </div>
  );
}
```

### Gatsby

1. **Install BlockNote:**

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
```

2. **Create editor component (src/components/Editor.js):**

```jsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

3. **Use in page (src/pages/index.js):**

```jsx
import React from "react";

const Editor = typeof window !== "undefined"
  ? require("../components/Editor").default
  : () => <div>Loading...</div>;

export default function IndexPage() {
  return (
    <div>
      <h1>My BlockNote Editor</h1>
      <Editor />
    </div>
  );
}
```

---

## UI Package Selection

### Comparison Table

| Feature | Mantine | shadcn/ui | Ariakit | Core Only |
|---------|---------|-----------|---------|-----------|
| **Setup Complexity** | Easy | Easy | Easy | Advanced |
| **Bundle Size** | Medium | Small | Small | Minimal |
| **Customization** | High | Very High | High | Complete |
| **Accessibility** | Good | Good | Excellent | Custom |
| **Design System** | Mantine | shadcn + Tailwind | Headless | Custom |
| **TypeScript** | Full | Full | Full | Full |
| **Recommended For** | Quick start | Tailwind projects | Accessibility-first | Custom UI |

### Switching Between UI Packages

You can switch UI packages easily:

**From Mantine to shadcn:**

```bash
npm uninstall @blocknote/mantine
npm install @blocknote/shadcn
```

```tsx
// Change imports
- import { BlockNoteView } from "@blocknote/mantine";
- import "@blocknote/mantine/style.css";
+ import { BlockNoteView } from "@blocknote/shadcn";
+ import "@blocknote/shadcn/style.css";
```

**From shadcn to Ariakit:**

```bash
npm uninstall @blocknote/shadcn
npm install @blocknote/ariakit
```

```tsx
// Change imports
- import { BlockNoteView } from "@blocknote/shadcn";
- import "@blocknote/shadcn/style.css";
+ import { BlockNoteView } from "@blocknote/ariakit";
+ import "@blocknote/ariakit/style.css";
```

---

## Project Configuration

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Webpack Configuration

If you encounter issues with Webpack 4:

```js
// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
    },
  },
};
```

### Vite Configuration

For optimal performance with Vite:

```js
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@blocknote/core',
      '@blocknote/react',
      '@blocknote/mantine',
    ],
  },
});
```

### CSS Configuration

#### Tailwind CSS with shadcn

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@blocknote/shadcn/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### CSS Modules

BlockNote styles work with CSS modules:

```tsx
import styles from "./Editor.module.css";
import { BlockNoteView } from "@blocknote/mantine";

function Editor() {
  return (
    <div className={styles.editorContainer}>
      <BlockNoteView editor={editor} />
    </div>
  );
}
```

---

## Common Issues and Solutions

### Issue 1: "Cannot find module" Error

**Problem:**
```
Module not found: Can't resolve '@blocknote/mantine'
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with npm cache clear
npm cache clean --force
npm install
```

### Issue 2: SSR/Hydration Errors in Next.js

**Problem:**
```
Warning: Text content did not match. Server: "" Client: "..."
```

**Solution:**
Always use dynamic import with `ssr: false`:

```tsx
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});
```

### Issue 3: Styles Not Loading

**Problem:**
Editor appears unstyled or broken.

**Solution:**
Ensure you import the CSS file:

```tsx
// Must be imported AFTER core fonts
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
```

### Issue 4: TypeScript Errors

**Problem:**
```
Type 'BlockNoteEditor' is not assignable to...
```

**Solution:**
Ensure you're using compatible versions:

```bash
npm list @blocknote/core @blocknote/react
```

All @blocknote packages should be the same version.

### Issue 5: Large Bundle Size

**Problem:**
Bundle size is too large.

**Solution:**
1. Use code splitting:

```tsx
const Editor = lazy(() => import("./Editor"));
```

2. Use tree-shaking:

```tsx
// Instead of
import { BlockNoteView } from "@blocknote/mantine";

// Use specific imports
import { BlockNoteView } from "@blocknote/mantine/dist/BlockNoteView";
```

3. Consider using Ariakit (smaller bundle):

```bash
npm uninstall @blocknote/mantine
npm install @blocknote/ariakit
```

### Issue 6: File Upload Not Working

**Problem:**
Files can't be uploaded or inserted.

**Solution:**
Implement the `uploadFile` option:

```tsx
const editor = useCreateBlockNote({
  uploadFile: async (file) => {
    // Upload to your server
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { url } = await response.json();
    return url;
  },
});
```

### Issue 7: Collaboration Not Syncing

**Problem:**
Changes not syncing in real-time collaboration.

**Solution:**
Check your Yjs provider setup:

```tsx
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const doc = new Y.Doc();
const provider = new WebsocketProvider(
  "ws://localhost:1234",
  "room-name",
  doc
);

// Wait for provider to connect
provider.on("status", (event) => {
  console.log("Collaboration status:", event.status);
});

const editor = useCreateBlockNote({
  collaboration: {
    provider,
    fragment: doc.getXmlFragment("document-store"),
    user: {
      name: "User",
      color: "#ff0000",
    },
  },
});
```

### Issue 8: Performance Issues with Large Documents

**Problem:**
Editor becomes slow with many blocks.

**Solution:**
1. Implement virtualization (future feature)
2. Paginate content
3. Lazy load images
4. Debounce auto-save

```tsx
import { debounce } from "lodash";

const debouncedSave = useMemo(
  () => debounce((blocks) => saveToBackend(blocks), 1000),
  []
);

<BlockNoteView
  editor={editor}
  onChange={() => debouncedSave(editor.document)}
/>
```

---

## Environment Variables

### Create `.env` file:

```bash
# API Keys (never commit these!)
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key

# Backend URLs
VITE_API_URL=https://api.example.com
VITE_UPLOAD_URL=https://api.example.com/upload

# Collaboration
VITE_COLLABORATION_URL=wss://collaboration.example.com
```

### Usage in code:

```tsx
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
```

Or for Create React App:

```tsx
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
```

---

## Verification

### Test Your Setup

Create a test component to verify everything works:

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function TestEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to BlockNote! 🎉",
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "If you can see this ", styles: {} },
          { type: "text", text: "styled text", styles: { bold: true, textColor: "blue" } },
          { type: "text", text: ", your setup is working correctly!", styles: {} },
        ],
      },
      {
        type: "bulletListItem",
        content: "Try typing here",
      },
      {
        type: "bulletListItem",
        content: "Press / for the slash menu",
      },
      {
        type: "bulletListItem",
        content: "Select text to see the formatting toolbar",
      },
    ],
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>BlockNote Setup Test</h1>
      <BlockNoteView editor={editor} />
    </div>
  );
}
```

If you see the editor with styled content and can interact with it, your setup is complete!

---

## Next Steps

Now that you have BlockNote installed and configured:

1. Read the [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md) to understand all features
2. Explore [Tutorials](./03-TUTORIALS.md) for common use cases
3. Check out the [API Reference](./04-API-REFERENCE.md) for detailed documentation
4. Browse the [official examples](https://www.blocknotejs.org/examples)
5. Join the [Discord community](https://discord.gg/Qc2QTTH5dF) for support

---

## Additional Resources

- **Official Documentation**: https://www.blocknotejs.org/docs
- **GitHub Repository**: https://github.com/TypeCellOS/BlockNote
- **NPM Package**: https://www.npmjs.com/package/@blocknote/react
- **Discord Community**: https://discord.gg/Qc2QTTH5dF

---

**Version**: 0.41.1
**Last Updated**: January 2025
