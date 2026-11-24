(() => {
    const form = document.getElementById('loginForm');
    const user = document.getElementById('Username');
    const pass = document.getElementById('Password');
    const button = document.getElementById('loginBtn');
    const toggle = document.getElementById('togglePw');
    const antiforgeryToken = document.querySelector('input[name="__RequestVerificationToken"]');

    if (!form || !user || !pass || !button || !toggle || !antiforgeryToken ||
        typeof createLoginUrl !== 'string' || createLoginUrl.length === 0 ||
        typeof AlertService === 'undefined') {
        return;
    }

    toggle.addEventListener('click', () => {
        const hidden = pass.type === 'password';
        pass.type = hidden ? 'text' : 'password';
        toggle.setAttribute('aria-label', hidden ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
    });

    function showError(input, text) {
        input.classList.add('is-invalid');
        AlertService.error(text);
        input.focus();
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        user.classList.remove('is-invalid');
        pass.classList.remove('is-invalid');

        const username = user.value.trim();
        const password = pass.value;
        if (username.length < 3 || username.length > 100) {
            showError(user, 'ชื่อผู้ใช้ต้องมีความยาว 3-100 ตัวอักษร');
            return;
        }

        button.disabled = true;
        button.textContent = 'กำลังตรวจสอบ...';

        try {
            const response = await fetch(createLoginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': antiforgeryToken.value
                },
                credentials: 'same-origin',
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'ไม่สามารถเข้าสู่ระบบได้');
            }

            window.location.assign(result.redirectUrl || '/Dashboard');
        } catch (requestError) {
            await AlertService.error(requestError.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
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
