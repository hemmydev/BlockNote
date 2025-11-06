import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
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

// Get your Gemini API key from: https://aistudio.google.com/apikey
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

// Create the Google Generative AI instance with your API key
const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

// Use Gemini 2.0 Flash model (fast and efficient)
// You can also use: "gemini-1.5-pro" or "gemini-1.5-flash"
const model = google("gemini-2.0-flash-exp");

export default function App() {
  // Creates a new editor instance with AI capabilities
  const editor = useCreateBlockNote({
    dictionary: {
      ...en,
      ai: aiEn, // Add default translations for the AI extension
    },
    // Register the AI extension with Gemini
    extensions: [
      createAIExtension({
        // Use ClientSideTransport for direct Gemini API calls
        transport: new ClientSideTransport({
          model,
        }),
      }),
    ],
    // Initial content for the editor
    initialContent: [
      {
        type: "heading",
        props: {
          level: 1,
        },
        content: "Welcome to BlockNote with Gemini AI",
      },
      {
        type: "paragraph",
        content:
          "This editor is powered by Google's Gemini AI. Try these features:",
      },
      {
        type: "bulletListItem",
        content: [
          {
            type: "text",
            text: "Select text and click the ",
            styles: {},
          },
          {
            type: "text",
            text: "AI button",
            styles: { bold: true },
          },
          {
            type: "text",
            text: " in the toolbar",
            styles: {},
          },
        ],
      },
      {
        type: "bulletListItem",
        content: [
          {
            type: "text",
            text: "Type ",
            styles: {},
          },
          {
            type: "text",
            text: "/ai",
            styles: { code: true },
          },
          {
            type: "text",
            text: " to open the AI menu",
            styles: {},
          },
        ],
      },
      {
        type: "bulletListItem",
        content: [
          {
            type: "text",
            text: "Use AI commands like: ",
            styles: {},
          },
          {
            type: "text",
            text: "Improve writing, Fix spelling, Make shorter, Make longer, Simplify",
            styles: { italic: true },
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "heading",
        props: {
          level: 2,
        },
        content: "Try it out!",
      },
      {
        type: "paragraph",
        content:
          "Select this text and ask the AI to improve it, or type your own content below and experiment with different AI commands.",
      },
    ],
  });

  // Show warning if API key is not set
  if (!GEMINI_API_KEY) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h1>⚠️ Gemini API Key Required</h1>
        <p>
          To use this example, you need to set up your Gemini API key:
        </p>
        <ol>
          <li>
            Get your free API key from:{" "}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://aistudio.google.com/apikey
            </a>
          </li>
          <li>
            Create a <code>.env</code> file in the example directory
          </li>
          <li>
            Add your API key: <code>VITE_GEMINI_API_KEY=your_api_key_here</code>
          </li>
          <li>Restart the dev server</li>
        </ol>
        <p>
          See the <strong>README.md</strong> for detailed instructions.
        </p>
      </div>
    );
  }

  // Render the editor with AI features
  return (
    <div>
      <BlockNoteView
        editor={editor}
        // Disable default UI elements to replace them with AI-enabled versions
        formattingToolbar={false}
        slashMenu={false}
        style={{ paddingBottom: "300px" }}
      >
        {/* Add the AI Command menu that appears when using AI features */}
        <AIMenuController />

        {/* Custom formatting toolbar with AI button */}
        <FormattingToolbarWithAI />

        {/* Custom slash menu with AI options */}
        <SuggestionMenuWithAI editor={editor} />
      </BlockNoteView>
    </div>
  );
}

// Formatting toolbar with the AI button added
function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {getFormattingToolbarItems()}
          {/* Add the AI button to the toolbar */}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

// Slash menu with AI options added
function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor<any, any, any>;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query: string) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            // Add default AI slash menu items (/ai, AI commands)
            ...getAISlashMenuItems(props.editor),
          ],
          query,
        )
      }
    />
  );
}
