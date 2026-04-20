# Commands to Run the AI PDF Chatbot Project

## ⚠️ Important Notes

1. **This project uses Yarn, not npm** (it's a monorepo with workspaces)
2. **Windows Path Issue**: The folder path contains spaces ("final year"), which causes a bug in `langgraph-cli` on Windows. See workarounds below.

## Setup Commands

### 1. Install Dependencies (from root directory)
```powershell
cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain"
yarn install
```

### 2. Set Up Environment Variables

**Backend (.env):**
```powershell
# Copy example file
cp backend\.env.example backend\.env

# Edit backend\.env and add:
# OPENAI_API_KEY=your-openai-api-key-here
# SUPABASE_URL=your-supabase-url-here
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

**Frontend (.env):**
```powershell
# Copy example file
cp frontend\.env.example frontend\.env

# Edit frontend\.env and add:
# NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024
```

## Running the Project

### Option 1: Using Yarn (Recommended)

**Start Backend (LangGraph Server):**
```powershell
cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain\backend"
yarn langgraph:dev
```

**Start Frontend (in a new terminal):**
```powershell
cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain\frontend"
yarn dev
```

### Option 2: Workaround for Windows Path Issue

If you encounter the path error with `langgraph:dev`, try:

**Method A: Use npm with explicit path**
```powershell
cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain\backend"
npx --yes @langchain/langgraph-cli@latest dev --config langgraph.json
```

**Method B: Run from root with workspace prefix**
```powershell
cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain"
yarn workspace backend langgraph:dev
```

**Method C: Create a symlink/junction to a path without spaces** (Advanced)
```powershell
# Create a junction to avoid spaces in path
mklink /J "C:\projects\ai-pdf-chatbot" "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain"
# Then run from: C:\projects\ai-pdf-chatbot\backend
```

## Available Scripts

### Backend Scripts:
- `yarn langgraph:dev` - Start LangGraph development server
- `yarn demo` - Run demo script (requires server running)
- `yarn build` - Build TypeScript
- `yarn test` - Run tests

### Frontend Scripts:
- `yarn dev` - Start Next.js development server
- `yarn build` - Build for production
- `yarn start` - Start production server

## Troubleshooting

### Error: "ENOENT: no such file or directory" with malformed path
**Cause**: Windows path with spaces causing langgraph-cli bug  
**Solution**: Use one of the workarounds above (Method A, B, or C)

### Error: "ECONNREFUSED" when running demo
**Cause**: LangGraph server not running  
**Solution**: Start the server first with `yarn langgraph:dev`

### Error: Missing dependencies
**Cause**: Dependencies not installed  
**Solution**: Run `yarn install` from the root directory

### Error: ChunkLoadError / "Loading chunk app/layout failed" / 404 on \_next/static/chunks
**Cause**: Stale or corrupted Next.js build cache (`.next`), often on Windows or OneDrive.  
**Solution**:
1. Stop the frontend dev server (Ctrl+C).
2. Delete the cache and restart:
   ```powershell
   cd "C:\Users\asus\OneDrive\Documents\final year\ai-pdf-chatbot-langchain\frontend"
   Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
   yarn dev
   ```
3. In the browser: hard refresh (Ctrl+Shift+R) or open http://localhost:3000 in a new incognito/private window.

