require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const usersToSeed = [
  { name: 'Yogesh', email: 'yogesh@civicpulse.test.com', role: 'citizen', location: 'Malkajgiri' },
  { name: 'Dilip', email: 'dilip@civicpulse.test.com', role: 'citizen', location: 'Ghatkesar' },
  { name: 'Mani', email: 'mani@civicpulse.test.com', role: 'citizen', location: 'Kapra' },
  { name: 'Rihan', email: 'rihan@civicpulse.test.com', role: 'citizen', location: 'Uppal' },
  { name: 'Revanth Reddy', email: 'revanth@civicpulse.test.com', role: 'official', location: 'Hyderabad District' },
  { name: 'Modi', email: 'modi@civicpulse.test.com', role: 'official', location: 'National Command' },
];

async function seed() {
  console.log('Starting seed process...');

  // Step A: Wipe old data (assuming anon key has permissions or RLS is disabled for these tables)
  console.log('Wiping old data...');
  await supabase.from('issue_upvotes').delete().neq('user_email', 'impossible_string');
  await supabase.from('issues').delete().neq('title', 'impossible_string');
  await supabase.from('profiles').delete().neq('email', 'impossible_string');
  
  // Step B: Seed users
  for (const user of usersToSeed) {
    console.log(`Processing user: ${user.name} (${user.email})`);
    
    // Attempt sign up
    let userId = null;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: 'Hackathon123!',
    });

    if (authError) {
      console.log(` Sign up message for ${user.name}:`, authError.message);
      // If already registered, try to sign in to get the ID
      if (authError.message.toLowerCase().includes('already registered')) {
        console.log(` User already exists, signing in to retrieve ID...`);
        const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: 'Hackathon123!',
        });
        
        if (signinError) {
          console.error(` Could not sign in ${user.name}:`, signinError.message);
          continue;
        }
        userId = signinData.user.id;
      } else {
        continue;
      }
    } else if (authData?.user) {
      userId = authData.user.id;
    }

    // Insert or update profile
    if (userId) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        email: user.email,
        name: user.name,
        role: user.role,
        location: user.location
      });

      if (profileError) {
        console.error(` Error creating profile for ${user.name}:`, profileError.message);
      } else {
        console.log(` ✅ Profile created/updated for ${user.name}`);
      }
    }
  }

  console.log('Seed completed successfully!');
}

seed();
