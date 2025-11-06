# BlockNote Tutorials - Common Use Cases

## Table of Contents

1. [Building a Simple Note-Taking App](#tutorial-1-building-a-simple-note-taking-app)
2. [Creating a Blog Editor with Save/Load](#tutorial-2-creating-a-blog-editor-with-saveload)
3. [Implementing File Uploads with S3](#tutorial-3-implementing-file-uploads-with-s3)
4. [Adding Real-Time Collaboration](#tutorial-4-adding-real-time-collaboration)
5. [Creating Custom Blocks](#tutorial-5-creating-custom-blocks)
6. [Customizing the UI](#tutorial-6-customizing-the-ui)
7. [Building a Documentation Editor](#tutorial-7-building-a-documentation-editor)
8. [Integrating AI Features](#tutorial-8-integrating-ai-features)
9. [Implementing Export Functionality](#tutorial-9-implementing-export-functionality)
10. [Building a Comments System](#tutorial-10-building-a-comments-system)

---

## Tutorial 1: Building a Simple Note-Taking App

Learn to create a basic note-taking application with local storage persistence.

### Goal

Create a note app that:
- Loads previous notes on startup
- Auto-saves as you type
- Has a clean, simple interface

### Step 1: Setup

```bash
npm create vite@latest my-notes-app -- --template react-ts
cd my-notes-app
npm install @blocknote/core @blocknote/react @blocknote/mantine
npm install
```

### Step 2: Create the Editor Component

```tsx
// src/components/NotesEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";

// Save to localStorage with debouncing
const saveToStorage = (blocks: Block[]) => {
  localStorage.setItem("notes", JSON.stringify(blocks));
};

// Load from localStorage
const loadFromStorage = (): PartialBlock[] | undefined => {
  const stored = localStorage.getItem("notes");
  return stored ? JSON.parse(stored) : undefined;
};

export default function NotesEditor() {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  // Load saved content on mount
  useEffect(() => {
    const content = loadFromStorage();
    setInitialContent(content || [
      {
        type: "heading",
        props: { level: 1 },
        content: "My Notes",
      },
      {
        type: "paragraph",
        content: "Start typing your notes here...",
      },
    ]);
  }, []);

  // Create editor once content is loaded
  const editor = useMemo(() => {
    if (initialContent === "loading") return undefined;
    return BlockNoteEditor.create({ initialContent });
  }, [initialContent]);

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={() => {
          // Auto-save on every change
          saveToStorage(editor.document);
        }}
      />
    </div>
  );
}
```

### Step 3: Use in App

```tsx
// src/App.tsx
import NotesEditor from "./components/NotesEditor";

function App() {
  return (
    <div className="App">
      <NotesEditor />
    </div>
  );
}

export default App;
```

### Step 4: Add Debounced Auto-Save (Optional)

For better performance, debounce the save operation:

```bash
npm install lodash
npm install -D @types/lodash
```

```tsx
import { debounce } from "lodash";

const debouncedSave = useMemo(
  () => debounce((blocks: Block[]) => {
    saveToStorage(blocks);
    console.log("Notes saved!");
  }, 1000),
  []
);

return (
  <BlockNoteView
    editor={editor}
    onChange={() => debouncedSave(editor.document)}
  />
);
```

### Enhancement: Add Multiple Notes

```tsx
// src/components/NotesApp.tsx
import { useState } from "react";
import NotesEditor from "./NotesEditor";

interface Note {
  id: string;
  title: string;
  lastModified: number;
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      lastModified: Date.now(),
    };
    setNotes([...notes, newNote]);
    setCurrentNoteId(newNote.id);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", borderRight: "1px solid #ddd", padding: "20px" }}>
        <button onClick={createNewNote}>+ New Note</button>
        <ul>
          {notes.map(note => (
            <li key={note.id} onClick={() => setCurrentNoteId(note.id)}>
              {note.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        {currentNoteId && <NotesEditor noteId={currentNoteId} />}
      </div>
    </div>
  );
}
```

---

## Tutorial 2: Creating a Blog Editor with Save/Load

Build a blog post editor with backend integration.

### Goal

Create an editor that:
- Loads posts from a backend API
- Saves changes to the backend
- Shows save status
- Supports draft and published states

### Step 1: Setup Backend API (Example)

```typescript
// api/posts.ts
export interface Post {
  id: string;
  title: string;
  content: Block[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

export async function loadPost(id: string): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`);
  return response.json();
}

export async function savePost(post: Post): Promise<void> {
  await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
}

export async function createPost(title: string): Promise<Post> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      content: [{ type: "paragraph", content: "" }],
      status: "draft",
    }),
  });
  return response.json();
}
```

### Step 2: Create Blog Editor Component

```tsx
// src/components/BlogEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { loadPost, savePost, Post } from "../api/posts";

interface BlogEditorProps {
  postId: string;
}

export default function BlogEditor({ postId }: BlogEditorProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  // Load post from backend
  useEffect(() => {
    loadPost(postId)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load post:", error);
        setLoading(false);
      });
  }, [postId]);

  // Create editor with loaded content
  const editor = useMemo(() => {
    if (!post) return undefined;
    return BlockNoteEditor.create({
      initialContent: post.content,
    });
  }, [post]);

  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce(async (updatedPost: Post) => {
      setSaveStatus("saving");
      try {
        await savePost(updatedPost);
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save:", error);
        setSaveStatus("error");
      }
    }, 1000),
    []
  );

  // Handle content changes
  const handleChange = () => {
    if (!editor || !post) return;

    const updatedPost: Post = {
      ...post,
      content: editor.document,
      updatedAt: Date.now(),
    };

    setPost(updatedPost);
    debouncedSave(updatedPost);
  };

  // Publish post
  const handlePublish = async () => {
    if (!post || !editor) return;

    const updatedPost: Post = {
      ...post,
      content: editor.document,
      status: "published",
      updatedAt: Date.now(),
    };

    await savePost(updatedPost);
    setPost(updatedPost);
    alert("Post published!");
  };

  if (loading) return <div>Loading post...</div>;
  if (!editor || !post) return <div>Failed to load post</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          value={post.title}
          onChange={(e) => {
            const updatedPost = { ...post, title: e.target.value };
            setPost(updatedPost);
            debouncedSave(updatedPost);
          }}
          style={{
            fontSize: "24px",
            border: "none",
            outline: "none",
            width: "100%",
          }}
          placeholder="Post title..."
        />

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{
            fontSize: "12px",
            color: saveStatus === "error" ? "red" : "#666",
          }}>
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "error" && "Error saving"}
          </span>

          <button onClick={handlePublish}>
            {post.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <BlockNoteView editor={editor} onChange={handleChange} />
    </div>
  );
}
```

### Step 3: Create Post List Component

```tsx
// src/components/PostList.tsx
import { useEffect, useState } from "react";
import { Post } from "../api/posts";

