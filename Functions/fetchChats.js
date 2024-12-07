import { apiBase, logChange } from '../config.js';

export const fetchChats = async () => {
    try {
        const response = await fetch(`${apiBase}chats`);
        if (!response.ok) {
            throw new Error(`Failed to fetch chats: ${response.statusText}`);
        }
        const chats = await response.json();
        const feed = document.getElementById('feed');
        feed.innerHTML = ''; // Clear the feed for fresh data

        // Iterate through chats and render each message
        chats.forEach((chat) => {
            const chatElement = document.createElement('div');
            chatElement.classList.add('chat-message');

            chatElement.innerHTML = `
                <div>
                    <p><strong>${chat.sender}:</strong> ${chat.message}</p>
                    <p>Likes: ${chat.likes} | Dislikes: ${chat.dislikes}</p>
                    <button class="like-btn" data-id="${chat.id}">Like</button>
                    <button class="dislike-btn" data-id="${chat.id}">Dislike</button>
                    <button class="comment-btn" data-id="${chat.id}">Comment</button>
                </div>
                <div class="comments">
                    <strong>Comments:</strong>
                    ${chat.comments
                        .map((c) => `<p>${c.commenter}: ${c.comment}</p>`)
                        .join('')}
                </div>
            `;
            feed.appendChild(chatElement);
        });

        // Add event listeners for buttons
        document.querySelectorAll('.like-btn').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const messageId = e.target.getAttribute('data-id');
                await reactToMessage(messageId, 'like');
                await fetchChats(); // Refresh feed
            });
        });

        document.querySelectorAll('.dislike-btn').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const messageId = e.target.getAttribute('data-id');
                await reactToMessage(messageId, 'dislike');
                await fetchChats(); // Refresh feed
            });
        });

        document.querySelectorAll('.comment-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const messageId = e.target.getAttribute('data-id');
                const comment = prompt('Enter your comment:');
                if (comment && comment.trim()) {
                    const commenter = localStorage.getItem('currentUser') || 'Anonymous';
                    commentOnMessage(messageId, commenter, comment).then(() => fetchChats());
                }
            });
        });

        logChange('FETCH_CHATS', 'Chats fetched and rendered successfully.');
    } catch (error) {
        logChange('ERROR', `Error fetching chats: ${error.message}`);
    }
};
