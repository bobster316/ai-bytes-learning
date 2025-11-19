const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLesson() {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('id, title, content_markdown, content_html')
    .eq('id', '67')
    .single();
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Lesson ID:', data.id);
  console.log('Title:', data.title);
  console.log('Has content_markdown:', !!data.content_markdown);
  console.log('Markdown length:', data.content_markdown?.length || 0);
  console.log('Has content_html:', !!data.content_html);
  console.log('HTML length:', data.content_html?.length || 0);
  
  if (!data.content_html || data.content_html.length < 100) {
    console.log('\n❌ PROBLEM: content_html is empty or too short!');
    console.log('First 200 chars of markdown:', data.content_markdown?.substring(0, 200));
  } else {
    console.log('\n✅ Content looks good!');
  }
}

checkLesson();
