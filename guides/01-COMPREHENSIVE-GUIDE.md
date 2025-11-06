# BlockNote Comprehensive Editor Guide

## Table of Contents

1. [Introduction](#introduction)
2. [What is BlockNote?](#what-is-blocknote)
3. [Key Features](#key-features)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Core Concepts](#core-concepts)
7. [Complete Feature Reference](#complete-feature-reference)
8. [Advanced Topics](#advanced-topics)
9. [Best Practices](#best-practices)

---

## Introduction

BlockNote is an open-source, block-based React rich text editor that provides a next-generation text editing experience similar to Notion, Google Docs, and Coda. Built on top of ProseMirror and Tiptap, BlockNote offers a polished, production-ready editor with minimal setup required.

### Why BlockNote?

- **Block-Based Architecture**: Documents are organized into draggable, nestable blocks
- **Rich Out-of-the-Box Experience**: Fully styled UI components ready to use
- **Highly Customizable**: Extend with custom blocks, styles, and UI components
- **Real-Time Collaboration**: Built-in support for multi-user editing
- **Modern UX**: Animations, drag-and-drop, keyboard shortcuts, and more
- **Framework Integrations**: Pre-built UI packages for Mantine, shadcn/ui, and Ariakit
- **AI-Powered**: Optional AI features for content generation and editing
- **Import/Export**: Support for HTML, Markdown, PDF, DOCX, ODT formats

---

## What is BlockNote?

BlockNote is a **block-based rich text editor** for React applications. Unlike traditional rich text editors that treat the document as a single continuous text flow, BlockNote organizes content into discrete blocks that can be:

- **Dragged and reordered** with an intuitive drag handle
- **Nested and indented** using Tab/Shift+Tab
- **Individually styled** with colors, alignment, and properties
- **Easily manipulated** through a comprehensive JavaScript API
- **Collaborated on** in real-time with other users

### Architecture

```
BlockNote Editor
├── @blocknote/core       - Framework-agnostic core engine
├── @blocknote/react      - React hooks and components
└── UI Packages           - Pre-styled UI components
    ├── @blocknote/mantine
    ├── @blocknote/shadcn
    └── @blocknote/ariakit
```

---

## Key Features

### 📝 Content Types

**Built-in Block Types:**
- Paragraphs and Headings (H1-H6)
- Bullet and Numbered Lists
- Toggle Lists (collapsible)
- Code Blocks with syntax highlighting
- Tables with cell merging
- Images with drag-to-resize
- Videos (YouTube, Vimeo embeds)
- Audio files
- File attachments
- Page breaks
- Horizontal rules

**Inline Content:**
- Rich text formatting (bold, italic, underline, strikethrough)
- Text and background colors
- Code inline styles
- Hyperlinks
- Custom inline content

### 🎨 User Interface

**Interactive Components:**
- **Side Menu**: Drag handle + block type selector
- **Formatting Toolbar**: Contextual text formatting options
- **Slash Menu (/)**: Quick block insertion
- **Link Toolbar**: Edit and open hyperlinks
- **Image Toolbar**: Resize and manage images
- **File Panel**: Upload and manage media
- **Emoji Picker**: Insert emojis
- **Color Picker**: Text and background colors

### ⚡ User Experience

- Smooth animations for all interactions
- Drag-and-drop block reordering
- Nested/indented blocks with Tab/Shift+Tab
- Block selection and multi-selection
- Keyboard shortcuts for all actions
- Placeholder text in empty blocks
- Undo/redo history

### 🤝 Collaboration Features

- **Real-time multi-user editing** via Yjs CRDT
- **Multiple backend providers**:
  - PartyKit
  - Liveblocks
  - Y-sweet
  - Electric SQL
  - Hocuspocus (self-hosted)
- **Comments system** with threading
- **User presence** indicators
- **Document forking** capabilities

### 🤖 AI Integration (XL Package)

- AI-powered content generation
- Text improvement suggestions
- Editing assistance (fix spelling, make shorter/longer, simplify)
- Custom AI commands
- Multi-provider support:
  - OpenAI (GPT-4, GPT-3.5)
  - Anthropic Claude
  - Google Gemini
  - Groq
  - Mistral
- Client-side and server-side execution options

### 📤 Import/Export

**Supported Formats:**
- HTML (import/export)
- Markdown (import/export)
- PDF (export, via @blocknote/xl-pdf-exporter)
- DOCX (export, via @blocknote/xl-docx-exporter)
- ODT (export, via @blocknote/xl-odt-exporter)
- Email HTML (export, via @blocknote/xl-email-exporter)

### 🎨 Theming & Styling

- CSS variables for easy theming
- Multiple built-in themes (light, dark)
- Custom fonts
- DOM attribute customization
- CSS class injection
- Full control over visual appearance

### 🔧 Developer Features

- **TypeScript**: Fully typed API
- **React Hooks**: `useCreateBlockNote`, `useBlockNoteEditor`
- **Event System**: onChange, onSelectionChange, etc.
- **Custom Schemas**: Create custom blocks, inline content, and styles
- **Extension System**: Extend editor functionality
- **Server-Side Utilities**: Process documents on the server
- **Comprehensive API**: Manipulate blocks, content, selection programmatically

---

## Installation & Setup

### Prerequisites

- **Node.js**: 16.x or higher
- **React**: 17.x or higher
- **Package Manager**: npm, yarn, or pnpm

### Basic Installation

#### Option 1: Using Mantine UI (Recommended for Beginners)

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
```

#### Option 2: Using shadcn/ui

```bash
npm install @blocknote/core @blocknote/react @blocknote/shadcn
```

#### Option 3: Using Ariakit (Best for Accessibility)

```bash
npm install @blocknote/core @blocknote/react @blocknote/ariakit
```

### Minimal Setup

Create a simple editor with default configuration:

```tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

function App() {
  // Create editor instance
  const editor = useCreateBlockNote();

  // Render the editor
  return <BlockNoteView editor={editor} />;
}

export default App;
```

That's it! You now have a fully functional block-based editor.

### Next.js Setup

For Next.js applications, you need to handle server-side rendering:

```tsx
"use client"; // Mark as client component

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

export default function Editor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

---

## Project Structure

### Package Overview

BlockNote is organized as a monorepo with multiple packages:

```
@blocknote/
├── core              - Core editor engine (framework-agnostic)
├── react             - React hooks and components
├── mantine           - Mantine UI components
├── shadcn            - shadcn/ui components
├── ariakit           - Ariakit accessible components
├── code-block        - Enhanced code highlighting with Shiki
├── server-util       - Server-side rendering utilities
└── xl-*              - Premium features (GPL-3.0 or commercial)
    ├── xl-ai         - AI integration
    ├── xl-multi-column    - Multi-column layouts
    ├── xl-pdf-exporter    - PDF export
    ├── xl-docx-exporter   - DOCX export
    ├── xl-odt-exporter    - ODT export
    └── xl-email-exporter  - Email HTML export
```

### License Structure

- **Core Packages**: MPL-2.0 (Mozilla Public License)
  - Can be used in commercial/closed-source applications
  - Changes to BlockNote source must be published

- **XL Packages**: GPL-3.0 or Commercial License
  - GPL-3.0 for open-source projects
  - Commercial license required for closed-source use
  - See [BlockNote Pricing](https://www.blocknotejs.org/pricing) for details

---

## Core Concepts

### Document Structure

#### Blocks

Every BlockNote document is an array of blocks. Each block represents a piece of content:

```typescript
type Block = {
  id: string;                    // Unique identifier
  type: string;                  // Block type (paragraph, heading, etc.)
  props: Record<string, any>;    // Block properties (level, color, etc.)
  content: InlineContent[];      // Rich text content
  children: Block[];             // Nested blocks
};
```

**Example Block:**

```typescript
{
  id: "abc123",
  type: "heading",
  props: {
    level: 2,
    textColor: "blue",
    textAlignment: "center"
  },
  content: [
    { type: "text", text: "Welcome to ", styles: {} },
    { type: "text", text: "BlockNote", styles: { bold: true } }
  ],
  children: []
}
```

#### Inline Content

Content within blocks is represented as an array of inline content objects:

```typescript
type InlineContent = StyledText | Link | CustomInlineContent;

type StyledText = {
  type: "text";
  text: string;
  styles: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    textColor?: string;
    backgroundColor?: string;
  };
};

type Link = {
  type: "link";
  content: StyledText[];
  href: string;
};
```

#### Default Block Properties

All blocks support these default properties:

```typescript
{
  backgroundColor: string;  // Block background color
  textColor: string;        // Text color (inherited by nested blocks)
  textAlignment: "left" | "center" | "right" | "justify";
}
```

### Schema System

BlockNote uses schemas to define available blocks, inline content, and styles:

```typescript
// Default schema
const schema = BlockNoteSchema.create();

// Custom schema with additional blocks
const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    // Include default blocks
    ...defaultBlockSpecs,
    // Add custom block
    alert: AlertBlock,
  },
});

// Use custom schema
const editor = useCreateBlockNote({ schema: customSchema });
```

### Editor Instance

The editor instance is the central object for interacting with BlockNote:

```typescript
const editor = useCreateBlockNote({
  // Initial content
  initialContent: [
    {
      type: "paragraph",
      content: "Hello, world!",
    },
  ],

  // Custom schema
  schema: customSchema,

  // File upload handler
  uploadFile: async (file) => {
    const url = await uploadToServer(file);
    return url;
  },

  // Collaboration
  collaboration: {
    provider: yProvider,
    fragment: doc.getXmlFragment("document-store"),
    user: {
      name: "John Doe",
      color: "#ff0000",
    },
  },

  // Localization
  dictionary: {
    // Custom translations
  },
});
```

---

## Complete Feature Reference

### Block Types

#### Typography Blocks

**Paragraph**
```typescript
{
  type: "paragraph",
  content: "Regular paragraph text"
}
```

**Headings (H1-H6)**
```typescript
{
  type: "heading",
  props: { level: 1 },  // 1-6
  content: "Heading text"
}
```

**Configuring Headings:**
```typescript
const editor = useCreateBlockNote({
  schema: BlockNoteSchema.create().extend({
    blockSpecs: {
      heading: createHeadingBlockSpec({
        levels: [1, 2, 3],  // Only allow H1-H3
      }),
    },
  }),
});
```

#### List Blocks

**Bullet List**
```typescript
{
  type: "bulletListItem",
  content: "List item content",
  children: [
    {
      type: "bulletListItem",
      content: "Nested item"
    }
  ]
}
```

**Numbered List**
```typescript
{
  type: "numberedListItem",
  content: "Numbered item"
}
```

**Checkbox List**
```typescript
{
  type: "checkListItem",
  props: { checked: true },
  content: "Todo item"
}
```

**Toggle List (Collapsible)**
```typescript
{
  type: "toggleListItem",
  content: "Click to expand",
  children: [
    {
      type: "paragraph",
      content: "Hidden content"
    }
  ]
}
```

#### Code Blocks

**Basic Code Block**
```typescript
{
  type: "codeBlock",
  props: {
    language: "typescript"
  },
  content: [
    {
      type: "text",
      text: "const x = 42;",
      styles: {}
    }
  ]
}
```

**Enhanced Code Block with Syntax Highlighting:**
```bash
npm install @blocknote/code-block
```

```typescript
import { CodeBlockExtension } from "@blocknote/code-block";

const editor = useCreateBlockNote({
  extensions: [CodeBlockExtension],
});
```

**Supported Languages:** JavaScript, TypeScript, Python, Java, C, C++, C#, Ruby, Go, Rust, PHP, HTML, CSS, JSON, XML, SQL, Shell, and many more.

#### Media Blocks

**Image**
```typescript
{
  type: "image",
  props: {
    url: "https://example.com/image.jpg",
    caption: "Image caption",
    previewWidth: 512
  }
}
```

**Video**
```typescript
{
  type: "video",
  props: {
    url: "https://youtube.com/watch?v=...",
    caption: "Video caption",
    previewWidth: 512
  }
}
```

**Audio**
```typescript
{
  type: "audio",
  props: {
    url: "https://example.com/audio.mp3",
    caption: "Audio caption"
  }
}
```

**File**
```typescript
{
  type: "file",
  props: {
    url: "https://example.com/document.pdf",
    caption: "File caption",
    name: "document.pdf"
  }
}
```

#### Table Blocks

**Creating Tables:**
```typescript
{
  type: "table",
  content: {
    type: "tableContent",
    rows: [
      {
        cells: [
          [{ type: "text", text: "Header 1", styles: { bold: true } }],
          [{ type: "text", text: "Header 2", styles: { bold: true } }]
        ]
      },
      {
        cells: [
          [{ type: "text", text: "Cell 1", styles: {} }],
          [{ type: "text", text: "Cell 2", styles: {} }]
        ]
      }
    ]
  }
}
```

**Table Features:**
- Add/remove rows and columns
- Merge cells
- Cell background colors
- Resize columns

#### Layout Blocks

**Page Break**
```typescript
{
  type: "pageBreak"
}
```

**Multi-Column Layout** (requires @blocknote/xl-multi-column):
```typescript
{
  type: "columnList",
  children: [
    {
      type: "column",
      props: { width: 50 },
      children: [
        { type: "paragraph", content: "Left column" }
      ]
    },
    {
      type: "column",
      props: { width: 50 },
      children: [
        { type: "paragraph", content: "Right column" }
      ]
    }
  ]
}
```

### Text Formatting

#### Available Styles

```typescript
type Styles = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
};
```

#### Applying Styles Programmatically

```typescript
// Add styles to selection
editor.addStyles({ bold: true, textColor: "red" });

// Remove styles from selection
editor.removeStyles({ bold: true });

// Toggle styles
editor.toggleStyles({ italic: true });

// Get active styles at cursor
const activeStyles = editor.getActiveStyles();
```

#### Custom Colors

**Default Colors:** default, gray, brown, red, orange, yellow, green, blue, purple, pink

**Using Custom Colors:**
```typescript
editor.addStyles({
  textColor: "#ff5733",
  backgroundColor: "#e0e0e0"
});
```

### Links

#### Creating Links

```typescript
// Create link from selected text
editor.createLink("https://blocknotejs.org");

// Create link with custom text
editor.createLink("https://blocknotejs.org", "Visit BlockNote");
```

#### Working with Links

```typescript
// Get selected link URL
const url = editor.getSelectedLinkUrl();

// Remove link
editor.createLink("");

// Insert link programmatically
editor.insertInlineContent([
  {
    type: "link",
    content: "BlockNote",
    href: "https://blocknotejs.org"
  }
]);
```

### Block Manipulation API

#### Reading Blocks

```typescript
// Get all top-level blocks
const blocks = editor.document;

// Get specific block
const block = editor.getBlock("block-id");

// Navigate blocks
const prevBlock = editor.getPrevBlock("block-id");
const nextBlock = editor.getNextBlock("block-id");
const parentBlock = editor.getParentBlock("block-id");

// Traverse all blocks
editor.forEachBlock((block) => {
  console.log(block.type);
  return true; // continue
});
```

#### Creating Blocks

```typescript
// Insert single block
editor.insertBlocks(
  [{ type: "paragraph", content: "New paragraph" }],
  "reference-block-id",
  "after"
);

// Insert multiple blocks
editor.insertBlocks(
  [
    { type: "heading", props: { level: 2 }, content: "Section" },
    { type: "paragraph", content: "Content" }
  ],
  "reference-block-id",
  "before"
);
```

#### Updating Blocks

```typescript
// Update block content
editor.updateBlock("block-id", {
  content: "Updated content"
});

// Change block type
editor.updateBlock("block-id", {
  type: "heading",
  props: { level: 2 }
});

// Update properties
editor.updateBlock("block-id", {
  props: {
    textColor: "blue",
    textAlignment: "center"
  }
});
```

#### Removing Blocks

```typescript
// Remove single block
editor.removeBlocks(["block-id"]);

// Remove multiple blocks
editor.removeBlocks(["block-1", "block-2", "block-3"]);
```

#### Replacing Blocks

```typescript
// Replace one block with another
editor.replaceBlocks(
  ["old-block-id"],
  [{ type: "heading", props: { level: 1 }, content: "New Heading" }]
);

// Replace multiple blocks
editor.replaceBlocks(
  ["block-1", "block-2"],
  [{ type: "paragraph", content: "Replacement" }]
);
```

#### Moving and Nesting Blocks

```typescript
// Move selected blocks up/down
editor.moveBlocksUp();
editor.moveBlocksDown();

// Nest/indent blocks
if (editor.canNestBlock()) {
  editor.nestBlock();
}

// Unnest/outdent blocks
if (editor.canUnnestBlock()) {
  editor.unnestBlock();
}
```

### Selection and Cursor

#### Getting Selection

```typescript
// Get current selection
const selection = editor.getSelection();

// Get selected text
const text = editor.getSelectedText();

// Get text cursor position
const textCursorPosition = editor.getTextCursorPosition();
```

#### Setting Selection

```typescript
// Set selection to specific block
editor.setTextCursorPosition("block-id", "end");

// Set selection to start of block
editor.setTextCursorPosition("block-id", "start");

// Focus editor
editor.focus();
```

### File Uploads

#### Configuring File Upload

```typescript
const editor = useCreateBlockNote({
  uploadFile: async (file: File) => {
    // Upload file to your server
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.url; // Return the file URL
  },
});
```

#### S3 Upload Example

```typescript
uploadFile: async (file) => {
  // Get presigned URL from your backend
  const { uploadUrl, fileUrl } = await getPresignedUrl(file.name);

  // Upload directly to S3
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  return fileUrl; // Return the public URL
}
```

### Saving and Loading Documents

#### Saving

```typescript
function App() {
  const editor = useCreateBlockNote();

  const handleSave = async () => {
    // Get document as JSON
    const document = editor.document;

    // Save to your backend
    await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(document),
    });
  };

  return (
    <div>
      <button onClick={handleSave}>Save</button>
      <BlockNoteView editor={editor} />
    </div>
  );
}
```

#### Loading

```typescript
function App() {
  const [initialContent, setInitialContent] = useState("loading");

  useEffect(() => {
    // Load from backend
    fetch("/api/document/123")
      .then(res => res.json())
      .then(data => setInitialContent(data.blocks));
  }, []);

  const editor = useMemo(() => {
    if (initialContent === "loading") return undefined;
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (!editor) return "Loading...";

  return <BlockNoteView editor={editor} />;
}
```

#### Auto-Save with onChange

```typescript
const editor = useCreateBlockNote();

return (
  <BlockNoteView
    editor={editor}
    onChange={() => {
      // Debounce this in production!
      saveToBackend(editor.document);
    }}
  />
);
```

---

## Advanced Topics

### Custom Blocks

Create custom block types tailored to your application:

```typescript
import { createReactBlockSpec } from "@blocknote/react";

// Define custom block
const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      type: {
        default: "info",
        values: ["info", "warning", "error", "success"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => (
      <div className={`alert alert-${props.block.props.type}`}>
        <InlineContent />
      </div>
    ),
  }
);

// Use in editor
const editor = useCreateBlockNote({
  schema: BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      alert: Alert,
    },
  }),
});
```

### Custom Inline Content

Create custom inline elements like mentions:

```typescript
const Mention = createReactInlineContentSpec(
  {
    type: "mention",
    propSchema: {
      user: {
        default: "Unknown",
      },
    },
    content: "none",
  },
  {
    render: (props) => (
      <span className="mention">
        @{props.inlineContent.props.user}
      </span>
    ),
  }
);
```

### Custom Styles

Add custom text styles:

```typescript
const customSchema = BlockNoteSchema.create({
  styleSpecs: {
    ...defaultStyleSpecs,
    // Add font size style
    fontSize: createStyleSpec({
      type: "fontSize",
      propSchema: "string",
    }),
  },
});
```

### Real-Time Collaboration

#### PartyKit Setup

```bash
npm install yjs y-partykit
```

```typescript
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";

const doc = new Y.Doc();
const provider = new YPartyKitProvider(
  "your-partykit-host.partykit.dev",
  "document-room-id",
  doc
);

const editor = useCreateBlockNote({
  collaboration: {
    provider,
    fragment: doc.getXmlFragment("document-store"),
    user: {
      name: "John Doe",
      color: "#ff0000",
    },
  },
});
```

#### Liveblocks Setup

```bash
npm install @liveblocks/client @liveblocks/yjs
```

```typescript
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";

const doc = new Y.Doc();
const provider = new LiveblocksYjsProvider(room, doc);

const editor = useCreateBlockNote({
  collaboration: {
    provider,
    fragment: doc.getXmlFragment("document-store"),
    user: {
      name: "Jane Smith",
      color: "#00ff00",
    },
  },
});
```

### Comments System

```typescript
import { CommentExtension } from "@blocknote/core";

const editor = useCreateBlockNote({
  extensions: [CommentExtension],
});

// Add comment
editor.comments.createComment("block-id", {
  author: "John Doe",
  text: "This needs review",
  timestamp: Date.now(),
});

// Get comments for block
const comments = editor.comments.getComments("block-id");

// Delete comment
editor.comments.deleteComment("comment-id");
```

### AI Integration

#### Setup with OpenAI

```bash
npm install @blocknote/xl-ai @ai-sdk/openai
```

```typescript
import { createOpenAI } from "@ai-sdk/openai";
import { createAIExtension, AIMenuController, AIToolbarButton } from "@blocknote/xl-ai";
import { en as aiEn } from "@blocknote/xl-ai/locales";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = openai("gpt-4");

const editor = useCreateBlockNote({
  dictionary: {
    ...en,
    ai: aiEn,
  },
  extensions: [
    createAIExtension({
      transport: new ClientSideTransport({ model }),
    }),
  ],
});

// Render with AI components
<BlockNoteView editor={editor}>
  <AIMenuController />
  <FormattingToolbarWithAI />
</BlockNoteView>
```

#### Setup with Google Gemini

```bash
npm install @ai-sdk/google
```

```typescript
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY
});
const model = google("gemini-2.0-flash-exp");

const editor = useCreateBlockNote({
  extensions: [
    createAIExtension({
      transport: new ClientSideTransport({ model }),
    }),
  ],
});
```

#### Custom AI Commands

```typescript
const customAICommands = [
  {
    name: "Translate to Spanish",
    execute: async (editor, selection) => {
      const text = editor.getSelectedText();
      const translated = await translateText(text, "es");
      editor.insertInlineContent(translated);
    },
  },
];
```

### Import/Export

#### HTML Export

```typescript
import { blocksToHTMLLossy } from "@blocknote/core";

// Export to HTML
const html = await blocksToHTMLLossy(editor.document, editor.schema);
console.log(html);
```

#### HTML Import

```typescript
import { HTMLToBlocks } from "@blocknote/core";

// Import from HTML
const blocks = await HTMLToBlocks("<h1>Hello</h1><p>World</p>", editor.schema, editor);
editor.replaceBlocks(editor.document, blocks);
```

#### Markdown Export

```typescript
import { blocksToMarkdownLossy } from "@blocknote/core";

// Export to Markdown
const markdown = await blocksToMarkdownLossy(editor.document, editor.schema);
console.log(markdown);
```

#### Markdown Import

```typescript
import { markdownToBlocks } from "@blocknote/core";

// Import from Markdown
const blocks = await markdownToBlocks("# Hello\n\nWorld", editor.schema, editor);
editor.replaceBlocks(editor.document, blocks);
```

#### PDF Export

```bash
npm install @blocknote/xl-pdf-exporter
```

```typescript
import { blocksToPDF } from "@blocknote/xl-pdf-exporter";

// Export to PDF
const pdfBlob = await blocksToPDF(editor.document, editor.schema);

// Download PDF
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
```

#### DOCX Export

```bash
npm install @blocknote/xl-docx-exporter
```

```typescript
import { blocksToDOCX } from "@blocknote/xl-docx-exporter";

// Export to DOCX
const docxBlob = await blocksToDOCX(editor.document, editor.schema);

// Download DOCX
const url = URL.createObjectURL(docxBlob);
const a = document.createElement("a");
a.href = url;
a.download = "document.docx";
a.click();
```

### Theming

#### Using CSS Variables

```css
:root {
  --bn-colors-editor-text: #000000;
  --bn-colors-editor-background: #ffffff;
  --bn-colors-menu-background: #f5f5f5;
  --bn-colors-menu-text: #333333;
  --bn-colors-tooltip-background: #1a1a1a;
  --bn-colors-tooltip-text: #ffffff;
  --bn-colors-hovered-background: #e0e0e0;
  --bn-colors-selected-background: #d0d0d0;
  --bn-colors-disabled-background: #f0f0f0;
  --bn-colors-disabled-text: #999999;
  --bn-colors-border: #cccccc;
  --bn-colors-side-menu: #666666;
  --bn-colors-highlights-gray-background: #f0f0f0;
  --bn-colors-highlights-gray-text: #666666;
  /* ... more variables */
}
```

#### Built-in Themes

```typescript
<BlockNoteView
  editor={editor}
  theme="dark"  // "light" | "dark"
/>
```

#### Custom Font

```typescript
import "@blocknote/core/fonts/inter.css"; // Default
// Or use your own font

const editor = useCreateBlockNote({
  // Set font in CSS
});
```

```css
.bn-editor {
  font-family: "Your Custom Font", sans-serif;
}
```

### Localization

```typescript
import { en } from "@blocknote/core/locales";

const customDictionary = {
  ...en,
  slash_menu: {
    ...en.slash_menu,
    heading: {
      ...en.slash_menu.heading,
      title: "Título",
    },
  },
};

const editor = useCreateBlockNote({
  dictionary: customDictionary,
});
```

### Custom UI Components

#### Custom Formatting Toolbar

```typescript
import {
  FormattingToolbar,
  FormattingToolbarController,
  BasicTextStyleButton,
  BlockTypeSelect,
} from "@blocknote/react";

<BlockNoteView editor={editor} formattingToolbar={false}>
  <FormattingToolbarController
    formattingToolbar={() => (
      <FormattingToolbar>
        <BlockTypeSelect />
        <BasicTextStyleButton basicTextStyle="bold" />
        <BasicTextStyleButton basicTextStyle="italic" />
        {/* Add custom buttons */}
      </FormattingToolbar>
    )}
  />
</BlockNoteView>
```

#### Custom Slash Menu

```typescript
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";

<SuggestionMenuController
  triggerCharacter="/"
  getItems={async (query) => {
    const defaultItems = getDefaultReactSlashMenuItems(editor);
    const customItems = [
      {
        title: "Custom Block",
        onItemClick: () => {
          editor.insertBlocks([{ type: "customBlock" }], editor.getTextCursorPosition().block, "after");
        },
        icon: <CustomIcon />,
      },
    ];
    return [...defaultItems, ...customItems];
  }}
/>
```

---

## Best Practices

### Performance

1. **Debounce Auto-Save**: Don't save on every keystroke
   ```typescript
   const debouncedSave = useMemo(
     () => debounce((blocks) => saveToBackend(blocks), 1000),
     []
   );

   <BlockNoteView
     editor={editor}
     onChange={() => debouncedSave(editor.document)}
   />
   ```

2. **Lazy Load Large Documents**: Load content progressively
3. **Optimize Images**: Resize and compress images before upload
4. **Use Server-Side Rendering Carefully**: BlockNote requires DOM access

### Error Handling

```typescript
const editor = useCreateBlockNote({
  uploadFile: async (file) => {
    try {
      const url = await uploadToServer(file);
      return url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // BlockNote will handle the error
    }
  },
});
```

### TypeScript

```typescript
import { BlockNoteEditor, Block, PartialBlock } from "@blocknote/core";

// Type your custom blocks
type MyCustomSchema = BlockNoteSchema<{
  alert: typeof Alert;
  paragraph: typeof Paragraph;
  // ...
}>;

const editor = useCreateBlockNote<MyCustomSchema>();

// Now editor.document is fully typed
const blocks: Block<MyCustomSchema>[] = editor.document;
```

### Security

1. **Sanitize HTML Imports**: Always validate and sanitize external content
2. **Validate File Uploads**: Check file types and sizes
3. **Secure File URLs**: Use signed URLs for sensitive content
4. **API Keys**: Never expose API keys in client-side code (use backend proxies)

### Accessibility

1. **Use Ariakit Package**: For best accessibility support
   ```bash
   npm install @blocknote/ariakit
   ```

2. **Provide Alt Text**: For images and media
3. **Keyboard Navigation**: BlockNote supports full keyboard navigation
4. **Screen Readers**: Tested with major screen readers

### Mobile Support

```typescript
// Use experimental mobile formatting toolbar
import {
  MobileFormattingToolbarController
} from "@blocknote/react";

<BlockNoteView editor={editor} formattingToolbar={false}>
  <MobileFormattingToolbarController />
</BlockNoteView>
```

---

## Additional Resources

- **Documentation**: https://www.blocknotejs.org/docs
- **Examples**: https://www.blocknotejs.org/examples
- **GitHub**: https://github.com/TypeCellOS/BlockNote
- **Discord**: https://discord.gg/Qc2QTTH5dF
- **NPM**: https://www.npmjs.com/package/@blocknote/react

---

## Support

For questions, issues, or contributions:

1. Check the [documentation](https://www.blocknotejs.org/docs)
2. Browse [examples](https://www.blocknotejs.org/examples)
3. Search [GitHub issues](https://github.com/TypeCellOS/BlockNote/issues)
4. Join the [Discord community](https://discord.gg/Qc2QTTH5dF)
5. Create a new issue if needed

---

**Version**: 0.41.1
**Last Updated**: January 2025
**License**: MPL-2.0 (core), GPL-3.0 (XL packages)
