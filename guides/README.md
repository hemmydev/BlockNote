# BlockNote Editor Guides and Tutorials

Comprehensive documentation for using BlockNote, the open-source block-based React rich text editor.

## 📚 Overview

This collection of guides provides everything you need to effectively use BlockNote in your projects, from basic setup to advanced customization and integration.

## 📖 Guide Structure

### 1. [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md)
**Start here for a complete overview of BlockNote**

The comprehensive guide covers:
- Introduction to BlockNote and its architecture
- Complete feature reference
- All block types and their usage
- Core concepts and document structure
- Advanced topics (custom blocks, collaboration, AI integration)
- Best practices for performance, security, and accessibility
- Code examples for all major features

**Best for:** Understanding the full scope of BlockNote's capabilities

---

### 2. [Installation and Setup Guide](./02-INSTALLATION-AND-SETUP.md)
**Step-by-step setup instructions for any framework**

Detailed installation guide covering:
- System requirements and prerequisites
- Installation methods (Mantine, shadcn/ui, Ariakit)
- Framework-specific setup:
  - Create React App
  - Next.js (App Router & Pages Router)
  - Vite + React
  - Remix
  - Gatsby
- UI package selection and comparison
- Project configuration (TypeScript, Webpack, Vite, Tailwind)
- Common issues and solutions
- Environment variables setup

**Best for:** Getting BlockNote running in your project quickly

---

### 3. [Tutorials - Common Use Cases](./03-TUTORIALS.md)
**Practical, step-by-step tutorials for real-world scenarios**

Ten comprehensive tutorials:

1. **Building a Simple Note-Taking App**
   - Local storage persistence
   - Auto-save functionality
   - Multi-note management

2. **Creating a Blog Editor with Save/Load**
   - Backend API integration
   - Draft and published states
   - Auto-save with status indicators

3. **Implementing File Uploads with S3**
   - AWS S3 integration
   - Presigned URLs
   - Upload progress tracking

4. **Adding Real-Time Collaboration**
   - PartyKit setup
   - Liveblocks integration
   - Multi-user editing with presence

5. **Creating Custom Blocks**
   - Custom Alert block example
   - Block properties and styling
   - Adding to slash menu

6. **Customizing the UI**
   - Custom formatting toolbar
   - Custom buttons
   - Theme customization

7. **Building a Documentation Editor**
   - Table of contents generation
   - Code syntax highlighting
   - Markdown export

8. **Integrating AI Features**
   - OpenAI and Google Gemini setup
   - AI toolbar button
   - Custom AI commands

9. **Implementing Export Functionality**
   - Export to PDF, DOCX, Markdown, HTML
   - Download handlers

10. **Building a Comments System**
    - Inline commenting
    - Comment sidebar
    - Reply and resolve features

**Best for:** Learning through practical examples and building real features

---

### 4. [API Reference](./04-API-REFERENCE.md)
**Complete API documentation for all BlockNote methods**

Comprehensive API reference including:

- **Editor Creation**
  - `useCreateBlockNote` hook
  - `BlockNoteEditor.create` method
  - Editor options and configuration

- **Block Manipulation API**
  - Reading blocks (`document`, `getBlock`, `forEachBlock`)
  - Creating blocks (`insertBlocks`)
  - Updating blocks (`updateBlock`)
  - Removing blocks (`removeBlocks`)
  - Replacing blocks (`replaceBlocks`)
  - Moving and nesting blocks

- **Inline Content API**
  - Inserting content (`insertInlineContent`)
  - Reading content (`getSelectedText`, `getActiveStyles`)
  - Link manipulation

- **Selection and Cursor API**
  - Getting selection (`getTextCursorPosition`, `getSelection`)
  - Setting selection (`setTextCursorPosition`, `focus`)

- **Styling API**
  - Adding, removing, and toggling styles
  - Link creation
  - Available colors and styles

- **Event Handlers**
  - `onChange` and `onSelectionChange`
  - Custom event listeners

- **Schema API**
  - Creating custom schemas
  - Defining block specs
  - Extending schemas

- **React Components**
  - `BlockNoteView`
  - `FormattingToolbarController`
  - `SuggestionMenuController`
  - UI component library

