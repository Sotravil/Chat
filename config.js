export const apiBase = 'http://localhost:2146/api/';
export const currentUser = { username: null };

export const logChange = (action, detail) => {
    console.log(`[${new Date().toISOString()}] ${action}: ${detail}`);
};
