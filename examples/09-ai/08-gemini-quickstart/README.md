# Gemini AI Editor - Quick Start Guide

A complete, ready-to-use AI-powered editor using Google's Gemini AI with BlockNote.

## What This Example Demonstrates

This example shows you how to build a full-featured AI editor with:
- **AI-powered text editing** (improve writing, fix spelling, change tone)
- **AI commands via slash menu** (type `/ai` for AI options)
- **AI toolbar button** (select text and click AI button)
- **Google Gemini integration** (using the fast Gemini 2.0 Flash model)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A free Google Gemini API key

## Quick Start (5 minutes)

### Step 1: Get Your Gemini API Key (1 minute)

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (it starts with `AI...`)

> **Note**: Gemini offers a generous free tier with no credit card required!

### Step 2: Install Dependencies (2 minutes)

From the BlockNote repository root, navigate to this example:

```bash
cd examples/09-ai/08-gemini-quickstart
npm install
```

### Step 3: Configure Your API Key (1 minute)

Create a `.env` file in this directory (`examples/09-ai/08-gemini-quickstart/.env`):

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the API key you copied in Step 1.

**Example:**
```bash
VITE_GEMINI_API_KEY=AIzaSyC-AbCdEfGhIjKlMnOpQrStUvWxYz12345
```

### Step 4: Start the Editor (1 minute)

```bash
npm start
```

The editor will open at `http://localhost:5173` (or another port if 5173 is busy).

## How to Use the AI Features

Once the editor is running, try these AI features:

### Method 1: AI Toolbar Button
1. **Select any text** in the editor
2. Click the **AI button** (sparkle icon) in the toolbar
3. Choose an AI command:
   - **Improve writing** - Enhance clarity and flow
   - **Fix spelling & grammar** - Correct errors
   - **Make shorter** - Create a concise version
   - **Make longer** - Expand with more detail
   - **Simplify** - Use simpler language
   - **Change tone** - Adjust formality/style

### Method 2: Slash Menu
1. Type **`/ai`** anywhere in the editor
2. Select an AI command from the menu
3. The AI will process the current block

### Method 3: Custom Prompts
1. Select text and click the AI button
2. Choose **"Custom prompt"**
3. Type your own instruction (e.g., "translate to Spanish", "add examples")
4. Press Enter

## Features Included

✅ **Full BlockNote editor** - Rich text, headings, lists, and more
✅ **Gemini 2.0 Flash** - Fast, high-quality AI responses
✅ **Client-side integration** - Direct API calls, no backend needed
✅ **Pre-built AI commands** - Improve, fix, shorten, lengthen, simplify
✅ **Custom prompts** - Ask the AI to do anything
✅ **Selection-based editing** - AI modifies selected text in place
✅ **Streaming responses** - See AI output in real-time

## Customization

### Using a Different Gemini Model

Edit `src/App.tsx` and change the model:

```typescript
// Use Gemini 1.5 Pro (more capable, slower)
const model = google("gemini-1.5-pro");

// Use Gemini 1.5 Flash (balanced)
const model = google("gemini-1.5-flash");

// Use Gemini 2.0 Flash (fastest, default)
const model = google("gemini-2.0-flash-exp");
```

### Adding Custom AI Commands

You can add your own AI commands to the menu. See the BlockNote documentation for details:
[Custom AI Menu Items](https://www.blocknotejs.org/docs/ai/custom-menu-items)

### Environment Variables

The example uses Vite's environment variable system:

- **Development**: Create `.env` file with `VITE_GEMINI_API_KEY=...`
- **Production**: Set the `VITE_GEMINI_API_KEY` environment variable in your deployment platform

## Troubleshooting

### "Gemini API Key Required" Warning

**Problem**: The editor shows a warning instead of loading.

**Solution**:
1. Make sure you created the `.env` file in `examples/09-ai/08-gemini-quickstart/`
2. Verify the file contains `VITE_GEMINI_API_KEY=your_key`
3. Restart the dev server (`npm start`)

### API Key Not Working

**Problem**: AI features don't work or show errors.

**Solutions**:
1. **Check your API key**: Visit [Google AI Studio](https://aistudio.google.com/apikey) and verify it's active
2. **Check API quota**: Free tier has rate limits (15 requests/minute)
3. **Check browser console**: Look for error messages
4. **Verify .env format**: No quotes, no spaces around `=`

### CORS or Network Errors

**Problem**: Browser shows CORS or network errors.

**Solution**: This example uses **client-side API calls**, which work directly from the browser. Make sure:
1. You're using a valid Gemini API key
2. Your browser has internet access
3. No browser extensions are blocking requests

### Port Already in Use

**Problem**: `npm start` fails because port is busy.

**Solution**: Vite will automatically try the next available port. Check the terminal output for the actual URL.

## Building for Production

To create a production build:

```bash
npm run build:prod
```

The built files will be in the `dist/` folder.

**Important for Production**:
- Never commit your `.env` file to version control
- Set `VITE_GEMINI_API_KEY` as an environment variable in your hosting platform
- Consider using a backend proxy to secure your API key (see [Client-Side Transport example](../06-client-side-transport))

## Architecture

This example uses:
- **BlockNote** - Rich text editor framework
- **@blocknote/xl-ai** - AI extension for BlockNote
- **Vercel AI SDK** - Unified AI interface (`ai` package)
- **@ai-sdk/google** - Google Gemini provider
- **ClientSideTransport** - Direct browser-to-Gemini communication

```
User → BlockNote Editor → AI Extension → Vercel AI SDK → Gemini API
```

## Next Steps

- **Explore other AI examples**: See `examples/09-ai/` for more patterns
- **Add a backend**: Use [Server Prompt Builder](../07-server-promptbuilder) for better security
- **Customize AI prompts**: Modify the system prompts for different behavior
- **Add more features**: Check the [BlockNote docs](https://www.blocknotejs.org) for collaboration, custom blocks, and more

## Cost and Rate Limits

**Gemini Free Tier**:
- ✅ No credit card required
- ✅ 15 requests per minute
- ✅ 1,500 requests per day
- ✅ 1 million tokens per month

For higher limits, see [Gemini pricing](https://ai.google.dev/pricing).

## Resources

- [BlockNote Documentation](https://www.blocknotejs.org)
- [BlockNote AI Extension Docs](https://www.blocknotejs.org/docs/ai)
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)

## Support

- Issues: [BlockNote GitHub Issues](https://github.com/TypeCellOS/BlockNote/issues)
- Discussions: [BlockNote Discussions](https://github.com/TypeCellOS/BlockNote/discussions)

---

**That's it!** You now have a complete AI editor powered by Gemini. 🎉
