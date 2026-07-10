require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// REST API Endpoints

// GET /api/issues: fetch all rows from the Supabase issues table (ordered by created_at descending)
app.get('/api/issues', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Check for escalations (Hackathon Demo Speed)
    const now = Date.now();
    
    const updatedData = [...data];
    
    for (let i = 0; i < updatedData.length; i++) {
      const issue = updatedData[i];
      if (issue.status !== 'Resolved') {
        const createdDate = new Date(issue.created_at).getTime();
        const diffMinutes = (now - createdDate) / (60 * 1000);
        
        let newLevel = 1;
        if (diffMinutes > 6) newLevel = 4;
        else if (diffMinutes > 4) newLevel = 3;
        else if (diffMinutes > 2) newLevel = 2;
        
        const currentLevel = issue.escalation_level || 1;
        
        if (newLevel > currentLevel) {
          issue.escalation_level = newLevel;
          // Update database
          await supabase
            .from('issues')
            .update({ escalation_level: newLevel })
            .eq('id', issue.id);
        }
      }
    }
    
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/issues: insert req.body into the issues table
app.post('/api/issues', async (req, res) => {
  try {
    const { title, category, location, image } = req.body;
    
    const { data, error } = await supabase
      .from('issues')
      .insert([{
        title: title || 'Untitled Issue',
        category: category || 'General',
        location: location || 'SNIST Campus / Ghatkesar',
        image: image || null
      }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/issues/:id/status: update the specific row's status and resolution_evidence
app.patch('/api/issues/:id/status', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    const { status, resolutionEvidence } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (resolutionEvidence) updates.resolution_evidence = resolutionEvidence;
    
    const { data, error } = await supabase
      .from('issues')
      .update(updates)
      .eq('id', issueId)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/issues/:id/upvote: Increments upvotes count by 1
app.post('/api/issues/:id/upvote', async (req, res) => {
  try {
    const issueId = parseInt(req.params.id, 10);
    const { userEmail } = req.body;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required to upvote' });
    }
    
    // Attempt to insert into issue_upvotes (will throw if duplicate due to unique constraint)
    const { error: insertError } = await supabase
      .from('issue_upvotes')
      .insert([{ issue_id: issueId, user_email: userEmail }]);
      
    if (insertError) {
      // Postgres unique constraint violation code is 23505
      if (insertError.code === '23505') {
        return res.status(400).json({ error: 'You have already upvoted this issue.' });
      }
      throw insertError;
    }
    
    const { data: issue, error: fetchError } = await supabase
      .from('issues')
      .select('upvotes')
      .eq('id', issueId)
      .single();
      
    if (fetchError) throw fetchError;
    
    const { data, error } = await supabase
      .from('issues')
      .update({ upvotes: (issue.upvotes || 0) + 1 })
      .eq('id', issueId)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CivicPulse Backend running on http://localhost:${PORT}`);
});
