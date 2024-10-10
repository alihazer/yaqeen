document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        window.location.href = '/home'; // Redirect to home page on success
    } else {
        alert('Login failed!');
    }
});

document.getElementById('addNewsForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const source = document.getElementById('source').value;

    const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ title, content, source }),
    });
    console.log(response);

    if (response.ok) {
        alert('News added successfully!');
        window.location.href = '/home'; // Redirect to home page after adding news
    } else {
        alert('Failed to add news!');
    }
});

document.getElementById('addPrayerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const audio = document.getElementById('audio').value;
    const speaker = document.getElementById('speaker').value;


    const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ title, description, audio, speaker }),
    });
    console.log(response);
    if (response.ok) {
        alert('News added successfully!');
        window.location.href = '/prayers'; // Redirect to home page after adding news
    } else {
        alert('Failed to add news!');
    }
});

document.getElementById('addAdminForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email ,password }),
    });
    console.log(response);
    if (response.ok) {
        alert('Admin added successfully!');
        window.location.href = '/home'; // Redirect to home page after adding admin
    } else {
        alert('Failed to add admin!');
    }
});