interface PostListProps {
  onSelectPost: (postId: string) => void;
}

export default function PostList({ onSelectPost }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id} onClick={() => onSelectPost(post.id)}>
            <div>{post.title}</div>
            <small>{post.status}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Tutorial 3: Implementing File Uploads with S3

Set up file uploads to AWS S3 with presigned URLs.

### Goal

- Upload images and files directly to S3
- Display progress during upload
- Handle errors gracefully

### Step 1: Backend - Generate Presigned URLs

```typescript
// backend/api/upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(fileName: string, fileType: string) {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, publicUrl };
}
```

### Step 2: Frontend - Upload Function

```tsx
// src/utils/uploadToS3.ts
export async function uploadToS3(file: File): Promise<string> {
  // Step 1: Get presigned URL from backend
  const response = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  const { uploadUrl, publicUrl } = await response.json();

  // Step 2: Upload directly to S3
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  // Step 3: Return public URL
  return publicUrl;
}
```

### Step 3: Configure BlockNote Editor

```tsx
// src/components/EditorWithUpload.tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { uploadToS3 } from "../utils/uploadToS3";

export default function EditorWithUpload() {
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      try {
        console.log("Uploading file:", file.name);
        const url = await uploadToS3(file);
        console.log("Upload complete:", url);
        return url;
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    },
  });

  return <BlockNoteView editor={editor} />;
}
```

