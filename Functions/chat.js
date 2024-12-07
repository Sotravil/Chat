import { apiBase, logChange } from '../config.js';

export const sendMessage = async (message) => {
    const sender = localStorage.getItem('currentUser');
    if (!sender) {
        logChange('ERROR', 'No user logged in.');
        return;
    }
    try {
        const response = await fetch(`${apiBase}sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, message }),
        });
        const data = await response.json();
        if (response.ok) {
            logChange('MESSAGE_SENT', `Message sent by ${sender}: ${message}`);
            return data;
        } else {
            logChange('ERROR', data.error);
        }
    } catch (error) {
        logChange('ERROR', error.message);
    }
};

export const fetchChats = async () => {
    try {
        const response = await fetch(`${apiBase}chats`);
        const chats = await response.json();
        const feed = document.getElementById('feed');
        feed.innerHTML = '';
        chats.forEach((chat) => {
            const chatElement = document.createElement('div');
            chatElement.classList.add('chat-message');
            chatElement.innerHTML = `
                <p><strong>${chat.sender}:</strong> ${chat.message}</p>
                <p>Likes: ${chat.likes}, Dislikes: ${chat.dislikes}</p>
                <button onclick="likeMessage(${chat.id})">Like</button>
                <button onclick="dislikeMessage(${chat.id})">Dislike</button>
                <button onclick="commentOnMessage(${chat.id})">Comment</button>
                <div class="comments">
                    ${chat.comments.map((c) => `<p>${c.commenter}: ${c.comment}</p>`).join('')}
                </div>
            `;
            feed.appendChild(chatElement);
        });
    } catch (error) {
        logChange('ERROR', error.message);
    }
};

export function initSingleOpenSettings() {
    const summaries = document.querySelectorAll('.settings-section summary');

    summaries.forEach(summary => {
        summary.addEventListener('click', () => {
            summaries.forEach(otherSummary => {
                if (otherSummary !== summary) {
                    const details = otherSummary.parentElement;
                    if (details && details.open) {
                        details.open = false;
                    }
                }
            });
        });
    });
}

export function handleSendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageOutput = document.getElementById('messageOutput');
    const message = messageInput.value.trim();

    if (message) {
        // Create a new row for the message
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row');
        messageRow.textContent = message;

        // Append the new message to the output container
        messageOutput.appendChild(messageRow);

        // Scroll to the bottom of the output container
        messageOutput.scrollTop = messageOutput.scrollHeight;

        // Clear the input
        messageInput.value = '';
    }
}

export function initChatSection() {
    document.getElementById('sendMessage').addEventListener('click', handleSendMessage);
}