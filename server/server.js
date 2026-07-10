const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing JSON request bodies

// In-Memory Database (Hackathon Speed)
let issuesDB = [];

// Generate simple unique IDs
let nextId = 4;

// REST API Endpoints

// GET /api/issues: Returns the issuesDB array (sorted by upvotes descending)
app.get('/api/issues', (req, res) => {
  const sortedIssues = [...issuesDB].sort((a, b) => b.upvotes - a.upvotes);
  res.json(sortedIssues);
});

// POST /api/issues: Accepts a new issue object, adds it, and returns it
app.post('/api/issues', (req, res) => {
  const { title, category, location, description } = req.body;
  
  const newIssue = {
    id: nextId++,
    title: title || 'Untitled Issue',
    category: category || 'General',
    location: location || 'SNIST Campus / Ghatkesar', // Defaulting to our geofenced area for the demo
    description: description || '',
    status: 'Pending',
    upvotes: 1
  };
  
  issuesDB.push(newIssue);
  res.status(201).json(newIssue);
});

// PATCH /api/issues/:id/status: Updates status and returns the updated issue
app.patch('/api/issues/:id/status', (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  const { status } = req.body;
  
  const issueIndex = issuesDB.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  
  if (status) {
    issuesDB[issueIndex].status = status;
  }
  
  res.json(issuesDB[issueIndex]);
});

// POST /api/issues/:id/upvote: Increments upvotes count by 1 and returns the updated issue
app.post('/api/issues/:id/upvote', (req, res) => {
  const issueId = parseInt(req.params.id, 10);
  
  const issueIndex = issuesDB.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  
  issuesDB[issueIndex].upvotes += 1;
  
  res.json(issuesDB[issueIndex]);
});

// Start Server
app.listen(PORT, () => {
  console.log(`CivicPulse Backend running on http://localhost:${PORT}`);
});