### Step 4: Add Upload Progress (Advanced)

```tsx
// src/utils/uploadWithProgress.ts
export async function uploadToS3WithProgress(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  // Get presigned URL
  const response = await fetch("/api/upload/presigned-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  const { uploadUrl, publicUrl } = await response.json();

  // Upload with progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve(publicUrl);
      } else {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload failed")));

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
```

```tsx
const editor = useCreateBlockNote({
  uploadFile: async (file: File) => {
    return uploadToS3WithProgress(file, (progress) => {
      console.log(`Upload progress: ${progress.toFixed(0)}%`);
    });
  },
});
```

---

## Tutorial 4: Adding Real-Time Collaboration

Implement multi-user real-time editing with PartyKit.

### Goal

- Multiple users can edit simultaneously
- See others' cursors and selections
- Automatic conflict resolution

### Step 1: Install Dependencies

```bash
npm install yjs y-partykit
```

### Step 2: Create Collaboration Component

```tsx
// src/components/CollaborativeEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";
import { useEffect, useState } from "react";

interface CollaborativeEditorProps {
  roomId: string;
  userName: string;
}

// Generate a random color for user
const generateUserColor = () => {
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function CollaborativeEditor({ roomId, userName }: CollaborativeEditorProps) {
  const [doc] = useState(() => new Y.Doc());
  const [provider] = useState(() =>
    new YPartyKitProvider(
      "blocknote-dev.yousefed.partykit.dev", // PartyKit host
      roomId,
      doc
    )
  );

  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userName,
        color: generateUserColor(),
      },
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [provider, doc]);

  return (
    <div>
      <div style={{ padding: "10px", background: "#f5f5f5", marginBottom: "10px" }}>
        <strong>Room:</strong> {roomId} | <strong>User:</strong> {userName}
      </div>
      <BlockNoteView editor={editor} />
    </div>
  );
}
```

### Step 3: Create Room Selector

```tsx
// src/components/CollaborationApp.tsx
import { useState } from "react";
import CollaborativeEditor from "./CollaborativeEditor";

export default function CollaborationApp() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomId && userName) {
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
        <h1>Join Collaborative Session</h1>

        <input
          type="text"
          placeholder="Enter room ID..."
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="text"
          placeholder="Enter your name..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button onClick={handleJoin} style={{ width: "100%", padding: "10px" }}>
          Join Room
        </button>

        <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
          Share the room ID with others to collaborate on the same document.
        </p>
      </div>
    );
  }

  return <CollaborativeEditor roomId={roomId} userName={userName} />;
}
```

### Step 4: Using Liveblocks (Alternative)

```bash
npm install @liveblocks/client @liveblocks/yjs
```

```tsx
import { createClient } from "@liveblocks/client";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";

const client = createClient({
  publicApiKey: "pk_YOUR_PUBLIC_KEY",
});

export default function LiveblocksEditor() {
  const [doc] = useState(() => new Y.Doc());
  const [room] = useState(() => client.enter("my-room-id"));
  const [provider] = useState(() => new LiveblocksYjsProvider(room, doc));

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

  return <BlockNoteView editor={editor} />;
}
```

---

## Tutorial 5: Creating Custom Blocks

Build a custom "Alert" block with different types (info, warning, error, success).

### Goal

- Create a reusable custom block
- Add custom properties (alert type)
- Style the block appropriately
- Add to slash menu

