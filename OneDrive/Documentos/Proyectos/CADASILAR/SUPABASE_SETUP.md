# Supabase Setup for CADASILAR

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose organization, name it "CADASILAR"
5. Generate a password
6. Choose region (closest to you)
7. Click "Create new project"

### 2. Get Your Credentials
1. Go to Project Settings → API
2. Copy the following:
   - `Project URL`
   - `anon public` key

### 3. Configure Environment
1. Open `.env.local` in your project
2. Replace the values:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Create Database Table
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click "Run"

### 5. Upload Your CSV Data
**Option A: Dashboard Upload (Easiest)**
1. Go to Table Editor → patients table
2. Click "Insert" → "Import data from CSV"
3. Upload your `RegistroNacionalCADA_DATA_2025-08-17_1634.csv`
4. Map the CSV columns to database columns
5. Click "Import"

**Option B: Manual Import**
1. Open your CSV in Excel/Google Sheets
2. Copy rows one by one
3. Use the "Insert row" button in Supabase

### 6. Test Connection
1. Run your Next.js app: `npm run dev`
2. Dashboard should now load data from Supabase
3. If it fails, it will show sample data as fallback

## Updating Data
- **Manual Sync**: When your CSV changes, re-upload via Supabase dashboard
- **Add New Patients**: Use the "Insert" button in Table Editor
- **Edit Existing**: Click any cell in Table Editor to modify

## Database Features
- ✅ Real-time updates
- ✅ Full CRUD operations  
- ✅ Data validation
- ✅ Automatic timestamps
- ✅ Row-level security (if needed)

## Troubleshooting
- **"Repository not found"**: Check your environment variables
- **Data not loading**: Check browser console for errors
- **Import fails**: Ensure CSV columns match database schema