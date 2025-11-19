#!/usr/bin/env node

/**
 * Database Migration Script
 * Applies the AI Course Generator database schema to Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv/config');

async function applyMigration() {
  console.log('\n🚀 Starting Database Migration...\n');

  // Step 1: Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not configured');
    console.error('   Please add your Supabase project URL to .env.local\n');
    process.exit(1);
  }

  if (!supabaseKey || supabaseKey === 'your_supabase_anon_key') {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
    console.error('   Please add your Supabase anon key to .env.local\n');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   Project: ${supabaseUrl}\n`);

  // Step 2: Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Connected to Supabase\n');

  // Step 3: Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251111_ai_course_generator.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: Migration file not found');
    console.error(`   Expected: ${migrationPath}\n`);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log('✅ Migration file loaded');
  console.log(`   File: 20251111_ai_course_generator.sql\n`);

  // Step 4: Apply migration
  console.log('⏳ Applying migration to database...\n');

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, we need to use the Supabase REST API
      console.log('ℹ️  Note: Direct SQL execution requires service role key');
      console.log('   Please use the Supabase Dashboard SQL Editor instead:\n');
      console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql');
      console.log('   2. Click "New Query"');
      console.log('   3. Copy and paste the SQL from:');
      console.log(`      ${migrationPath}`);
      console.log('   4. Click "Run"\n');
      console.log(`   Error details: ${error.message}\n`);
      process.exit(1);
    }

    console.log('✅ Migration applied successfully!\n');
    console.log('📦 Created tables:');
    console.log('   • ai_generated_courses');
    console.log('   • course_topics');
    console.log('   • course_lessons');
    console.log('   • lesson_images');
    console.log('   • course_quizzes');
    console.log('   • quiz_questions');
    console.log('   • user_quiz_attempts\n');

    console.log('🎉 Database is ready!');
    console.log('   Next: Visit http://localhost:3000/admin/courses/generate\n');

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('\n   Please use the Supabase Dashboard SQL Editor instead:\n');
    console.error('   1. Open: https://supabase.com/dashboard');
    console.error('   2. Go to SQL Editor');
    console.error('   3. Create new query');
    console.error('   4. Paste the SQL from: supabase/migrations/20251111_ai_course_generator.sql');
    console.error('   5. Click Run\n');
    process.exit(1);
  }
}

applyMigration();