### Step 1: Define Alert Block

```tsx
// src/blocks/AlertBlock.tsx
import { createReactBlockSpec } from "@blocknote/react";
import { InlineContent } from "@blocknote/react";
import "./AlertBlock.css";

// Define the alert block
export const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      type: {
        default: "info" as const,
        values: ["info", "warning", "error", "success"] as const,
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const { type } = props.block.props;

      return (
        <div className={`alert alert-${type}`} data-content-type={props.contentType}>
          <div className="alert-icon">
            {type === "info" && "ℹ️"}
            {type === "warning" && "⚠️"}
            {type === "error" && "❌"}
            {type === "success" && "✅"}
          </div>
          <div className="alert-content">
            <InlineContent />
          </div>
        </div>
      );
    },
  }
);
```

### Step 2: Style the Alert Block

```css
/* src/blocks/AlertBlock.css */
.alert {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  margin: 8px 0;
  border-left: 4px solid;
}

.alert-info {
  background-color: #e3f2fd;
  border-left-color: #2196f3;
  color: #0d47a1;
}

.alert-warning {
  background-color: #fff3e0;
  border-left-color: #ff9800;
  color: #e65100;
}

.alert-error {
  background-color: #ffebee;
  border-left-color: #f44336;
  color: #b71c1c;
}

.alert-success {
  background-color: #e8f5e9;
  border-left-color: #4caf50;
  color: #1b5e20;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}
```

### Step 3: Create Custom Schema

```tsx
// src/hooks/useCustomEditor.ts
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { Alert } from "../blocks/AlertBlock";

// Create custom schema with alert block
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: Alert,
  },
  inlineContentSpecs: defaultInlineContentSpecs,
  styleSpecs: defaultStyleSpecs,
});

export function useCustomEditor() {
  return useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: "Custom Alert Blocks",
      },
      {
        type: "alert",
        props: { type: "info" },
        content: "This is an info alert block",
      },
      {
        type: "alert",
        props: { type: "warning" },
        content: "This is a warning alert block",
      },
      {
        type: "alert",
        props: { type: "error" },
        content: "This is an error alert block",
      },
      {
        type: "alert",
        props: { type: "success" },
        content: "This is a success alert block",
      },
    ],
  });
}
```

### Step 4: Add to Slash Menu

```tsx
// src/components/EditorWithCustomBlocks.tsx
import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import { useCustomEditor } from "../hooks/useCustomEditor";

export default function EditorWithCustomBlocks() {
  const editor = useCustomEditor();

  return (
    <BlockNoteView editor={editor} slashMenu={false}>
      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) => {
          const defaultItems = getDefaultReactSlashMenuItems(editor);

          const customItems = [
            {
              title: "Info Alert",
              onItemClick: () => {
                editor.insertBlocks(
                  [{ type: "alert", props: { type: "info" }, content: "" }],
                  editor.getTextCursorPosition().block,
                  "after"
                );
              },
              aliases: ["alert", "info", "callout"],
              group: "Custom",
            },
            {
              title: "Warning Alert",
              onItemClick: () => {
                editor.insertBlocks(
                  [{ type: "alert", props: { type: "warning" }, content: "" }],
                  editor.getTextCursorPosition().block,
                  "after"
                );
              },
              aliases: ["alert", "warning"],
              group: "Custom",
            },
            {
              title: "Error Alert",
              onItemClick: () => {
                editor.insertBlocks(
                  [{ type: "alert", props: { type: "error" }, content: "" }],
                  editor.getTextCursorPosition().block,
                  "after"
                );
              },
              aliases: ["alert", "error", "danger"],
              group: "Custom",
            },
            {
              title: "Success Alert",
              onItemClick: () => {
                editor.insertBlocks(
                  [{ type: "alert", props: { type: "success" }, content: "" }],
                  editor.getTextCursorPosition().block,
                  "after"
                );
              },
              aliases: ["alert", "success"],
              group: "Custom",
            },
          ];

          return [...defaultItems, ...customItems].filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          );
        }}
      />
    </BlockNoteView>
  );
}
```

