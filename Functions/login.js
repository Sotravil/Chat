// login.js
import { apiBase, logChange } from './config.js';

export async function loginUser() {
    const username = document.getElementById('usernameDisplay').value.trim(); // Assuming you have a login form.
    const password = document.getElementById('password').value.trim(); // Add password field in login form if needed.

    if (!username || !password) {
        logChange('Login failed: Missing fields.');
        alert('Please enter both username and password');
        return;
    }

    try {
        logChange(`Attempting to log in user: ${username}`);
        const response = await fetch(`${apiBase}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.status === 200) {
            logChange(`User logged in successfully: ${username}`);
            localStorage.setItem('currentUser', username);
            alert('Login successful!');
            document.getElementById('feedLink').click(); // Example navigation to Feed section
        } else {
            logChange(`Login failed: ${data.message}`);
            alert(`Login failed: ${data.message}`);
        }
    } catch (error) {
        logChange(`Error during login: ${error}`);
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    }
}
