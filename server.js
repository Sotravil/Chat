const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 2146;

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Base API configuration
let users = [];
let chats = [];
let logs = [];

const readFile = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const writeFile = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// Load initial data
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const CHATS_FILE = path.join(__dirname, 'data', 'chats.json');

if (fs.existsSync(USERS_FILE)) users = readFile(USERS_FILE);
if (fs.existsSync(CHATS_FILE)) chats = readFile(CHATS_FILE);

// Log function
const logChange = (action, detail) => {
    const timestamp = new Date().toISOString();
    logs.push({ action, detail, timestamp });
    console.log(`[${timestamp}] ${action}: ${detail}`);
};

// API Endpoints
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    if (users.some((user) => user.username === username)) {
        return res.status(400).json({ error: 'User already exists.' });
    }
    users.push({ username, password });
    writeFile(USERS_FILE, users);
    logChange('REGISTER', `User registered: ${username}`);
    res.json({ message: 'User registered successfully.' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    logChange('LOGIN', `User logged in: ${username}`);
    res.json({ message: 'Login successful.', user });
});

app.post('/api/sendMessage', (req, res) => {
    const { sender, message } = req.body;
    if (!sender || !message) {
        return res.status(400).json({ error: 'Sender and message are required.' });
    }
    const chatMessage = { id: chats.length + 1, sender, message, likes: 0, dislikes: 0, comments: [] };
    chats.push(chatMessage);
    writeFile(CHATS_FILE, chats);
    logChange('MESSAGE_SENT', `Message sent by ${sender}: ${message}`);
    res.json(chatMessage);
});

app.post('/api/comment', (req, res) => {
    const { messageId, commenter, comment } = req.body;
    const chat = chats.find((c) => c.id === messageId);
    if (!chat) {
        return res.status(404).json({ error: 'Message not found.' });
    }
    chat.comments.push({ commenter, comment });
    writeFile(CHATS_FILE, chats);
    logChange('COMMENT_ADDED', `Comment by ${commenter} on message ${messageId}`);
    res.json(chat);
});

app.post('/api/react', (req, res) => {
    const { messageId, reaction } = req.body;
    const chat = chats.find((c) => c.id === messageId);
    if (!chat) {
        return res.status(404).json({ error: 'Message not found.' });
    }
    if (reaction === 'like') chat.likes++;
    else if (reaction === 'dislike') chat.dislikes++;
    writeFile(CHATS_FILE, chats);
    logChange('REACTION_ADDED', `Reaction on message ${messageId}: ${reaction}`);
    res.json(chat);
});

app.get('/api/chats', (req, res) => {
    res.json(chats);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
