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
        // clear the form
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        document.getElementById('source').value = '';
        
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

document.getElementById('addAwarForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]); 
    
    const response = await fetch('/api/awar', {
        method: 'POST',
        body: formData, // Send formData
    });

    if (response.ok) {
        alert('Awareness added successfully!');
        window.location.href = '/home';
    } else {
        alert('Failed to add Awareness!');
    }
});

document.getElementById('editAwarForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('image', document.getElementById('image').files[0]); 

    const response = await fetch(`/api/awar/${awar._id}`, {
        method: 'put',
        body: formData, // Send formData
    });

    if (response.ok) {
        alert('Awareness update successfully!');
        window.location.href = '/home';
    } else {
        alert('Failed to update Awareness!');
    }
});

const sendNotificationForm = document.getElementById('sendNotificationForm');
if (sendNotificationForm) {
    sendNotificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const message = document.getElementById('content').value;
        const externalLink = document.getElementById('externalLink').value;

        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, message, externalLink }),
        });

        if (response.ok) {
            alert('Notification sent successfully!');
            window.location.href = '/home';
        } else {
            alert('Failed to send notification!');
        }
    });
}
