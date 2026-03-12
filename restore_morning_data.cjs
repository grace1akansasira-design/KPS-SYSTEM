const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreAll() {
  console.log('Starting robust restoration...');
  
  try {
    // 1. Teachers
    console.log('Upserting Teachers...');
    const teachers = [
      { name: 'Mrs. Musisi Sarah', email: 'musisi@kps.ac.ug', phone: '0701112223', class: 'Baby', section: 'Nursery', status: 'active', subjects: ['Literacy', 'Numbers'] },
      { name: 'Teacher Monica', email: 'monica@kps.ac.ug', phone: '+256702222222', class: 'Middle', section: 'Nursery', status: 'active', subjects: ['Songs', 'Play'] },
      { name: 'Teacher Grace', email: 'grace@kps.ac.ug', phone: '+256703333333', class: 'Top', section: 'Nursery', status: 'active', subjects: ['Writing', 'Drawing'] },
      { name: 'Mr. Robert Mukasa', email: 'robert@kps.ac.ug', phone: '0704445556', class: 'Primary 1', section: 'Primary', status: 'active', subjects: ['Mathematics', 'English'] },
      { name: 'Mr. Kato John', email: 'kato@kps.ac.ug', phone: '0702223334', class: 'Middle', section: 'Nursery', status: 'active', subjects: ['Songs', 'Play'] }
    ];
    const { error: tErr } = await supabase.from('teachers').upsert(teachers, { onConflict: 'email' });
    if (tErr) throw new Error(`Teacher Error: ${tErr.message}`);

    // 2. Subjects
    console.log('Upserting Subjects...');
    const subjects = [
      { code: 'NUR-01', name: 'Play & Discovery', class: 'Baby', section: 'Nursery', periods_per_week: 5, pupils: 20, teacher: 'Mrs. Musisi Sarah', term: 'Term 1' },
      { code: 'NUR-02', name: 'Numbers & Shapes', class: 'Middle', section: 'Nursery', periods_per_week: 5, pupils: 25, teacher: 'Teacher Monica', term: 'Term 1' },
      { code: 'NUR-03', name: 'Reading Readiness', class: 'Top', section: 'Nursery', periods_per_week: 5, pupils: 30, teacher: 'Teacher Grace', term: 'Term 1' },
      { code: 'P1-MAT', name: 'Mathematics', class: 'Primary 1', section: 'Primary', periods_per_week: 6, pupils: 40, teacher: 'Mr. Robert Mukasa', term: 'Term 1 2025' }
    ];
    const { error: sErr } = await supabase.from('subjects').upsert(subjects, { onConflict: 'code' });
    if (sErr) throw new Error(`Subject Error: ${sErr.message}`);

    // 3. Rooms
    console.log('Upserting Rooms...');
    const rooms = [
      { name: 'Class A1', building: 'Main Block', capacity: 40, type: 'classroom', facilities: ['Whiteboard', 'Desks'], status: 'available' },
      { name: 'Class B2', building: 'Nursery Block', capacity: 30, type: 'classroom', facilities: ['Toys', 'Mats'], status: 'available' },
      { name: 'Science Lab', building: 'Lab Block', capacity: 25, type: 'lab', facilities: ['Microscope', 'Burners'], status: 'available' }
    ];
    const { error: rErr } = await supabase.from('rooms').upsert(rooms, { onConflict: 'name' });
    if (rErr) throw new Error(`Room Error: ${rErr.message}`);

    // 4. Pupils
    console.log('Upserting Pupils...');
    const pupils = [
      { name: 'David Okello', email: 'david@example.com', pupil_id: 'KPS-001', class: 'Primary 1', section: 'Primary', age: 6, status: 'active', subjects: ['Mathematics', 'English'] },
      { name: 'Sarah Namono', email: 'sarah@example.com', pupil_id: 'KPS-002', class: 'Baby', section: 'Nursery', age: 3, status: 'active', subjects: ['Literacy', 'Numbers'] }
    ];
    const { error: pErr } = await supabase.from('pupils').upsert(pupils, { onConflict: 'pupil_id' });
    if (pErr) throw new Error(`Pupil Error: ${pErr.message}`);

    // 5. Time Slots
    console.log('Inserting Time Slots...');
    const slots = [
      { day: 'Monday', start_time: '08:00', end_time: '09:00', subject: 'Mathematics', teacher: 'Mr. Robert Mukasa', room: 'Class A1', type: 'lesson', section: 'Primary' },
      { day: 'Tuesday', start_time: '09:00', end_time: '10:00', subject: 'Literacy', teacher: 'Mrs. Musisi Sarah', room: 'Class B2', type: 'lesson', section: 'Nursery' }
    ];
    // No unique conflict on time_slots mentioned in migration, so use simple insert
    const { error: tsErr } = await supabase.from('time_slots').insert(slots);
    if (tsErr) throw new Error(`TimeSlot Error: ${tsErr.message}`);

    console.log('SUCCESS: All data restored.');
  } catch (e) {
    console.error('FATAL ERROR:', e.message);
    process.exit(1);
  }
}

restoreAll();
