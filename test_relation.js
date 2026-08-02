const { createClient } = require('@supabase/supabase-js');

const url = 'https://quvfvnmndplpjbtakkgn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmZ2bm1uZHBscGpidGFra2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzU4NTksImV4cCI6MjEwMTE1MTg1OX0.QZ37i7Rdr_PQa_iISgX4Cu8UWNyJZLOLqebcN3-Cjvs';

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase
    .from('communities')
    .select('*, college:colleges(*)')
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  console.log('Result type for college field:');
  console.log('Is array?', Array.isArray(data[0].college));
  console.log('Value:', data[0].college);
}

run();
