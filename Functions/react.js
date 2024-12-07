import { apiBase, logChange } from '../config.js';

export const reactToMessage = async (messageId, reaction) => {
    try {
        const response = await fetch(`${apiBase}react`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, reaction }),
        });
        const data = await response.json();
        if (response.ok) {
            logChange('REACTION_ADDED', `Reaction on message ${messageId}: ${reaction}`);
            return data;
        } else {
            logChange('ERROR', data.error);
        }
    } catch (error) {
        logChange('ERROR', error.message);
    }
};