- **Import/Export API**
  - HTML, Markdown, PDF, DOCX conversion
  - Import and export functions

- **Collaboration API**
  - Yjs setup
  - Provider configuration
  - User presence

**Best for:** Quick reference while coding and understanding specific APIs

---

## 🚀 Quick Start

### For Beginners

1. Start with [Installation and Setup Guide](./02-INSTALLATION-AND-SETUP.md)
2. Read the "What is BlockNote?" section in the [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md)
3. Try [Tutorial 1: Building a Simple Note-Taking App](./03-TUTORIALS.md#tutorial-1-building-a-simple-note-taking-app)

### For Experienced Developers

1. Skim the [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md) for features overview
2. Jump to specific [Tutorials](./03-TUTORIALS.md) based on your needs
3. Use the [API Reference](./04-API-REFERENCE.md) as needed

### For Specific Tasks

**Need to...** | **Read...**
---|---
Install BlockNote in Next.js | [Installation Guide - Next.js Setup](./02-INSTALLATION-AND-SETUP.md#nextjs-app-router)
Save/load documents | [Tutorial 2: Blog Editor](./03-TUTORIALS.md#tutorial-2-creating-a-blog-editor-with-saveload)
Upload files to S3 | [Tutorial 3: File Uploads](./03-TUTORIALS.md#tutorial-3-implementing-file-uploads-with-s3)
Add collaboration | [Tutorial 4: Real-Time Collaboration](./03-TUTORIALS.md#tutorial-4-adding-real-time-collaboration)
Create custom blocks | [Tutorial 5: Custom Blocks](./03-TUTORIALS.md#tutorial-5-creating-custom-blocks)
Customize the toolbar | [Tutorial 6: Customizing UI](./03-TUTORIALS.md#tutorial-6-customizing-the-ui)
Integrate AI | [Tutorial 8: AI Integration](./03-TUTORIALS.md#tutorial-8-integrating-ai-features)
Export documents | [Tutorial 9: Export Functionality](./03-TUTORIALS.md#tutorial-9-implementing-export-functionality)
Understand block API | [API Reference - Block Manipulation](./04-API-REFERENCE.md#block-manipulation-api)
Style text programmatically | [API Reference - Styling API](./04-API-REFERENCE.md#styling-api)

---

## 🎯 Learning Paths

### Path 1: Frontend Developer (New to BlockNote)

1. **Week 1: Basics**
   - Read: [Comprehensive Guide - Introduction](./01-COMPREHENSIVE-GUIDE.md#introduction)
   - Follow: [Installation Guide](./02-INSTALLATION-AND-SETUP.md)
   - Build: [Tutorial 1 - Note-Taking App](./03-TUTORIALS.md#tutorial-1-building-a-simple-note-taking-app)

2. **Week 2: Features**
   - Read: [Comprehensive Guide - Core Concepts](./01-COMPREHENSIVE-GUIDE.md#core-concepts)
   - Read: [Comprehensive Guide - Complete Feature Reference](./01-COMPREHENSIVE-GUIDE.md#complete-feature-reference)
   - Build: [Tutorial 6 - Customizing UI](./03-TUTORIALS.md#tutorial-6-customizing-the-ui)

3. **Week 3: Integration**
   - Build: [Tutorial 2 - Blog Editor](./03-TUTORIALS.md#tutorial-2-creating-a-blog-editor-with-saveload)
   - Build: [Tutorial 3 - File Uploads](./03-TUTORIALS.md#tutorial-3-implementing-file-uploads-with-s3)

4. **Week 4: Advanced**
   - Build: [Tutorial 5 - Custom Blocks](./03-TUTORIALS.md#tutorial-5-creating-custom-blocks)
   - Read: [API Reference](./04-API-REFERENCE.md)

### Path 2: Building a Collaborative App

1. **Foundation**
   - [Installation Guide](./02-INSTALLATION-AND-SETUP.md)
   - [Comprehensive Guide - Collaboration Features](./01-COMPREHENSIVE-GUIDE.md#-collaboration-features)

2. **Implementation**
   - [Tutorial 4 - Real-Time Collaboration](./03-TUTORIALS.md#tutorial-4-adding-real-time-collaboration)
   - [Tutorial 10 - Comments System](./03-TUTORIALS.md#tutorial-10-building-a-comments-system)

3. **Reference**
   - [API Reference - Collaboration API](./04-API-REFERENCE.md#collaboration-api)

### Path 3: AI-Powered Editor

1. **Setup**
   - [Installation Guide](./02-INSTALLATION-AND-SETUP.md)
   - [Comprehensive Guide - AI Integration](./01-COMPREHENSIVE-GUIDE.md#ai-integration)

2. **Implementation**
   - [Tutorial 8 - Integrating AI Features](./03-TUTORIALS.md#tutorial-8-integrating-ai-features)

3. **Customization**
   - [Comprehensive Guide - Advanced Topics - AI](./01-COMPREHENSIVE-GUIDE.md#ai-integration)

### Path 4: Documentation Platform

1. **Setup**
   - [Installation Guide](./02-INSTALLATION-AND-SETUP.md)

2. **Features**
   - [Tutorial 7 - Documentation Editor](./03-TUTORIALS.md#tutorial-7-building-a-documentation-editor)
   - [Tutorial 9 - Export Functionality](./03-TUTORIALS.md#tutorial-9-implementing-export-functionality)

3. **Enhancement**
   - [Comprehensive Guide - Theming](./01-COMPREHENSIVE-GUIDE.md#theming)

---

## 💡 Key Concepts

### Block-Based Architecture

BlockNote organizes documents into **blocks** - discrete pieces of content that can be:
- Dragged and reordered
- Nested (indented)
- Individually styled
- Easily manipulated via API

**Example:**
```typescript
{
  id: "abc123",
  type: "paragraph",
  props: { textColor: "blue" },
  content: [{ type: "text", text: "Hello", styles: { bold: true } }],
  children: []
}
```

### Schema System

BlockNote uses **schemas** to define available content types:
- **Block Specs**: Define block types (paragraph, heading, custom blocks)
- **Inline Content Specs**: Define inline elements (links, mentions)
- **Style Specs**: Define text styles (bold, colors, custom styles)

### React Integration

BlockNote provides:
- **Hooks**: `useCreateBlockNote`, `useBlockNoteEditor`
- **Components**: `BlockNoteView`, toolbar controllers
- **UI Packages**: Mantine, shadcn/ui, Ariakit

### Extensibility

Everything in BlockNote can be customized:
- Custom block types
- Custom inline content
- Custom text styles
- Custom UI components
- Custom themes

---

## 🛠️ Common Patterns

### Auto-Save Pattern

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

### Loading Content Pattern

```typescript
const [initialContent, setInitialContent] = useState("loading");

useEffect(() => {
  loadFromBackend().then(setInitialContent);
}, []);

const editor = useMemo(() => {
  if (initialContent === "loading") return undefined;
  return BlockNoteEditor.create({ initialContent });
}, [initialContent]);
```

### File Upload Pattern

```typescript
const editor = useCreateBlockNote({
  uploadFile: async (file) => {
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

### Custom Block Pattern

```typescript
const CustomBlock = createReactBlockSpec(
  {
    type: "customBlock",
    propSchema: { /* properties */ },
    content: "inline",
  },
  {
    render: (props) => (
      <div>
        <InlineContent />
      </div>
    ),
  }
);
```

---

## 📦 Package Overview

### Core Packages (MPL-2.0)

- **@blocknote/core**: Framework-agnostic editor engine
- **@blocknote/react**: React hooks and components
- **@blocknote/mantine**: Mantine UI components
- **@blocknote/shadcn**: shadcn/ui components
- **@blocknote/ariakit**: Ariakit accessible components
- **@blocknote/code-block**: Enhanced code highlighting
- **@blocknote/server-util**: Server-side utilities

### XL Packages (GPL-3.0 or Commercial)

- **@blocknote/xl-ai**: AI integration
- **@blocknote/xl-multi-column**: Multi-column layouts
- **@blocknote/xl-pdf-exporter**: PDF export
- **@blocknote/xl-docx-exporter**: DOCX export
- **@blocknote/xl-odt-exporter**: ODT export
- **@blocknote/xl-email-exporter**: Email HTML export

---

## 🔗 Additional Resources

### Official Resources

- **Documentation**: https://www.blocknotejs.org/docs
- **Examples**: https://www.blocknotejs.org/examples
- **GitHub**: https://github.com/TypeCellOS/BlockNote
- **NPM**: https://www.npmjs.com/package/@blocknote/react

### Community

- **Discord**: https://discord.gg/Qc2QTTH5dF
- **GitHub Issues**: https://github.com/TypeCellOS/BlockNote/issues
- **GitHub Discussions**: https://github.com/TypeCellOS/BlockNote/discussions

### Dependencies

- **ProseMirror**: https://prosemirror.net/
- **Tiptap**: https://tiptap.dev/
- **Yjs** (collaboration): https://docs.yjs.dev/

---

## 📝 Contributing

Found an issue with these guides? Want to improve them?

1. Check existing issues: https://github.com/TypeCellOS/BlockNote/issues
2. Create a new issue or pull request
3. Join the discussion on Discord

---

## ⚖️ License

- **Core packages**: MPL-2.0 - Can be used in commercial applications
- **XL packages**: GPL-3.0 or Commercial License - See https://www.blocknotejs.org/pricing

---

## 🎓 FAQ

### Q: Which UI package should I use?

**A:**
- **Mantine**: Best for quick start and general use
- **shadcn/ui**: Best if already using Tailwind CSS
- **Ariakit**: Best for maximum accessibility
- **Core only**: Best for complete custom UI

### Q: Can I use BlockNote without React?

**A:** BlockNote core is framework-agnostic, but the UI components require React. You can use the core package with vanilla JavaScript and build your own UI.

### Q: How do I deploy BlockNote in production?

**A:** See [Installation Guide - Framework-Specific Setup](./02-INSTALLATION-AND-SETUP.md#framework-specific-setup) for deployment-ready configurations.

### Q: Is BlockNote free for commercial use?

**A:** Core packages (MPL-2.0) are free for commercial use. XL packages require a commercial license for closed-source applications. See https://www.blocknotejs.org/pricing

### Q: How do I add custom blocks?

**A:** See [Tutorial 5: Creating Custom Blocks](./03-TUTORIALS.md#tutorial-5-creating-custom-blocks)

### Q: Can BlockNote handle large documents?

**A:** Yes, but for optimal performance with very large documents, implement debounced auto-save and consider pagination. See [Comprehensive Guide - Best Practices](./01-COMPREHENSIVE-GUIDE.md#best-practices).

### Q: Does BlockNote support mobile?

**A:** Yes, BlockNote works on mobile browsers. See [Comprehensive Guide - Mobile Support](./01-COMPREHENSIVE-GUIDE.md#mobile-support) for mobile-specific features.

---

## 📅 Version Information

- **BlockNote Version**: 0.41.1
- **Guides Last Updated**: January 2025
- **Maintained By**: BlockNote Community

---

## 🌟 Quick Links

| Topic | Link |
|-------|------|
| **Installation** | [Installation Guide](./02-INSTALLATION-AND-SETUP.md) |
| **First Steps** | [Tutorial 1](./03-TUTORIALS.md#tutorial-1-building-a-simple-note-taking-app) |
| **All Features** | [Comprehensive Guide](./01-COMPREHENSIVE-GUIDE.md) |
| **API Docs** | [API Reference](./04-API-REFERENCE.md) |
| **Custom Blocks** | [Tutorial 5](./03-TUTORIALS.md#tutorial-5-creating-custom-blocks) |
| **Collaboration** | [Tutorial 4](./03-TUTORIALS.md#tutorial-4-adding-real-time-collaboration) |
| **AI Integration** | [Tutorial 8](./03-TUTORIALS.md#tutorial-8-integrating-ai-features) |
| **Export** | [Tutorial 9](./03-TUTORIALS.md#tutorial-9-implementing-export-functionality) |

---

**Happy Building with BlockNote! 🎉**

For questions and support, join our [Discord community](https://discord.gg/Qc2QTTH5dF).
