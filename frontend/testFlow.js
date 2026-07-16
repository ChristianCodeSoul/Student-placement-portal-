(async () => {
  try {
    const uniq = Date.now().toString().slice(-5);
    const payload = {
      firstName: 'Atlas',
      lastName: 'Connect',
      username: `AtlasUser${uniq}A`,
      email: `atlas${uniq}@example.com`,
      password: 'Test@1234',
      confirmPassword: 'Test@1234'
    };

    console.log('Registering', payload.username);
    const reg = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const regBody = await reg.json();
    console.log('Register status', reg.status, regBody);
    if (reg.status !== 201) return;

    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: payload.username, password: payload.password })
    });
    const loginBody = await loginRes.json();
    console.log('Login status', loginRes.status, loginBody);
  } catch (err) {
    console.error('flow error', err.message || err);
  }
})();
