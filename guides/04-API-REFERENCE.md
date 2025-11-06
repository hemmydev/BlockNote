# BlockNote API Reference

Complete API reference for BlockNote editor functionality.

## Table of Contents

1. [Editor Creation](#editor-creation)
2. [Block Manipulation API](#block-manipulation-api)
3. [Inline Content API](#inline-content-api)
4. [Selection and Cursor API](#selection-and-cursor-api)
5. [Styling API](#styling-api)
6. [Event Handlers](#event-handlers)
7. [Schema API](#schema-api)
8. [React Components](#react-components)
9. [Import/Export API](#importexport-api)
10. [Collaboration API](#collaboration-api)

---

## Editor Creation

### useCreateBlockNote

React hook for creating a BlockNote editor instance.

```typescript
function useCreateBlockNote(
  options?: BlockNoteEditorOptions,
  deps?: React.DependencyList
): BlockNoteEditor
```

**Parameters:**

- `options` (optional): Editor configuration options
- `deps` (optional): React dependency array to control recreation

**Returns:** `BlockNoteEditor` instance

**Example:**

```tsx
const editor = useCreateBlockNote({
  initialContent: [
    {
      type: "paragraph",
      content: "Hello, world!",
    },
  ],
  schema: customSchema,
  uploadFile: async (file) => {
    // Upload logic
    return fileUrl;
  },
});
```

### BlockNoteEditor.create

Static method for manually creating an editor (non-React).

```typescript
static create(options?: BlockNoteEditorOptions): BlockNoteEditor
```

**Parameters:**

- `options` (optional): Editor configuration options

**Returns:** `BlockNoteEditor` instance

**Example:**

```typescript
const editor = BlockNoteEditor.create({
  initialContent: [],
  schema: customSchema,
});
```

### BlockNoteEditorOptions

Configuration options for editor creation.

```typescript
interface BlockNoteEditorOptions {
  // Initial document content
  initialContent?: PartialBlock[];

  // Custom schema
  schema?: BlockNoteSchema;

  // File upload handler
  uploadFile?: (file: File) => Promise<string>;

  // Collaboration options
  collaboration?: {
    provider: any; // Yjs provider
    fragment: any; // Y.XmlFragment
    user: {
      name: string;
      color: string;
    };
  };

  // Localization dictionary
  dictionary?: Dictionary;

  // Custom paste handler
  pasteHandler?: (editor: BlockNoteEditor, clipboardData: ClipboardData) => void;

  // Extensions
  extensions?: Extension[];

  // DOM attributes
  domAttributes?: Record<string, any>;

  // Placeholder text
  placeholder?: string;

  // Editable state
  editable?: boolean;
}
```

---

## Block Manipulation API

### Reading Blocks

#### editor.document

Get all top-level blocks in the document.

```typescript
readonly document: Block[]
```

**Example:**

```typescript
const allBlocks = editor.document;
console.log(`Total blocks: ${allBlocks.length}`);
```

#### editor.getBlock

Get a specific block by ID or reference.

```typescript
getBlock(blockIdentifier: BlockIdentifier): Block | undefined
```

**Parameters:**

- `blockIdentifier`: Block ID (string) or Block object

**Returns:** The block if found, otherwise `undefined`

**Example:**

```typescript
const block = editor.getBlock("block-id-123");
if (block) {
  console.log(`Block type: ${block.type}`);
}
```

#### editor.getPrevBlock

Get the block immediately before the specified block.

```typescript
getPrevBlock(blockIdentifier: BlockIdentifier): Block | undefined
```

**Parameters:**

- `blockIdentifier`: Block ID or Block object

**Returns:** The previous block if it exists

**Example:**

```typescript
const prevBlock = editor.getPrevBlock("current-block-id");
```

#### editor.getNextBlock

Get the block immediately after the specified block.

```typescript
getNextBlock(blockIdentifier: BlockIdentifier): Block | undefined
```

**Parameters:**

- `blockIdentifier`: Block ID or Block object

**Returns:** The next block if it exists

**Example:**

```typescript
const nextBlock = editor.getNextBlock("current-block-id");
```

#### editor.getParentBlock

Get the parent block of a nested block.

```typescript
getParentBlock(blockIdentifier: BlockIdentifier): Block | undefined
```

**Parameters:**

- `blockIdentifier`: Block ID or Block object

**Returns:** The parent block if the block is nested

**Example:**

```typescript
const parentBlock = editor.getParentBlock("nested-block-id");
```

#### editor.forEachBlock

Iterate through all blocks in the document (depth-first).

```typescript
forEachBlock(
  callback: (block: Block) => boolean | void,
  reverse?: boolean
): void
```

**Parameters:**

- `callback`: Function called for each block. Return `false` to stop iteration
- `reverse`: If true, iterate in reverse order

**Example:**

```typescript
// Find all headings
const headings: Block[] = [];
editor.forEachBlock((block) => {
  if (block.type === "heading") {
    headings.push(block);
  }
  return true; // Continue iteration
});
```

### Creating Blocks

#### editor.insertBlocks

Insert blocks relative to an existing block.

```typescript
insertBlocks(
  blocksToInsert: PartialBlock[],
  referenceBlock: BlockIdentifier,
  placement?: "before" | "after"
): void
```

**Parameters:**

- `blocksToInsert`: Array of blocks to insert
- `referenceBlock`: Reference block for insertion
- `placement`: Where to insert relative to reference block (default: "before")

**Example:**

```typescript
// Insert a new paragraph after the first block
editor.insertBlocks(
  [
    {
      type: "paragraph",
      content: "New paragraph",
    },
  ],
  editor.document[0],
  "after"
);

// Insert multiple blocks
editor.insertBlocks(
  [
    {
      type: "heading",
      props: { level: 2 },
      content: "New Section",
    },
    {
      type: "paragraph",
      content: "Section content",
    },
  ],
  "reference-block-id",
  "after"
);
```

### Updating Blocks

#### editor.updateBlock

Update an existing block's content, type, or properties.

```typescript
updateBlock(
  blockToUpdate: BlockIdentifier,
  update: PartialBlock
): void
```

**Parameters:**

- `blockToUpdate`: Block ID or Block object
- `update`: Partial block with updates to apply

**Example:**

```typescript
// Change block content
editor.updateBlock("block-id", {
  content: "Updated content",
});

// Change block type
editor.updateBlock("block-id", {
  type: "heading",
  props: { level: 2 },
});

// Update properties
editor.updateBlock("block-id", {
  props: {
    textColor: "blue",
    textAlignment: "center",
  },
});
```

### Removing Blocks

#### editor.removeBlocks

Remove one or more blocks from the document.

```typescript
removeBlocks(blocksToRemove: BlockIdentifier[]): void
```

**Parameters:**

- `blocksToRemove`: Array of block IDs or Block objects

**Example:**

```typescript
// Remove a single block
editor.removeBlocks(["block-id"]);

// Remove multiple blocks
editor.removeBlocks(["block-1", "block-2", "block-3"]);

// Remove first block
editor.removeBlocks([editor.document[0]]);
```

### Replacing Blocks

#### editor.replaceBlocks

Replace existing blocks with new blocks.

```typescript
replaceBlocks(
  blocksToRemove: BlockIdentifier[],
  blocksToInsert: PartialBlock[]
): void
```

**Parameters:**

- `blocksToRemove`: Array of blocks to remove
- `blocksToInsert`: Array of blocks to insert in their place

**Example:**

```typescript
// Replace a paragraph with a heading
editor.replaceBlocks(
  ["paragraph-block-id"],
  [
    {
      type: "heading",
      props: { level: 1 },
      content: "New Heading",
    },
  ]
);

// Replace multiple blocks with a single block
editor.replaceBlocks(
  ["block-1", "block-2", "block-3"],
  [
    {
      type: "paragraph",
      content: "Merged content",
    },
  ]
);
```

### Moving and Nesting Blocks

#### editor.moveBlocksUp

Move selected blocks up in the document.

```typescript
moveBlocksUp(): void
```

**Example:**

```typescript
editor.moveBlocksUp();
```

#### editor.moveBlocksDown

Move selected blocks down in the document.

```typescript
moveBlocksDown(): void
```

**Example:**

```typescript
editor.moveBlocksDown();
```

#### editor.canNestBlock

Check if the current block can be nested (indented).

```typescript
canNestBlock(): boolean
```

**Returns:** `true` if the block can be nested

**Example:**

```typescript
if (editor.canNestBlock()) {
  console.log("Block can be nested");
}
```

#### editor.nestBlock

Nest (indent) the current block.

```typescript
nestBlock(): void
```

**Example:**

```typescript
if (editor.canNestBlock()) {
  editor.nestBlock();
}
```

#### editor.canUnnestBlock

Check if the current block can be unnested (outdented).

```typescript
canUnnestBlock(): boolean
```

**Returns:** `true` if the block can be unnested

**Example:**

```typescript
if (editor.canUnnestBlock()) {
  console.log("Block can be unnested");
}
```

#### editor.unnestBlock

Unnest (outdent) the current block.

```typescript
unnestBlock(): void
```

**Example:**

```typescript
if (editor.canUnnestBlock()) {
  editor.unnestBlock();
}
```

---

## Inline Content API

### Inserting Content

#### editor.insertInlineContent

Insert inline content at the cursor position or replace selection.

```typescript
insertInlineContent(
  content: PartialInlineContent,
  options?: { updateSelection?: boolean }
): void
```

**Parameters:**

- `content`: Content to insert (string or array of inline content)
- `options`: Optional configuration
  - `updateSelection`: Whether to update cursor position after insert

**Example:**

```typescript
// Insert plain text
editor.insertInlineContent("Hello, world!");

// Insert styled text
editor.insertInlineContent([
  {
    type: "text",
    text: "Bold text",
    styles: { bold: true },
  },
]);

// Insert link
editor.insertInlineContent([
  {
    type: "link",
    content: "BlockNote",
    href: "https://blocknotejs.org",
  },
]);

// Insert mixed content
editor.insertInlineContent([
  "Visit ",
  {
    type: "link",
    content: [
      { type: "text", text: "our ", styles: {} },
      { type: "text", text: "website", styles: { bold: true } },
    ],
    href: "https://blocknotejs.org",
  },
  " for more info.",
]);
```

### Reading Content

#### editor.getSelectedText

Get the currently selected text as a plain string.

```typescript
getSelectedText(): string
```

**Returns:** Selected text

**Example:**

```typescript
const selectedText = editor.getSelectedText();
console.log("Selection:", selectedText);

// Copy to clipboard
if (selectedText) {
  navigator.clipboard.writeText(selectedText);
}
```

#### editor.getActiveStyles

Get the active text styles at the cursor or end of selection.

```typescript
getActiveStyles(): Styles
```

**Returns:** Object containing active styles

**Example:**

```typescript
const styles = editor.getActiveStyles();

if (styles.bold) {
  console.log("Text is bold");
}

if (styles.textColor) {
  console.log("Text color:", styles.textColor);
}

// Check all active styles
console.log("Active styles:", styles);
```

#### editor.getSelectedLinkUrl

Get the URL of the selected link, if any.

```typescript
getSelectedLinkUrl(): string | undefined
```

**Returns:** Link URL or `undefined`

**Example:**

```typescript
const linkUrl = editor.getSelectedLinkUrl();

if (linkUrl) {
  console.log("Link URL:", linkUrl);
  window.open(linkUrl, "_blank");
} else {
  console.log("No link selected");
}
```

---

## Selection and Cursor API

### Getting Selection

#### editor.getTextCursorPosition

Get the current text cursor position.

```typescript
getTextCursorPosition(): TextCursorPosition
```

**Returns:** Object containing cursor position information

```typescript
interface TextCursorPosition {
  block: Block;
  prevBlock: Block | undefined;
  nextBlock: Block | undefined;
}
```

**Example:**

```typescript
const position = editor.getTextCursorPosition();
console.log("Current block:", position.block.type);

if (position.nextBlock) {
  console.log("Next block:", position.nextBlock.type);
}
```

#### editor.getSelection

Get the current block selection.

```typescript
getSelection(): BlockSelection | undefined
```

**Returns:** Current selection or `undefined`

**Example:**

```typescript
const selection = editor.getSelection();

if (selection) {
  console.log("Selected blocks:", selection.blocks.length);
}
```

### Setting Selection

#### editor.setTextCursorPosition

Set the text cursor position to a specific location.

```typescript
setTextCursorPosition(
  blockIdentifier: BlockIdentifier,
  placement?: "start" | "end"
): void
```

**Parameters:**

- `blockIdentifier`: Block to place cursor in
- `placement`: Where to place cursor (default: "end")

**Example:**

```typescript
// Place cursor at end of block
editor.setTextCursorPosition("block-id", "end");

// Place cursor at start of block
editor.setTextCursorPosition("block-id", "start");

// Place cursor at end of first block
editor.setTextCursorPosition(editor.document[0]);
```

#### editor.focus

Focus the editor.

```typescript
focus(): void
```

**Example:**

```typescript
editor.focus();
```

---

## Styling API

### Text Styles

#### editor.addStyles

Add styles to the currently selected text.

```typescript
addStyles(styles: Styles): void
```

**Parameters:**

- `styles`: Object containing styles to add

**Example:**

```typescript
// Make text bold
editor.addStyles({ bold: true });

// Make text bold and red
editor.addStyles({
  bold: true,
  textColor: "red",
});

// Add multiple styles
editor.addStyles({
  bold: true,
  italic: true,
  underline: true,
  backgroundColor: "yellow",
});
```

#### editor.removeStyles

Remove styles from the currently selected text.

```typescript
removeStyles(styles: Styles): void
```

**Parameters:**

- `styles`: Object containing styles to remove

**Example:**

```typescript
// Remove bold
editor.removeStyles({ bold: true });

// Remove multiple styles
editor.removeStyles({
  bold: true,
  italic: true,
  textColor: "red",
});
```

#### editor.toggleStyles

Toggle styles on the currently selected text.

```typescript
toggleStyles(styles: Styles): void
```

**Parameters:**

- `styles`: Object containing styles to toggle

**Example:**

```typescript
// Toggle bold
editor.toggleStyles({ bold: true });

// Toggle multiple styles
editor.toggleStyles({
  bold: true,
  italic: true,
});

// Create custom toggle button
function HighlightButton() {
  return (
    <button onClick={() => editor.toggleStyles({ backgroundColor: "yellow" })}>
      Highlight
    </button>
  );
}
```

### Links

#### editor.createLink

Create a link from the selected text.

```typescript
createLink(url: string, text?: string): void
```

**Parameters:**

- `url`: Link URL (empty string removes link)
- `text`: Link text (optional, uses selection if omitted)

**Example:**

```typescript
// Create link from selected text
editor.createLink("https://blocknotejs.org");

// Create link with custom text
editor.createLink("https://blocknotejs.org", "BlockNote");

// Remove link
editor.createLink("");
```

### Available Styles

```typescript
interface Styles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
}
```

**Predefined Colors:**

- default
- gray
- brown
- red
- orange
- yellow
- green
- blue
- purple
- pink

**Custom Colors:**

```typescript
editor.addStyles({
  textColor: "#ff5733",
  backgroundColor: "#e0e0e0",
});
```

---

## Event Handlers

### onChange

Called when the document content changes.

```typescript
onChange?: () => void
```

**Example:**

```tsx
<BlockNoteView
  editor={editor}
  onChange={() => {
    console.log("Document changed");
    console.log("New content:", editor.document);
  }}
/>
```

### onSelectionChange

Called when the text selection changes.

```typescript
onSelectionChange?: () => void
```

**Example:**

```tsx
<BlockNoteView
  editor={editor}
  onSelectionChange={() => {
    const selection = editor.getSelection();
    console.log("Selection changed:", selection);
  }}
/>
```

### Custom Event Listeners

```typescript
// Listen to specific editor events
editor._tiptapEditor.on("update", () => {
  console.log("Content updated");
});

editor._tiptapEditor.on("selectionUpdate", () => {
  console.log("Selection updated");
});

editor._tiptapEditor.on("focus", () => {
  console.log("Editor focused");
});

editor._tiptapEditor.on("blur", () => {
  console.log("Editor blurred");
});
```

---

## Schema API

### BlockNoteSchema.create

Create a custom schema for the editor.

```typescript
static create(options?: SchemaOptions): BlockNoteSchema
```

**Parameters:**

- `options`: Schema configuration

```typescript
interface SchemaOptions {
  blockSpecs?: Record<string, BlockSpec>;
  inlineContentSpecs?: Record<string, InlineContentSpec>;
  styleSpecs?: Record<string, StyleSpec>;
}
```

**Example:**

```typescript
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";

// Create default schema
const defaultSchema = BlockNoteSchema.create();

// Create custom schema
const customSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    alert: AlertBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mention: MentionInlineContent,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
    fontSize: createStyleSpec({
      type: "fontSize",
      propSchema: "string",
    }),
  },
});
```

### Extending Schema

```typescript
// Extend existing schema
const extendedSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    alert: AlertBlock,
  },
});
```

### Creating Block Specs

```typescript
import { createReactBlockSpec } from "@blocknote/react";

const CustomBlock = createReactBlockSpec(
  {
    type: "customBlock",
    propSchema: {
      // Define block properties
      variant: {
        default: "default",
        values: ["default", "primary", "secondary"],
      },
      title: {
        default: "",
      },
    },
    content: "inline", // "inline", "none", or "table"
  },
  {
    render: (props) => {
      return (
        <div className={`custom-block custom-block-${props.block.props.variant}`}>
          <h3>{props.block.props.title}</h3>
          <InlineContent />
        </div>
      );
    },
  }
);
```

---

## React Components

### BlockNoteView

Main React component for rendering the editor.

```typescript
interface BlockNoteViewProps {
  editor: BlockNoteEditor;
  editable?: boolean;
  theme?: "light" | "dark";
  formattingToolbar?: boolean;
  linkToolbar?: boolean;
  sideMenu?: boolean;
  slashMenu?: boolean;
  filePanel?: boolean;
  tableHandles?: boolean;
  onChange?: () => void;
  onSelectionChange?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

**Example:**

```tsx
<BlockNoteView
  editor={editor}
  theme="light"
  editable={true}
  formattingToolbar={true}
  linkToolbar={true}
  sideMenu={true}
  slashMenu={true}
  onChange={() => console.log("Changed")}
  onSelectionChange={() => console.log("Selection changed")}
  className="my-editor"
  style={{ padding: "20px" }}
/>
```

### FormattingToolbarController

Controller for custom formatting toolbar.

```typescript
interface FormattingToolbarControllerProps {
  formattingToolbar: () => React.ReactElement;
}
```

**Example:**

```tsx
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
      </FormattingToolbar>
    )}
  />
</BlockNoteView>;
```

### SuggestionMenuController

Controller for custom slash/suggestion menus.

```typescript
interface SuggestionMenuControllerProps {
  triggerCharacter: string;
  getItems: (query: string) => Promise<SuggestionItem[]> | SuggestionItem[];
}
```

**Example:**

```tsx
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
        title: "Custom Item",
        onItemClick: () => {
          editor.insertBlocks([{ type: "customBlock" }], editor.getTextCursorPosition().block, "after");
        },
        aliases: ["custom", "special"],
        group: "Custom",
      },
    ];

    return [...defaultItems, ...customItems].filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }}
/>;
```

### UI Components

```typescript
import {
  // Toolbar components
  FormattingToolbar,
  BlockTypeSelect,
  BasicTextStyleButton,
  ColorStyleButton,
  CreateLinkButton,
  TextAlignButton,
  NestBlockButton,
  UnnestBlockButton,

  // File components
  FileCaptionButton,
  FileReplaceButton,

  // Controllers
  FormattingToolbarController,
  LinkToolbarController,
  SideMenuController,
  SuggestionMenuController,
} from "@blocknote/react";
```

---

## Import/Export API

### HTML Export

```typescript
import { blocksToHTMLLossy } from "@blocknote/core";

async function exportToHTML(
  blocks: Block[],
  schema: BlockNoteSchema
): Promise<string>
```

**Example:**

```typescript
const html = await blocksToHTMLLossy(editor.document, editor.schema);
console.log(html);

// Download HTML
const blob = new Blob([html], { type: "text/html" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "document.html";
a.click();
```

### HTML Import

```typescript
import { HTMLToBlocks } from "@blocknote/core";

async function importFromHTML(
  html: string,
  schema: BlockNoteSchema,
  editor: BlockNoteEditor
): Promise<Block[]>
```

**Example:**

```typescript
const html = "<h1>Hello</h1><p>World</p>";
const blocks = await HTMLToBlocks(html, editor.schema, editor);

editor.replaceBlocks(editor.document, blocks);
```

### Markdown Export

```typescript
import { blocksToMarkdownLossy } from "@blocknote/core";

async function exportToMarkdown(
  blocks: Block[],
  schema: BlockNoteSchema
): Promise<string>
```

**Example:**

```typescript
const markdown = await blocksToMarkdownLossy(editor.document, editor.schema);
console.log(markdown);
```

### Markdown Import

```typescript
import { markdownToBlocks } from "@blocknote/core";

async function importFromMarkdown(
  markdown: string,
  schema: BlockNoteSchema,
  editor: BlockNoteEditor
): Promise<Block[]>
```

**Example:**

```typescript
const markdown = "# Hello\n\nWorld";
const blocks = await markdownToBlocks(markdown, editor.schema, editor);

editor.replaceBlocks(editor.document, blocks);
```

### PDF Export

```typescript
import { blocksToPDF } from "@blocknote/xl-pdf-exporter";

async function exportToPDF(
  blocks: Block[],
  schema: BlockNoteSchema
): Promise<Blob>
```

**Example:**

```typescript
const pdfBlob = await blocksToPDF(editor.document, editor.schema);

// Download PDF
const url = URL.createObjectURL(pdfBlob);
const a = document.createElement("a");
a.href = url;
a.download = "document.pdf";
a.click();
URL.revokeObjectURL(url);
```

### DOCX Export

```typescript
import { blocksToDOCX } from "@blocknote/xl-docx-exporter";

async function exportToDOCX(
  blocks: Block[],
  schema: BlockNoteSchema
): Promise<Blob>
```

**Example:**

```typescript
const docxBlob = await blocksToDOCX(editor.document, editor.schema);

// Download DOCX
const url = URL.createObjectURL(docxBlob);
const a = document.createElement("a");
a.href = url;
a.download = "document.docx";
a.click();
URL.revokeObjectURL(url);
```

---

## Collaboration API

### Setting Up Collaboration

```typescript
import * as Y from "yjs";
import YPartyKitProvider from "y-partykit/provider";

const doc = new Y.Doc();
const provider = new YPartyKitProvider("host", "room-id", doc);

const editor = useCreateBlockNote({
  collaboration: {
    provider: provider,
    fragment: doc.getXmlFragment("document-store"),
    user: {
      name: "John Doe",
      color: "#ff0000",
    },
  },
});
```

### Collaboration Options

```typescript
interface CollaborationOptions {
  // Yjs provider for syncing
  provider: any;

  // Y.XmlFragment for storing document
  fragment: any;

  // Current user info
  user: {
    name: string;
    color: string;
  };
}
```

### Provider Examples

**PartyKit:**

```typescript
import YPartyKitProvider from "y-partykit/provider";
import * as Y from "yjs";

const doc = new Y.Doc();
const provider = new YPartyKitProvider("your-host.partykit.dev", "room-id", doc);
```

**Liveblocks:**

```typescript
import { createClient } from "@liveblocks/client";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import * as Y from "yjs";

const client = createClient({ publicApiKey: "pk_..." });
const room = client.enter("room-id");
const doc = new Y.Doc();
const provider = new LiveblocksYjsProvider(room, doc);
```

**WebSocket (y-websocket):**

```typescript
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

const doc = new Y.Doc();
const provider = new WebsocketProvider("ws://localhost:1234", "room-id", doc);
```

---

## Type Definitions

### Block

```typescript
interface Block {
  id: string;
  type: string;
  props: Record<string, any>;
  content: InlineContent[] | TableContent | undefined;
  children: Block[];
}
```

### PartialBlock

```typescript
interface PartialBlock {
  id?: string;
  type?: string;
  props?: Partial<Record<string, any>>;
  content?: string | InlineContent[] | TableContent;
  children?: PartialBlock[];
}
```

### InlineContent

```typescript
type InlineContent = StyledText | Link | CustomInlineContent;

interface StyledText {
  type: "text";
  text: string;
  styles: Styles;
}

interface Link {
  type: "link";
  content: StyledText[];
  href: string;
}
```

### Styles

```typescript
interface Styles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textColor?: string;
  backgroundColor?: string;
}
```

### TableContent

```typescript
interface TableContent {
  type: "tableContent";
  rows: {
    cells: InlineContent[][];
  }[];
}
```

---

## Utility Functions

### filterSuggestionItems

Filter suggestion items based on query.

```typescript
import { filterSuggestionItems } from "@blocknote/core";

const items = [
  { title: "Heading", aliases: ["h1", "title"] },
  { title: "Paragraph", aliases: ["p", "text"] },
];

const filtered = filterSuggestionItems(items, "head");
// Returns items matching "head"
```

### getDefaultReactSlashMenuItems

Get default slash menu items.

```typescript
import { getDefaultReactSlashMenuItems } from "@blocknote/react";

const items = getDefaultReactSlashMenuItems(editor);
```

### getFormattingToolbarItems

Get default formatting toolbar items.

```typescript
import { getFormattingToolbarItems } from "@blocknote/react";

const items = getFormattingToolbarItems();
```

---

## Additional Resources

- **Official Documentation**: https://www.blocknotejs.org/docs
- **API Documentation**: https://www.blocknotejs.org/docs/reference
- **GitHub**: https://github.com/TypeCellOS/BlockNote
- **Examples**: https://www.blocknotejs.org/examples
- **Discord**: https://discord.gg/Qc2QTTH5dF

---

**Version**: 0.41.1
**Last Updated**: January 2025
