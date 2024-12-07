// register.js
import { apiBase, logChange } from './config.js';

export async function registerUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;

    if (!username || !password || !gender || !age) {
        logChange('Registration failed: Missing fields.');
        alert('Please fill all the fields');
        return;
    }

    try {
        logChange(`Attempting to register user: ${username}`);
        const response = await fetch(`${apiBase}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, gender, age }),
        });

        const data = await response.json();
        if (response.status === 200) {
            logChange(`User registered successfully: ${username}`);
            alert('Registration successful!');
            // Redirect to login or another section
            document.getElementById('feedLink').click(); // Example navigation to Feed section
        } else {
            logChange(`Registration failed: ${data.message}`);
            alert(`Registration failed: ${data.message}`);
        }
    } catch (error) {
        logChange(`Error during registration: ${error}`);
        console.error('Error during registration:', error);
        alert('An error occurred while registering. Please try again.');
    }
}