### Step 5: Add Type Switcher (Advanced)

```tsx
// Add a dropdown to switch alert types
import { useState } from "react";

// In the Alert block render function:
render: (props) => {
  const { type } = props.block.props;

  return (
    <div className={`alert alert-${type}`}>
      <select
        value={type}
        onChange={(e) => {
          props.editor.updateBlock(props.block, {
            props: { type: e.target.value as "info" | "warning" | "error" | "success" },
          });
        }}
        className="alert-type-selector"
      >
        <option value="info">Info</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
        <option value="success">Success</option>
      </select>

      <div className="alert-icon">
        {type === "info" && "ℹ️"}
        {type === "warning" && "⚠️"}
        {type === "error" && "❌"}
        {type === "success" && "✅"}
      </div>

      <div className="alert-content">
        <InlineContent />
      </div>
    </div>
  );
}
```

---

## Tutorial 6: Customizing the UI

Customize the formatting toolbar and other UI elements.

### Goal

- Remove unwanted buttons
- Add custom buttons
- Rearrange toolbar layout
- Create a custom theme

### Step 1: Custom Formatting Toolbar

```tsx
// src/components/CustomToolbarEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  TextAlignButton,
  useCreateBlockNote,
} from "@blocknote/react";

export default function CustomToolbarEditor() {
  const editor = useCreateBlockNote();

  return (
    <BlockNoteView editor={editor} formattingToolbar={false}>
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            {/* Block type selector */}
            <BlockTypeSelect key="blockTypeSelect" />

            {/* Text formatting */}
            <BasicTextStyleButton basicTextStyle="bold" key="bold" />
            <BasicTextStyleButton basicTextStyle="italic" key="italic" />
            <BasicTextStyleButton basicTextStyle="underline" key="underline" />
            <BasicTextStyleButton basicTextStyle="strike" key="strike" />

            {/* Text alignment */}
            <TextAlignButton textAlignment="left" key="alignLeft" />
            <TextAlignButton textAlignment="center" key="alignCenter" />
            <TextAlignButton textAlignment="right" key="alignRight" />

            {/* Colors */}
            <ColorStyleButton key="colors" />

            {/* Links */}
            <CreateLinkButton key="createLink" />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  );
}
```

### Step 2: Create Custom Button

```tsx
// src/components/HighlightButton.tsx
import { useComponentsContext } from "@blocknote/react";

export function HighlightButton() {
  const Components = useComponentsContext();
  const editor = useBlockNoteEditor();

  return (
    <Components.Generic.Toolbar.Button
      mainTooltip="Highlight"
      onClick={() => {
        editor.addStyles({ backgroundColor: "yellow" });
      }}
    >
      🖍️
    </Components.Generic.Toolbar.Button>
  );
}
```

Use in toolbar:

```tsx
<FormattingToolbar>
  {/* ... other buttons ... */}
  <HighlightButton key="highlight" />
</FormattingToolbar>
```

### Step 3: Custom Theme with CSS Variables

```css
/* src/theme/custom-theme.css */
:root {
  /* Editor colors */
  --bn-colors-editor-text: #1a1a1a;
  --bn-colors-editor-background: #ffffff;

  /* Menu colors */
  --bn-colors-menu-background: #f8f9fa;
  --bn-colors-menu-text: #212529;

  /* Hover states */
  --bn-colors-hovered-background: #e9ecef;
  --bn-colors-selected-background: #dee2e6;

  /* Borders */
  --bn-colors-border: #ced4da;

  /* Side menu */
  --bn-colors-side-menu: #6c757d;

  /* Highlights */
  --bn-colors-highlights-blue-background: #cfe2ff;
  --bn-colors-highlights-blue-text: #084298;

  /* Font */
  --bn-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Dark theme */
.dark-theme {
  --bn-colors-editor-text: #e9ecef;
  --bn-colors-editor-background: #212529;
  --bn-colors-menu-background: #343a40;
  --bn-colors-menu-text: #e9ecef;
  --bn-colors-hovered-background: #495057;
  --bn-colors-selected-background: #6c757d;
  --bn-colors-border: #495057;
}
```

