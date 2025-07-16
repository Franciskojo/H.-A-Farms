document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return (window.location.href = '/login.html');

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const settingsForm = document.getElementById('settingsForm');

  if (!fullNameInput || !emailInput || !settingsForm) {
    console.error('Missing form elements on the page.');
    return;
  }

  try {
    const res = await fetch('https://h-a-farms-backend.onrender.com/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch user');

    const user = await res.json();
    fullNameInput.value = user.fullName || '';
    emailInput.value = user.email || '';


    localStorage.setItem('userId', user.id || user._id);
  } catch (err) {
    console.error('Failed to load user:', err);
  }

  // Handle form submission
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found');
      return;
    }

    const formData = new FormData(settingsForm);
    const email = formData.get('email');
    if (!email || email.trim() === '') {
      formData.delete('email');
    }

    try {
      const updateRes = await fetch(`https://h-a-farms-backend.onrender.com/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!updateRes.ok) {
        const errorText = await updateRes.text();
        console.error('Backend response:', errorText);
        throw new Error('Failed to update profile');
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating your profile.');
    }
  });

  // Optional logout logic
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
    });
  }
});
