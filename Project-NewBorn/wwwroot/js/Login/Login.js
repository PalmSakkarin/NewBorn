(() => {
    const app = document.getElementById('login-app');

    if (!app || typeof createLoginUrl !== 'string' || createLoginUrl.length === 0) {
        return;
    }

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('login-submit');
    const message = document.getElementById('login-message');

    submitButton.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        console.log('username => ', username);
        console.log('password => ', password);
        if (!username || !password) {
            message.textContent = 'กรุณากรอก username และ password';
            return;
        }

        submitButton.disabled = true;
        message.textContent = 'กำลังบันทึกข้อมูล...';

        try {
            const response = await fetch(createLoginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            message.textContent = result.message ?? 'ไม่สามารถบันทึกข้อมูลได้';
            if (response.ok) {
                usernameInput.value = '';
                passwordInput.value = '';
            }
        } catch {
            message.textContent = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
        } finally {
            submitButton.disabled = false;
        }
    });
})();