Apply theme:

```tsx
import "./theme/custom-theme.css";

<div className="dark-theme">
  <BlockNoteView editor={editor} theme="dark" />
</div>
```

### Step 4: Mobile-Friendly Toolbar

```tsx
import {
  MobileFormattingToolbarController
} from "@blocknote/react";

export default function MobileEditor() {
  const editor = useCreateBlockNote();

  return (
    <BlockNoteView editor={editor} formattingToolbar={false}>
      <MobileFormattingToolbarController />
    </BlockNoteView>
  );
}
```

---

## Tutorial 7: Building a Documentation Editor

Create a documentation editor with table of contents and export options.

### Goal

- Generate table of contents from headings
- Support markdown export
- Add syntax-highlighted code blocks
- Implement document search

### Step 1: Install Code Block Package

```bash
npm install @blocknote/code-block
```

### Step 2: Create Documentation Editor

```tsx
// src/components/DocsEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { CodeBlockExtension } from "@blocknote/code-block";
import { useState, useEffect } from "react";
import { blocksToMarkdownLossy } from "@blocknote/core";

export default function DocsEditor() {
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([]);

  const editor = useCreateBlockNote({
    extensions: [CodeBlockExtension],
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: "Documentation",
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Getting Started",
      },
      {
        type: "paragraph",
        content: "This is a documentation editor with TOC generation.",
      },
      {
        type: "heading",
        props: { level: 2 },
        content: "Installation",
      },
      {
        type: "codeBlock",
        props: { language: "bash" },
        content: [{ type: "text", text: "npm install my-package", styles: {} }],
      },
    ],
  });

  // Generate table of contents
  useEffect(() => {
    const headings = editor.document
      .filter(block => block.type === "heading")
      .map(block => ({
        id: block.id,
        text: block.content?.map(c => c.text).join("") || "",
        level: block.props.level as number,
      }));

    setToc(headings);
  }, [editor.document]);

  // Export to markdown
  const exportToMarkdown = async () => {
    const markdown = await blocksToMarkdownLossy(editor.document, editor.schema);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "documentation.md";
    a.click();
  };

  // Scroll to heading
  const scrollToHeading = (headingId: string) => {
    editor.setTextCursorPosition(headingId);
    editor.focus();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Table of Contents */}
      <aside style={{
        width: "250px",
        padding: "20px",
        borderRight: "1px solid #ddd",
        overflowY: "auto"
      }}>
        <h3>Contents</h3>
        <button onClick={exportToMarkdown} style={{ marginBottom: "20px" }}>
          Export to Markdown
        </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {toc.map(heading => (
            <li
              key={heading.id}
              style={{
                marginLeft: `${(heading.level - 1) * 15}px`,
                marginBottom: "8px",
                cursor: "pointer",
                color: "#0066cc",
              }}
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      </aside>

      {/* Editor */}
      <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <BlockNoteView editor={editor} />
      </main>
    </div>
  );
}
```

---

## Tutorial 8: Integrating AI Features

Add AI-powered content generation using Google Gemini.

### Goal

- Set up AI integration
- Add AI toolbar button
- Implement custom AI commands
- Handle AI responses

### Step 1: Install AI Package

```bash
npm install @blocknote/xl-ai @ai-sdk/google
```

### Step 2: Set Up Environment

```.env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Step 3: Create AI Editor

```tsx
// src/components/AIEditor.tsx
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  ClientSideTransport,
  createAIExtension,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import "@blocknote/xl-ai/style.css";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

