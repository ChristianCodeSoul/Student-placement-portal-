(async () => {
  try {
    const uniq = Date.now().toString().slice(-4);
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      username: `TestUser${uniq}A`,
      email: `test${uniq}@example.com`,
      password: 'Test@1234',
      confirmPassword: 'Test@1234',
    };
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log(text);
  } catch (err) {
    console.error('error', err.message || err);
  }
})();
