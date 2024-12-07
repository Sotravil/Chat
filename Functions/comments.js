import { apiBase, logChange } from '../config.js';

export const commentOnMessage = async (messageId, commenter, comment) => {
    try {
        const response = await fetch(`${apiBase}comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, commenter, comment }),
        });
        const data = await response.json();
        if (response.ok) {
            logChange('COMMENT_ADDED', `Comment by ${commenter} on message ${messageId}`);
            return data;
        } else {
            logChange('ERROR', data.error);
        }
    } catch (error) {
        logChange('ERROR', error.message);
    }
};
