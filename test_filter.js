const { createClient } = require('@supabase/supabase-js');

const url = 'https://quvfvnmndplpjbtakkgn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dmZ2bm1uZHBscGpidGFra2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzU4NTksImV4cCI6MjEwMTE1MTg1OX0.QZ37i7Rdr_PQa_iISgX4Cu8UWNyJZLOLqebcN3-Cjvs';

const supabase = createClient(url, key);

async function run() {
  const { data: initialCommunities, error } = await supabase
    .from('communities')
    .select('*, college:colleges(*)')
    .or('status.eq.approved,status.is.null')
    .order('member_count', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  console.log('Total communities fetched:', initialCommunities.length);

  // Check if college is an array or object in the fetch
  console.log('Is c.college an array?', Array.isArray(initialCommunities[0].college));

  const distSet = new Set();
  initialCommunities.forEach((c) => {
    const college = c.college;
    const resolvedCollege = Array.isArray(college) ? college[0] : college;
    const d = resolvedCollege?.district;
    if (d) distSet.add(d);
  });
  console.log('Unique districts found:', Array.from(distSet));

  const selectedDistrict = 'Morigaon';
  const searchQuery = '';

  const filtered = initialCommunities.filter((c) => {
    const college = c.college;
    const resolvedCollege = Array.isArray(college) ? college[0] : college;

    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resolvedCollege?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resolvedCollege?.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDistrict = selectedDistrict ? resolvedCollege?.district === selectedDistrict : true;

    return matchesSearch && matchesDistrict;
  });

  console.log('Filtered communities count for Morigaon:', filtered.length);
  if (filtered.length > 0) {
    console.log('First matched community:', filtered[0].name, 'College:', filtered[0].college);
  }
}

run();