const model = google("gemini-2.0-flash-exp");

export default function AIEditor() {
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
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: "AI-Powered Editor",
      },
      {
        type: "paragraph",
        content: "Select text and click the AI button to improve, translate, or transform it.",
      },
      {
        type: "paragraph",
        content: "Type /ai to see AI commands in the slash menu.",
      },
    ],
  });

  if (!GEMINI_API_KEY) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>⚠️ API Key Required</h1>
        <p>Please set VITE_GEMINI_API_KEY in your .env file</p>
      </div>
    );
  }

  return (
    <BlockNoteView editor={editor} formattingToolbar={false} slashMenu={false}>
      <AIMenuController />

      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            {getFormattingToolbarItems()}
            <AIToolbarButton />
          </FormattingToolbar>
        )}
      />

      <SuggestionMenuController
        triggerCharacter="/"
        getItems={async (query) =>
          [
            ...getDefaultReactSlashMenuItems(editor),
            ...getAISlashMenuItems(editor),
          ].filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
        }
      />
    </BlockNoteView>
  );
}
```

### Step 4: Custom AI Commands

```tsx
import { AICommand } from "@blocknote/xl-ai";

const customAICommands: AICommand[] = [
  {
    name: "Translate to Spanish",
    aliases: ["spanish", "español", "translate"],
    execute: async (editor, selectedText) => {
      return `Translate the following text to Spanish: ${selectedText}`;
    },
  },
  {
    name: "Make Professional",
    aliases: ["professional", "formal"],
    execute: async (editor, selectedText) => {
      return `Rewrite the following text in a professional, formal tone: ${selectedText}`;
    },
  },
  {
    name: "Add Emojis",
    aliases: ["emoji", "emojify"],
    execute: async (editor, selectedText) => {
      return `Add relevant emojis to this text: ${selectedText}`;
    },
  },
];

// Add to editor
const editor = useCreateBlockNote({
  extensions: [
    createAIExtension({
      transport: new ClientSideTransport({ model }),
      commands: customAICommands,
    }),
  ],
});
```

---

## Tutorial 9: Implementing Export Functionality

Export documents to various formats.

### Goal

- Export to PDF
- Export to DOCX
- Export to Markdown
- Export to HTML

### Step 1: Install Export Packages

```bash
npm install @blocknote/xl-pdf-exporter @blocknote/xl-docx-exporter
```

### Step 2: Create Export Component

```tsx
// src/components/ExportEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { blocksToHTMLLossy, blocksToMarkdownLossy } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { blocksToPDF } from "@blocknote/xl-pdf-exporter";
import { blocksToDOCX } from "@blocknote/xl-docx-exporter";

export default function ExportEditor() {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        props: { level: 1 },
        content: "My Document",
      },
      {
        type: "paragraph",
        content: "This document can be exported to multiple formats.",
      },
    ],
  });

  const exportToPDF = async () => {
    try {
      const pdfBlob = await blocksToPDF(editor.document, editor.schema);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export failed:", error);
    }
  };

  const exportToDOCX = async () => {
    try {
      const docxBlob = await blocksToDOCX(editor.document, editor.schema);
      const url = URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOCX export failed:", error);
    }
  };

  const exportToMarkdown = async () => {
    try {
      const markdown = await blocksToMarkdownLossy(editor.document, editor.schema);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.md";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Markdown export failed:", error);
    }
  };

  const exportToHTML = async () => {
    try {
      const html = await blocksToHTMLLossy(editor.document, editor.schema);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.html";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("HTML export failed:", error);
    }
  };

  return (
    <div>
      <div style={{
        padding: "10px",
        background: "#f5f5f5",
        display: "flex",
        gap: "10px",
        marginBottom: "10px"
      }}>
        <button onClick={exportToPDF}>Export to PDF</button>
        <button onClick={exportToDOCX}>Export to DOCX</button>
        <button onClick={exportToMarkdown}>Export to Markdown</button>
        <button onClick={exportToHTML}>Export to HTML</button>
      </div>

      <BlockNoteView editor={editor} />
    </div>
  );
}
```

---

## Tutorial 10: Building a Comments System

Implement a document commenting system.

### Goal

- Add inline comments to blocks
- Show comment sidebar
- Reply to comments
- Resolve comments

### Step 1: Define Comment Types

```typescript
// src/types/comments.ts
export interface Comment {
  id: string;
  blockId: string;
  author: {
    name: string;
    avatar?: string;
  };
  text: string;
  timestamp: number;
  replies: Comment[];
  resolved: boolean;
}
```

### Step 2: Create Comments Store

```typescript
// src/stores/commentsStore.ts
import { create } from "zustand";
import { Comment } from "../types/comments";

