(() => {
    const form = document.getElementById('loginForm');
    const user = document.getElementById('Username');
    const pass = document.getElementById('Password');
    const error = document.getElementById('loginError');
    const message = document.getElementById('loginMessage');
    const button = document.getElementById('loginBtn');
    const toggle = document.getElementById('togglePw');

    if (!form || !user || !pass || !error || !message || !button || !toggle ||
        typeof createLoginUrl !== 'string' || createLoginUrl.length === 0) {
        return;
    }

    toggle.addEventListener('click', () => {
        const hidden = pass.type === 'password';
        pass.type = hidden ? 'text' : 'password';
        toggle.setAttribute('aria-label', hidden ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
    });

    function showError(input, text) {
        input.classList.add('is-invalid');
        error.textContent = text;
        input.focus();
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        user.classList.remove('is-invalid');
        pass.classList.remove('is-invalid');
        error.textContent = '';
        message.textContent = '';

        const username = user.value.trim();
        const password = pass.value;
        if (username.length < 3 || username.length > 100) {
            showError(user, 'ชื่อผู้ใช้ต้องมีความยาว 3-100 ตัวอักษร');
            return;
        }

        if (password.length < 6 || password.length > 200) {
            showError(pass, 'รหัสผ่านต้องมีความยาว 6-200 ตัวอักษร');
            return;
        }

        button.disabled = true;
        button.textContent = 'กำลังบันทึกข้อมูล...';

        try {
            const response = await fetch(createLoginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'ไม่สามารถบันทึกข้อมูลได้');
            }

            message.textContent = result.message || 'บันทึกข้อมูลผู้ใช้ลงฐานข้อมูลแล้ว';
            form.reset();
        } catch (requestError) {
            error.textContent = requestError.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
        } finally {
            button.disabled = false;
            button.textContent = 'เข้าสู่ระบบ';
        }
    });

    window.addEventListener('pageshow', () => {
        button.disabled = false;
        button.textContent = 'เข้าสู่ระบบ';
    });
})();
