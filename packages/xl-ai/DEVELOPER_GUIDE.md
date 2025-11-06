# XL-AI Package Developer Guide

## Table of Contents

- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
- [Design Patterns](#design-patterns)
- [Complete Workflow](#complete-workflow)
- [API Reference](#api-reference)
- [Integration with Vercel AI SDK](#integration-with-vercel-ai-sdk)
- [Document Formats](#document-formats)
- [Advanced Topics](#advanced-topics)
- [Development Considerations](#development-considerations)

---

## Introduction

The `@blocknote/xl-ai` package provides AI-powered editing capabilities for BlockNote editors. It enables Large Language Models (LLMs) to read and modify BlockNote documents in real-time with streaming support, collaborative editing features, and undo/redo capabilities.

### Key Features

- **Streaming AI Operations**: Real-time document updates as the LLM generates responses
- **Multiple Document Formats**: HTML, JSON, and Markdown representations for LLM communication
- **Suggestion Mode**: Track changes with accept/reject capabilities
- **Agent Cursor**: Visual representation of AI editing operations
- **Vercel AI SDK Integration**: Built on top of the Vercel AI SDK for transport flexibility
- **Collaborative Editing Support**: Works with BlockNote's Y.js collaboration features

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AIExtension                             │
│  - State Management (Zustand)                                │
│  - Chat Session Management                                   │
│  - Status Updates (user-input, thinking, ai-writing, etc.)  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ├─────────────────────────────┐
                            │                             │
┌───────────────────────────▼──────┐   ┌─────────────────▼──────────┐
│     AIRequest Builder             │   │  ProseMirror Plugins       │
│  - Build request from editor      │   │  - AgentCursorPlugin       │
│  - Extract selection/document     │   │  - SuggestChanges          │
│  - Create stream tools            │   │  - Transaction filters     │
└───────────────────────────────────┘   └────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│              AIRequestSender                                  │
│  - Convert request to LLM messages (PromptBuilder)           │
│  - Submit to Vercel AI SDK Chat object                       │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│         Vercel AI SDK (Chat object)                          │
│  - Transport layer (HTTP, WebSocket, custom)                 │
│  - Message streaming                                          │
│  - Tool call streaming                                        │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│      Tool Call Streaming Handler                             │
│  - Parse incoming tool calls                                 │
│  - Route to StreamToolExecutor                               │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│         StreamToolExecutor                                    │
│  - Validate operations                                        │
│  - Execute StreamTools (Add, Update, Delete)                 │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│              StreamTools                                      │
│  - Update Block Tool (with rebasing)                         │
│  - Add Blocks Tool                                            │
│  - Delete Blocks Tool                                         │
└───────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│         ProseMirror Document                                  │
│  - Apply changes with suggestion marks                        │
│  - Update agent cursor position                               │
│  - Trigger UI updates                                         │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User initiates AI request** → `AIExtension.invokeAI()`
2. **Build AI Request** → Extract document state, selection, create stream tools
3. **Send to LLM** → Convert to messages via PromptBuilder, submit via Chat object
4. **Stream tool calls** → LLM returns streaming tool calls (Add/Update/Delete operations)
5. **Execute operations** → StreamToolExecutor validates and applies operations to editor
6. **Apply to document** → Operations converted to ProseMirror transactions with suggestion marks
7. **User reviews** → Accept or reject changes

---

## Core Components

### 1. AIExtension

**Location**: `src/AIExtension.ts`

The main extension class that integrates AI capabilities into BlockNote editors.

#### Key Responsibilities

- **State Management**: Uses Zustand to manage AI menu state
- **Chat Session Management**: Maintains conversation history with the LLM
- **Status Tracking**: Monitors AI operation status (user-input, thinking, ai-writing, user-reviewing, error)
- **Document Forking**: Integrates with Y.js collaboration to fork documents during AI operations
- **Change Management**: Provides accept/reject functionality for AI suggestions

#### Public API

```typescript
class AIExtension extends BlockNoteExtension {
  // Open AI menu at a specific block
  openAIMenuAtBlock(blockID: string): void;

  // Close AI menu
  closeAIMenu(): void;

  // Execute AI request
  invokeAI(opts: InvokeAIOptions): Promise<void>;

  // Accept AI changes
  acceptChanges(): void;

  // Reject AI changes
  rejectChanges(): void;

  // Retry failed request
  retry(): Promise<void>;

  // Access state store (read-only)
  readonly store: ReadonlyStoreApi<AIPluginState>;

  // Access options store
  readonly options: StoreApi<AIRequestHelpers>;
}
```

#### State Structure

```typescript
type AIPluginState = {
  aiMenuState:
    | {
        blockId: string; // Current block being edited
        status: "user-input" | "thinking" | "ai-writing" | "user-reviewing";
      }
    | {
        blockId: string;
        status: "error";
        error: any;
      }
    | "closed";
};
```

### 2. AIRequest

**Location**: `src/api/aiRequest/types.ts`

Represents a user request for AI editing operations.

```typescript
type AIRequest = {
  editor: BlockNoteEditor<any, any, any>;
  chat: Chat<UIMessage>; // Vercel AI SDK Chat object
  userPrompt: string;
  selectedBlocks?: Block<any, any, any>[];
  emptyCursorBlockToDelete?: string;
  streamTools: StreamTool<any>[];
};
```

### 3. StreamTool

**Location**: `src/streamTool/streamTool.ts`

A function that can be called by the LLM to modify the document.

```typescript
type StreamTool<T extends { type: string }> = {
  name: T["type"];
  description?: string;
  inputSchema: JSONSchema7; // JSON Schema for LLM
  validate: (operation: DeepPartial<T>) => Result<T>;
  executor: () => {
    execute: (chunk: {
      operation: StreamToolCall<StreamTool<{ type: string }>[]>;
      isUpdateToPreviousOperation: boolean;
      isPossiblyPartial: boolean;
      metadata: any;
    }) => Promise<boolean>;
  };
};
```

**Key Differences from Vercel AI SDK Tools:**

- StreamTools can issue multiple operations in a single tool call
- Designed for streaming execution (partial operations)
- Multiple StreamTools are wrapped into a single LLM tool (`applyDocumentOperations`)

### 4. StreamToolExecutor

**Location**: `src/streamTool/StreamToolExecutor.ts`

Executes StreamToolCalls on the editor.

#### Responsibilities

- **Parsing**: Converts partial JSON strings to validated operations
- **Validation**: Uses StreamTool.validate to ensure operation correctness
- **Execution**: Delegates to StreamTool.executor for applying changes
- **Error Handling**: Wraps errors with context (ChunkExecutionError)

#### Usage

```typescript
const executor = new StreamToolExecutor(streamTools);

// Accept JSON strings or Operation objects
await executor.execute(asyncIterableOfOperations);

// Or write to the writable stream
const writer = executor.writable.getWriter();
await writer.write(operationJSON);
await writer.close();
await executor.finish();
```

### 5. PromptBuilder

**Location**: `src/api/formats/PromptBuilder.ts`

Converts BlockNote documents and user prompts into LLM messages.

```typescript
type PromptBuilder<E> = (
  messages: UIMessage[],
  inputData: E,
) => Promise<void>;

type PromptInputDataBuilder<E> = (aiRequest: AIRequest) => Promise<E>;
```

**Design Pattern**: Separates data extraction (client-side) from prompt building (can run server-side).

---

## Design Patterns

### 1. State Management Pattern

**Pattern**: External Store with Zustand

The AIExtension uses Zustand for state management with a clear separation between internal and external APIs:

```typescript
// Internal store with full access
private readonly _store = createStore<AIPluginState>()((_set) => ({
  aiMenuState: "closed",
}));

// External read-only store
public get store() {
  return this._store as ReadonlyStoreApi<AIPluginState>;
}
```

**Benefits**:
- Immutable external API prevents accidental state mutations
- React components can subscribe to state changes
- Clear separation of concerns

### 2. Tool Factory Pattern

**Location**: `src/api/formats/base-tools/`

Base tool factories create StreamTools with configurable behavior:

```typescript
function createUpdateBlockTool<T>(config: {
  description: string;
  schema: JSONSchema7 | ((editor) => JSONSchema7);
  validateBlock: (block, editor, fallbackType) => Result<T>;
  rebaseTool: (id, editor) => Promise<RebaseTool>;
  toJSONToolCall: (editor, chunk) => Promise<UpdateBlockToolCall<PartialBlock>>;
})
```

**Benefits**:
- Reusable tool creation logic
- Format-specific implementations (HTML, JSON, Markdown)
- Consistent validation and execution patterns

### 3. Rebasing Pattern

**Location**: `src/prosemirror/rebaseTool.ts`

Operations are applied to a "projected" document, then rebased to the actual document.

```typescript
type RebaseTool = {
  doc: Node; // Projected document
  invertMap: Mapping; // Maps projected positions to actual positions
};
```

**Use Cases**:
- Apply operations without suggestion marks to a document with suggestions
- Apply operations from formats that don't support all Block features (e.g., Markdown)

**Workflow**:
1. Create projection of document (e.g., apply all suggestions)
2. Generate operations on projected document
3. Map operations back to actual document using invertMap

### 4. Agent Step Pattern

**Location**: `src/prosemirror/agent.ts`

LLM changes are broken down into human-like editing steps:

```typescript
type AgentStep = {
  prosemirrorSteps: Step[];
  selection: { anchor: number; head: number } | undefined;
  type: "select" | "replace" | "insert";
};
```

**Workflow**:
1. **Select**: Show selection of text to be modified
2. **Replace**: Replace with first character of new content
3. **Insert**: Type remaining characters one by one

**Benefits**:
- Natural, human-like editing animation
- Visual feedback via agent cursor
- Configurable delays for realistic typing speed

### 5. Stream Pipeline Pattern

Multiple transform streams are chained together:

```typescript
// 1. Parse partial JSON
JSONStream
  // 2. Validate operations
  .pipeThrough(ValidationTransform)
  // 3. Filter for new/updated operations
  .pipeThrough(FilterTransform)
  // 4. Execute operations
  .pipeThrough(ExecutorTransform)
```

**Benefits**:
- Composable, testable transformations
- Backpressure handling
- Error propagation

### 6. Transport Abstraction Pattern

The AIExtension doesn't directly call LLMs; it uses Vercel AI SDK's transport pattern:

```typescript
const chat = new Chat<UIMessage>({
  transport: customTransport || defaultTransport,
});
```

**Benefits**:
- Flexible backend implementation (HTTP, WebSocket, server-side)
- Easy to mock for testing
- Supports different authentication strategies

---

## Complete Workflow

### Workflow 1: User Initiates AI Request

#### Step 1: User Action

```typescript
// User opens AI menu
aiExtension.openAIMenuAtBlock(blockId);

// User submits prompt
await aiExtension.invokeAI({
  userPrompt: "Translate this paragraph to French",
  useSelection: true,
});
```

#### Step 2: Build AIRequest

**File**: `src/api/aiRequest/execute.ts` → `buildAIRequest()`

```typescript
// Extract cursor position or selection
const cursorBlock = useSelection
  ? undefined
  : editor.getTextCursorPosition().block;

// Determine if empty cursor block should be deleted
const emptyCursorBlockToDelete =
  cursorBlock && isEmptyParagraph(cursorBlock)
    ? cursorBlock.id
    : undefined;

// Get selection info
const selectionInfo = useSelection
  ? editor.getSelectionCutBlocks()
  : undefined;

// Create stream tools for this request
const streamTools = streamToolsProvider.getStreamTools(
  editor,
  selectionInfo ? { from: startPos, to: endPos } : undefined,
  onBlockUpdated,
);

return {
  editor,
  chat,
  userPrompt,
  selectedBlocks: selectionInfo?.blocks,
  streamTools,
  emptyCursorBlockToDelete,
};
```

#### Step 3: Send to LLM

**File**: `src/api/aiRequest/defaultAIRequestSender.ts`

```typescript
async sendAIRequest(aiRequest, options) {
  // 1. Build prompt data (extract document state)
  const promptData = await promptInputDataBuilder(aiRequest);

  // 2. Update chat messages with prompt
  await promptBuilder(aiRequest.chat.messages, promptData);

  // 3. Submit to LLM
  return aiRequest.chat.sendMessage(undefined, {
    ...options,
    body: {
      ...options?.body,
      toolDefinitions: {
        applyDocumentOperations: {
          name: "applyDocumentOperations",
          inputSchema: createStreamToolsArraySchema(aiRequest.streamTools),
          outputSchema: { type: "object" },
        },
      },
    },
  });
}
```

#### Step 4: Stream Tool Calls

**File**: `src/streamTool/vercelAiSdk/util/chatHandlers.ts` → `setupToolCallStreaming()`

```typescript
// Listen for new messages
chat["~registerMessagesCallback"](() => {
  processToolCallParts(chat, (data) => {
    if (!toolCallStreams.has(data.toolCallId)) {
      // Create new stream for this tool call
      const toolCallStreamData = createToolCallStream(
        streamTools,
        data.toolName,
        data.toolCallId,
      );
      // Pipe to executor
      appendableStream.append(toolCallStreamData.operationsStream);
      toolCallStreams.set(data.toolCallId, toolCallStreamData);
    }
    return toolCallStreams.get(data.toolCallId);
  });
});
```

#### Step 5: Execute Operations

**File**: `src/streamTool/StreamToolExecutor.ts`

For each streaming chunk:

1. **Parse**: Convert partial JSON to operation object
2. **Validate**: Use StreamTool.validate()
3. **Execute**: Call StreamTool.executor().execute()

Example for Update tool:

```typescript
async execute(chunk) {
  if (chunk.operation.type !== "update") return false;

  const operation = chunk.operation;

  // Create rebase tool (project document)
  const tool = await rebaseTool(operation.id, editor);

  // Convert to JSON tool call
  const jsonToolCall = await toJSONToolCall(editor, chunk);

  // Generate replace steps
  const steps = updateToReplaceSteps(
    jsonToolCall,
    tool.doc,
    chunk.isPossiblyPartial,
  );

  // Map steps to actual document
  const inverted = steps.map((step) => step.map(tool.invertMap));

  // Convert to agent steps (select, replace, insert)
  const agentSteps = getStepsAsAgent(tr);

  // Apply with delays for animation
  for (const step of agentSteps) {
    if (withDelays) await delayAgentStep(step);
    editor.transact((tr) => applyAgentStep(tr, step));
  }

  return true;
}
```

#### Step 6: Apply to Document

**File**: `src/prosemirror/agent.ts` → `applyAgentStep()`

```typescript
function applyAgentStep(tr: Transaction, step: AgentStep) {
  // Don't add to undo history
  tr.setMeta("addToHistory", false);

  // Update agent cursor position
  if (step.selection) {
    tr.setMeta("aiAgent", {
      selection: {
        anchor: step.selection.anchor,
        head: step.selection.head,
      },
    });
  }

  // Apply ProseMirror steps
  for (const pmStep of step.prosemirrorSteps) {
    tr.maybeStep(pmStep);
  }

  return tr;
}
```

#### Step 7: User Reviews Changes

```typescript
// Accept changes
aiExtension.acceptChanges();
// - Captures marked-up document
// - Reverts suggestions (back to original)
// - Creates intermediate state with diff
// - Applies suggestions to get final state
// - Merges with Y.js document if collaborative

// Or reject changes
aiExtension.rejectChanges();
// - Reverts suggestions without adding to history
// - Discards changes in Y.js document if collaborative
```

### Workflow 2: Prompt Building (HTML Format)

**File**: `src/api/formats/html-blocks/defaultHTMLPromptBuilder.ts`

#### For Full Document (No Selection)

```typescript
const promptData = {
  selection: false,
  htmlBlocks: [
    { id: "block1$", block: "<p>Hello world</p>" },
    { cursor: true }, // Cursor position marker
    { id: "block2$", block: "<h1>Title</h1>" },
  ],
  isEmptyDocument: false,
  userPrompt: "Add a paragraph below the cursor",
};

// Builds messages:
[
  {
    role: "system",
    content: "You are an AI writing assistant...",
  },
  {
    role: "user",
    content: `
Document (HTML blocks with IDs):
${JSON.stringify(promptData.htmlBlocks)}

User request: ${promptData.userPrompt}
    `,
  },
]
```

#### For Selection

```typescript
const promptData = {
  selection: true,
  htmlSelectedBlocks: [
    { id: "block1$", block: "<p>Selected text</p>" },
  ],
  htmlDocument: [
    { block: "<p>Selected text</p>" },
    { block: "<p>Other content</p>" },
  ], // IDs stripped so LLM can't modify non-selected blocks
  userPrompt: "Make this bold",
};
```

---

## API Reference

### AIExtension Methods

#### `openAIMenuAtBlock(blockID: string): void`

Opens the AI menu at the specified block.

**Side Effects**:
- Sets `editor.isEditable = false`
- Sets `forceSelectionVisible = true`
- Scrolls block into view

#### `invokeAI(opts: InvokeAIOptions): Promise<void>`

Executes an AI request.

**Parameters**:
```typescript
type InvokeAIOptions = {
  userPrompt: string;
  useSelection?: boolean; // Default: false
  deleteEmptyCursorBlock?: boolean; // Default: true
  transport?: ChatTransport<UIMessage>;
  streamToolsProvider?: StreamToolsProvider<any, any>;
  chatRequestOptions?: ChatRequestOptions;
  aiRequestSender?: AIRequestSender;
};
```

**Workflow**:
1. Set status to "thinking"
2. Fork Y.js document (if collaborative)
3. Create or reuse chat session
4. Build AIRequest
5. Execute request via AIRequestSender
6. Set status to "user-reviewing" on success or "error" on failure

#### `acceptChanges(): void`

Accepts AI-generated changes and merges them into the document.

**Implementation Details**:
- Captures marked-up document state
- Reverts suggestions to original state
- Creates intermediate state with diff
- Applies suggestions to reach final state
- Merges with Y.js document if collaborative

#### `rejectChanges(): void`

Rejects AI-generated changes and restores original document.

**Implementation Details**:
- Reverts suggestions without adding to undo history
- Discards forked Y.js document if collaborative
- Closes AI menu

#### `retry(): Promise<void>`

Retries the previous AI request after an error.

**Behavior**:
- If chat.status === "error": Network error, retry entire request
- Otherwise: Tool execution error, ask LLM to fix it

### createAIExtension

Factory function to create AIExtension instances.

```typescript
function createAIExtension(options: {
  transport?: ChatTransport<UIMessage>;
  streamToolsProvider?: StreamToolsProvider<any, any>;
  chatRequestOptions?: ChatRequestOptions;
  aiRequestSender?: AIRequestSender;
  agentCursor?: { name: string; color: string };
}): (editor: BlockNoteEditor) => AIExtension;
```

**Usage**:
```typescript
const editor = BlockNoteEditor.create({
  extensions: [
    createAIExtension({
      transport: customTransport,
      agentCursor: { name: "AI Assistant", color: "#ff6b6b" },
    }),
  ],
});
```

### Document Format APIs

#### HTML Blocks Format

```typescript
import { aiDocumentFormats } from "@blocknote/xl-ai";

// Get stream tools provider
const provider = aiDocumentFormats.html.getStreamToolsProvider({
  withDelays: true,
  defaultStreamTools: { add: true, update: true, delete: false },
});

// Get default prompt builder
const promptBuilder = aiDocumentFormats.html.defaultPromptBuilder;
const promptInputDataBuilder = aiDocumentFormats.html.defaultPromptInputDataBuilder;
```

#### JSON Format (Experimental)

```typescript
const provider = aiDocumentFormats._experimental_json.getStreamToolsProvider();
```

#### Markdown Format (Experimental)

```typescript
const provider = aiDocumentFormats._experimental_markdown.getStreamToolsProvider();
```

---

## Integration with Vercel AI SDK

### Chat Object

The AIExtension uses the `Chat` object from `@ai-sdk/react`:

```typescript
import { Chat } from "@ai-sdk/react";
import { UIMessage } from "ai";

const chat = new Chat<UIMessage>({
  sendAutomaticallyWhen: () => false, // Manual message sending
  transport: customTransport,
});
```

#### Key Properties

- **`messages: UIMessage[]`**: Message history
- **`status`**: "idle" | "submitted" | "streaming" | "ready" | "error"
- **`error`**: Error object if status === "error"
- **`lastMessage`**: Most recent message (contains streaming tool calls)

#### Key Methods

- **`sendMessage(text?, options?)`**: Submit request to LLM
- **`addToolResult(result)`**: Add tool execution results to history

### Transport Layer

The transport handles communication with the LLM backend:

```typescript
type ChatTransport<UIMessage> = {
  sendMessage(options: {
    messages: UIMessage[];
    toolDefinitions?: Record<string, ToolDefinition>;
    headers?: Record<string, string>;
    body?: Record<string, any>;
  }): Promise<void>;
};
```

**Default Transport** (from Vercel AI SDK):
```typescript
import { DefaultChatTransport } from "ai";

const transport = new DefaultChatTransport({
  api: "/api/chat",
});
```

**Custom Server-Side Transport**:
```typescript
import { createCustomChatTransport } from "@blocknote/xl-ai";

const transport = createCustomChatTransport({
  llmClient: openai("gpt-4"),
  systemPrompt: "You are a helpful writing assistant...",
});
```

### Tool Definitions

The `applyDocumentOperations` tool wraps all StreamTools:

```typescript
{
  toolDefinitions: {
    applyDocumentOperations: {
      name: "applyDocumentOperations",
      inputSchema: {
        type: "object",
        properties: {
          operations: {
            type: "array",
            items: {
              oneOf: [
                // Update tool schema
                {
                  type: "object",
                  properties: {
                    type: { const: "update" },
                    id: { type: "string" },
                    block: { /* HTML block schema */ },
                  },
                },
                // Add tool schema
                {
                  type: "object",
                  properties: {
                    type: { const: "add" },
                    position: { /* ... */ },
                    blocks: { type: "array" },
                  },
                },
                // Delete tool schema
                {
                  type: "object",
                  properties: {
                    type: { const: "delete" },
                    ids: { type: "array", items: { type: "string" } },
                  },
                },
              ],
            },
          },
        },
      },
      outputSchema: { type: "object" },
    },
  },
}
```

### Streaming Tool Calls

The AI SDK streams tool calls as they're generated:

```typescript
chat.lastMessage?.parts.forEach((part) => {
  if (part.type === "tool-applyDocumentOperations") {
    if (part.state === "input-streaming") {
      // Partial input
      const partialInput = part.input;
    } else if (part.state === "input-available") {
      // Complete input
      const fullInput = part.input;
    }
  }
});
```

The xl-ai package handles this streaming via `setupToolCallStreaming()` in `chatHandlers.ts`.

---

## Document Formats

### 1. HTML Blocks Format

**Best for**: Most use cases, preserves all BlockNote features

**Location**: `src/api/formats/html-blocks/`

#### Data Structure

```typescript
type HTMLBlock = {
  id: string; // Suffixed with "$"
  block: string; // HTML representation
};

type CursorMarker = { cursor: true };

type HTMLPromptData = {
  selection: false;
  htmlBlocks: (HTMLBlock | CursorMarker)[];
  isEmptyDocument: boolean;
  userPrompt: string;
} | {
  selection: true;
  htmlSelectedBlocks: HTMLBlock[];
  htmlDocument: { block: string }[]; // No IDs
  userPrompt: string;
};
```

#### Tools

- **Update**: `tools.update(editor, options)`
  - Updates block content/properties
  - Uses rebasing to handle suggestion marks
  - Converts HTML to BlockNote format

- **Add**: `tools.add(editor, options)`
  - Inserts new blocks at specified position
  - Supports relative positioning (before, after, nested)

- **Delete**: `tools.delete(editor, options)`
  - Removes blocks by ID

#### Example LLM Response

```json
{
  "operations": [
    {
      "type": "update",
      "id": "block1$",
      "block": "<p><strong>Bold text</strong></p>"
    },
    {
      "type": "add",
      "position": { "after": "block1$" },
      "blocks": [
        "<p>New paragraph</p>",
        "<h2>Heading</h2>"
      ]
    }
  ]
}
```

### 2. JSON Format (Experimental)

**Best for**: Preserving exact BlockNote structure, custom blocks

**Location**: `src/api/formats/json/`

#### Data Structure

```typescript
type JSONBlock = {
  id: string;
  block: PartialBlock<any, any, any>; // BlockNote JSON format
};
```

#### Benefits

- No lossy conversions
- Supports all custom block types
- Preserves all block properties

#### Drawbacks

- More verbose for LLMs
- May confuse LLMs unfamiliar with BlockNote schema

### 3. Markdown Blocks Format (Experimental)

**Best for**: LLMs that excel with Markdown, content-focused editing

**Location**: `src/api/formats/markdown-blocks/`

#### Data Structure

```typescript
type MarkdownBlock = {
  id: string;
  block: string; // Markdown representation
};
```

#### Benefits

- Familiar format for most LLMs
- Concise representation

#### Drawbacks

- Lossy conversion (loses some block properties)
- Limited support for custom blocks

---

## Advanced Topics

### 1. Custom Document Formats

You can create custom formats by implementing:

1. **PromptBuilder**: Converts AIRequest to LLM messages
2. **PromptInputDataBuilder**: Extracts data from editor
3. **StreamTools**: Add, Update, Delete operations for your format

**Example**: Create a custom format that represents blocks as YAML

```typescript
// 1. Define data structure
type YAMLPromptData = {
  yamlBlocks: { id: string; block: string }[];
  userPrompt: string;
};

// 2. Create PromptInputDataBuilder
async function yamlPromptInputDataBuilder(
  aiRequest: AIRequest
): Promise<YAMLPromptData> {
  const blocks = await convertBlocks(
    flattenBlocks(aiRequest.editor.document),
    async (block) => {
      // Convert block to YAML
      return yaml.stringify(block);
    }
  );

  return {
    yamlBlocks: suffixIDs(blocks),
    userPrompt: aiRequest.userPrompt,
  };
}

// 3. Create PromptBuilder
async function yamlPromptBuilder(
  messages: UIMessage[],
  inputData: YAMLPromptData
): Promise<void> {
  messages.push({
    role: "system",
    content: "You are an AI assistant. Blocks are represented as YAML...",
  });

  messages.push({
    role: "user",
    content: `
Document:
${inputData.yamlBlocks.map(b => b.block).join("\n---\n")}

User request: ${inputData.userPrompt}
    `,
  });
}

// 4. Create StreamTools (reuse base tools with YAML conversion)
function createYAMLTools(editor: BlockNoteEditor) {
  return [
    createUpdateBlockTool({
      // ... implement YAML-specific validation and conversion
    })(editor, options),
  ];
}

// 5. Use custom format
const aiExtension = createAIExtension({
  aiRequestSender: defaultAIRequestSender(
    yamlPromptBuilder,
    yamlPromptInputDataBuilder
  ),
  streamToolsProvider: {
    getStreamTools: (editor) => createYAMLTools(editor),
  },
});
```

### 2. Custom Transports

Implement custom backend logic by creating a transport:

```typescript
import { ChatTransport } from "ai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const serverSideTransport: ChatTransport<UIMessage> = {
  async sendMessage({ messages, toolDefinitions, body }) {
    // Server-side LLM call
    const result = await streamText({
      model: openai("gpt-4"),
      messages,
      tools: {
        applyDocumentOperations: {
          description: "Apply operations to the document",
          parameters: toolDefinitions.applyDocumentOperations.inputSchema,
          execute: async (params) => {
            // Tool execution handled client-side, return empty result
            return {};
          },
        },
      },
      temperature: body?.temperature ?? 0.7,
    });

    // Stream results back to client
    // (Implementation depends on your framework)
  },
};
```

### 3. Collaborative Editing Integration

The AIExtension integrates with BlockNote's Y.js collaboration:

```typescript
// When AI starts editing
await aiExtension.invokeAI({
  userPrompt: "...",
});
// → Calls editor.forkYDocPlugin?.fork()
// Creates a separate Y.js document branch

// When user accepts changes
aiExtension.acceptChanges();
// → Calls editor.forkYDocPlugin?.merge({ keepChanges: true })
// Merges AI changes back to main document

// When user rejects changes
aiExtension.rejectChanges();
// → Calls editor.forkYDocPlugin?.merge({ keepChanges: false })
// Discards AI changes
```

### 4. Custom Stream Tools

Create custom StreamTools for domain-specific operations:

```typescript
const customTool = streamTool<{
  type: "highlight";
  blockId: string;
  color: string;
}>({
  name: "highlight",
  description: "Highlight a block with a color",
  inputSchema: {
    type: "object",
    properties: {
      type: { const: "highlight" },
      blockId: { type: "string" },
      color: { type: "string", enum: ["yellow", "green", "blue"] },
    },
    required: ["type", "blockId", "color"],
  },
  validate: (operation) => {
    // Validate operation
    if (operation.type !== "highlight") {
      return { ok: false, error: "Invalid type" };
    }
    // ... more validation
    return { ok: true, value: operation };
  },
  executor: () => ({
    execute: async (chunk) => {
      if (chunk.operation.type !== "highlight") return false;

      const { blockId, color } = chunk.operation;
      const block = editor.getBlock(blockId);

      if (block) {
        editor.updateBlock(blockId, {
          props: { backgroundColor: color },
        });
      }

      return true;
    },
  }),
});

// Use custom tool
const aiExtension = createAIExtension({
  streamToolsProvider: {
    getStreamTools: (editor) => [
      ...htmlBlockLLMFormat.tools.add(editor, options),
      ...htmlBlockLLMFormat.tools.update(editor, options),
      customTool,
    ],
  },
});
```

### 5. Error Handling

The AIExtension provides several error handling mechanisms:

#### Network Errors

```typescript
// Captured in chat.error
aiExtension.store.subscribe((state) => {
  if (state.aiMenuState !== "closed" && state.aiMenuState.status === "error") {
    console.error("AI error:", state.aiMenuState.error);
  }
});

// Retry
await aiExtension.retry();
```

#### Tool Execution Errors

```typescript
// Wrapped in ChunkExecutionError
class ChunkExecutionError extends Error {
  constructor(
    message: string,
    public readonly chunk: any,
    options?: { cause?: unknown }
  ) {
    super(message, options);
  }
}
```

#### Validation Errors

```typescript
// Returned by StreamTool.validate()
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
```

---

## Development Considerations

### 1. Testing

#### Unit Tests

- **Location**: `*.test.ts` files throughout the codebase
- **Framework**: Vitest
- **Mocking**: MSW (Mock Service Worker) for HTTP requests

**Example**: Testing HTML tools
```typescript
// packages/xl-ai/src/api/formats/html-blocks/htmlBlocks.test.ts
describe("HTML Blocks Format", () => {
  it("should update block content", async () => {
    const editor = createTestEditor();
    const operation = {
      type: "update",
      id: "block1",
      block: "<p>New content</p>",
    };

    await executor.executeOne(operation);

    expect(editor.getBlock("block1").content).toBe("New content");
  });
});
```

#### Snapshot Tests

- **Location**: `__snapshots__/__msw_snapshots__/`
- **Purpose**: Verify LLM responses remain consistent

```typescript
// Run tests with MSW recording
NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem" vitest
```

### 2. Performance Considerations

#### Streaming Chunk Size

```typescript
// In createUpdateBlockTool
const STEP_SIZE = 50; // Characters

// Only execute when operation grows by STEP_SIZE
if (chunk.isPossiblyPartial) {
  const size = JSON.stringify(operation.block).length;
  if (size < minSize) {
    return true; // Skip this chunk
  }
  minSize = size + STEP_SIZE;
}
```

**Trade-off**: Smaller chunks = smoother animation, more processing overhead

#### Delay Configuration

```typescript
// In agent.ts
async function delayAgentStep(step: AgentStep) {
  const jitter = Math.random() * 0.3 + 0.85;
  if (step.type === "select") {
    await new Promise((resolve) => setTimeout(resolve, 100 * jitter));
  } else if (step.type === "insert") {
    await new Promise((resolve) => setTimeout(resolve, 10 * jitter));
  } else if (step.type === "replace") {
    await new Promise((resolve) => setTimeout(resolve, 200 * jitter));
  }
}

// Disable delays for testing
const provider = aiDocumentFormats.html.getStreamToolsProvider({
  withDelays: false,
});
```

#### Rebasing Cost

Creating a RebaseTool involves cloning the document:

```typescript
// Expensive: Creates new ProseMirror document
const tool = await rebaseTool(blockId, editor);
```

**Optimization**: Reuse RebaseTool across operations when possible (currently not implemented).

### 3. Debugging

#### Enable Logging

```typescript
// In AIExtension.invokeAI()
console.warn("Error calling LLM", e, this.chatSession?.chat.messages);

// In StreamToolExecutor
console.error("BLOCK NOT FOUND", id);
```

#### Inspect State

```typescript
// Subscribe to state changes
const unsubscribe = aiExtension.store.subscribe((state) => {
  console.log("AI State:", state);
});

// Check chat messages
console.log(aiExtension.chatSession?.chat.messages);
```

#### View ProseMirror State

```typescript
// Inspect suggestion marks
editor.prosemirrorState.doc.nodesBetween(0, doc.size, (node, pos) => {
  if (node.marks.some(m => m.type.name === "insertion")) {
    console.log("Insertion at", pos, node.textContent);
  }
});
```

### 4. Common Pitfalls

#### 1. Transaction Filtering

**Issue**: The `fixTablesKey` plugin can invalidate AI operations.

**Solution**: AIExtension filters out fixTables transactions during AI writing:

```typescript
filterTransaction: (tr) => {
  const menuState = this.store.getState().aiMenuState;
  if (menuState !== "closed" && menuState.status === "ai-writing") {
    if (tr.getMeta(fixTablesKey)?.fixTables) {
      return false; // Block fixTables during AI writing
    }
  }
  return true;
}
```

#### 2. Undo History

**Issue**: AI operations should not be individually undoable.

**Solution**: Set `addToHistory: false` for agent steps:

```typescript
tr.setMeta("addToHistory", false);
```

#### 3. Scroll Behavior

**Issue**: User scrolling conflicts with auto-scroll to AI cursor.

**Solution**: Track scroll state to disable auto-scroll when user scrolls:

```typescript
document.addEventListener("scroll", () => {
  if (this.scrollInProgress) {
    this.autoScroll = false; // User scrolled manually
  }
  this.scrollInProgress = true;
}, true);
```

#### 4. Partial Operations

**Issue**: LLM may stream incomplete JSON.

**Solution**: Use `parsePartialJson()` from Vercel AI SDK:

```typescript
const parsed = await parsePartialJson(chunk);

if (parsed.state === "repaired-parse") {
  // Partial JSON, mark as incomplete
  return { operation, isPossiblyPartial: true };
}
```

### 5. Type Safety

The package uses TypeScript extensively:

```typescript
// Conditional types for StreamTools
type StreamToolsResult<TT, T extends StreamToolsConfig> = [
  ...(T extends { update: true } ? [UpdateTool<TT>] : []),
  ...(T extends { add: true } ? [AddTool<TT>] : []),
  ...(T extends { delete: true } ? [DeleteTool] : []),
];

// Usage
const tools: StreamToolsResult<string, { add: true; update: true }> = [
  updateTool,
  addTool,
  // deleteTool // Type error: not included
];
```

### 6. Future Improvements

#### Planned Features

- **Batch Rebasing**: Reuse RebaseTool across operations
- **Custom Agent Animations**: Configurable delays and selection behavior
- **More Document Formats**: LaTeX, Rich Text, etc.
- **Improved Error Recovery**: Automatic retry with error context

#### Known Limitations

- **Table Editing**: Limited support during AI writing (due to transaction filtering)
- **Collaboration**: Y.js merging is all-or-nothing (no partial accepts)
- **Custom Blocks**: May not be fully supported in HTML/Markdown formats

---

## Conclusion

The `@blocknote/xl-ai` package provides a robust, extensible architecture for AI-powered document editing. Key strengths include:

- **Flexible Format System**: Support for HTML, JSON, and Markdown with easy custom formats
- **Streaming Architecture**: Real-time updates via StreamTools and Vercel AI SDK
- **Visual Feedback**: Agent cursor and suggestion marks for user review
- **Collaboration Support**: Integration with Y.js for multi-user editing
- **Type Safety**: Comprehensive TypeScript types throughout

For questions or contributions, please refer to the [BlockNote documentation](https://www.blocknotejs.org/) or [GitHub repository](https://github.com/TypeCellOS/BlockNote).
