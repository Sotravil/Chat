import { apiBase, logChange } from './config.js';
import { registerUser } from './Functions/register.js';
import { loginUser } from './Functions/login.js';
import { sendMessage } from './Functions/chat.js';
import { reactToMessage } from './Functions/react.js';
import { commentOnMessage } from './Functions/comment.js';
import { fetchChats } from './Functions/fetchChats.js';
import { initSingleOpenSettings, initChatSection } from './Functions/toggle_single_open.js';

const init = async () => {
    // Load Feed Data on Page Load
    document.addEventListener('DOMContentLoaded', async () => {
        logChange('Page loaded, fetching chats...');
        await fetchChats();

        // Initialize Settings Toggle and Chat Section
        initSingleOpenSettings();
        initChatSection();
    });

    // Registration Section: Register User
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission behavior
            logChange('Register form submitted.');
            registerUser(); // Call the registerUser function
        });
    }

    // Login Section: Login User
    const loginForm = document.getElementById('loginForm'); // Assuming a login form section exists
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission behavior
            logChange('Login form submitted.');
            loginUser(); // Call the loginUser function
        });
    }

    // Chat Section: Send Message
    const sendMessageButton = document.getElementById('sendMessage');
    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', async () => {
            const input = document.getElementById('messageInput').value;
            if (input.trim()) {
                logChange(`Sending message: ${input}`);
                await sendMessage(input);
                await fetchChats();
            }
        });
    }

    // React to Message
    const chatList = document.getElementById('chat-list');
    if (chatList) {
        chatList.addEventListener('click', (event) => {
            if (event.target.classList.contains('react-btn')) {
                const messageId = event.target.dataset.messageId;
                logChange(`Reacting to message ID: ${messageId}`);
                reactToMessage(messageId);
            }
        });
    }

    // Comment on Message
    if (chatList) {
        chatList.addEventListener('click', (event) => {
            if (event.target.classList.contains('comment-btn')) {
                const messageId = event.target.dataset.messageId;
                logChange(`Commenting on message ID: ${messageId}`);
                commentOnMessage(messageId);
            }
        });
    }

    // Simulate Profile Information
    const currentUser = localStorage.getItem('currentUser') || 'Guest';
    const usernameElement = document.getElementById('username');
    const statusElement = document.getElementById('status');
    if (usernameElement && statusElement) {
        usernameElement.textContent = currentUser;
        statusElement.textContent = 'Online';
        logChange(`Current user: ${currentUser} is online`);
    }

    // Logout Button
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logChange('Logout button clicked.');
            localStorage.removeItem('currentUser');
            alert('Logged out successfully!');
            location.reload();
        });
    }
};

// Initialize App
init();