interface CommentsStore {
  comments: Comment[];
  addComment: (comment: Comment) => void;
  replyToComment: (commentId: string, reply: Comment) => void;
  resolveComment: (commentId: string) => void;
  deleteComment: (commentId: string) => void;
}

export const useCommentsStore = create<CommentsStore>((set) => ({
  comments: [],

  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),

  replyToComment: (commentId, reply) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ),
    })),

  resolveComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      ),
    })),

  deleteComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== commentId),
    })),
}));
```

### Step 3: Create Comments UI

```tsx
// src/components/CommentsEditor.tsx
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";
import { useCommentsStore } from "../stores/commentsStore";
import { Comment } from "../types/comments";

export default function CommentsEditor() {
  const editor = useCreateBlockNote();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const { comments, addComment, replyToComment, resolveComment } = useCommentsStore();

  const handleAddComment = (text: string) => {
    if (!selectedBlockId) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      blockId: selectedBlockId,
      author: {
        name: "Current User",
      },
      text,
      timestamp: Date.now(),
      replies: [],
      resolved: false,
    };

    addComment(newComment);
  };

  const blockComments = comments.filter((c) => c.blockId === selectedBlockId);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Editor */}
      <div style={{ flex: 1, padding: "20px" }}>
        <BlockNoteView
          editor={editor}
          onSelectionChange={() => {
            const selection = editor.getTextCursorPosition();
            setSelectedBlockId(selection.block.id);
          }}
        />
      </div>

      {/* Comments Sidebar */}
      <aside style={{
        width: "350px",
        padding: "20px",
        borderLeft: "1px solid #ddd",
        overflowY: "auto"
      }}>
        <h3>Comments</h3>

        {selectedBlockId && (
          <div style={{ marginBottom: "20px" }}>
            <textarea
              placeholder="Add a comment..."
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleAddComment(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <small>Press Ctrl+Enter to add comment</small>
          </div>
        )}

        {blockComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              background: comment.resolved ? "#f0f0f0" : "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{comment.author.name}</div>
            <div style={{ margin: "5px 0" }}>{comment.text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(comment.timestamp).toLocaleString()}
            </div>

            {!comment.resolved && (
              <button
                onClick={() => resolveComment(comment.id)}
                style={{ marginTop: "10px" }}
              >
                Resolve
              </button>
            )}

            {comment.replies.length > 0 && (
              <div style={{ marginTop: "10px", paddingLeft: "10px", borderLeft: "2px solid #ddd" }}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} style={{ marginBottom: "5px" }}>
                    <strong>{reply.author.name}:</strong> {reply.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>
    </div>
  );
}
```

---

## Next Steps

These tutorials cover the most common use cases for BlockNote. For more advanced topics:

- Check the [API Reference](./04-API-REFERENCE.md)
- Browse the [official examples](https://www.blocknotejs.org/examples)
- Join the [Discord community](https://discord.gg/Qc2QTTH5dF)
- Read the [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md)

---

**Version**: 0.41.1
**Last Updated**: January 2025
