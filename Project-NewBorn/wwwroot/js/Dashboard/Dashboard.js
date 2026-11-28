const MENU = {
    main: [
        { t: 'ทะเบียนทารก', d: 'ลงทะเบียนและค้นหาข้อมูลทารกแรกเกิด', i: 'baby' },
        { t: 'บันทึกการตรวจ', d: 'บันทึกผลการตรวจและการดูแลรายวัน', i: 'clip' },
        { t: 'นัดหมายและติดตาม', d: 'ดูตารางนัดและติดตามผลต่อเนื่อง', i: 'cal' },
        { t: 'รายงาน', d: 'สรุปและส่งออกรายงานตามช่วงเวลา', i: 'chart' }
    ],
    set: [
        { t: 'จัดการผู้ใช้', d: 'เพิ่ม แก้ไข และปิดการใช้งานบัญชี', i: 'users' },
        { t: 'สิทธิ์การใช้งาน', d: 'กำหนดบทบาทและสิทธิ์เข้าถึงเมนู', i: 'shield' },
        { t: 'ข้อมูลหลัก', d: 'จัดการรายการอ้างอิงที่ใช้ในระบบ', i: 'db' },
        { t: 'ตั้งค่าระบบ', d: 'ค่าเริ่มต้นและการตั้งค่าทั่วไป', i: 'gear' }
    ]
};

(function () {
    'use strict';

    var nav = document.getElementById('nav');
    var view = document.getElementById('view');
    var title = document.getElementById('title');
    var body = document.body;
    var burger = document.getElementById('burger');
    var logoutForm = document.getElementById('logoutForm');
    var homeTemplate = document.getElementById('dashboardHomeTemplate');
    var placeholderTemplate = document.getElementById('dashboardPlaceholderTemplate');

    function updateActiveItem(name) {
        nav.querySelectorAll('.item[data-p]').forEach(function (item) {
            if (item.dataset.p === name) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        });
    }

    function showHome() {
        view.replaceChildren(homeTemplate.content.cloneNode(true));
        view.querySelector('#dashboardGreetingName').textContent = window.dashboardUserName || '';
    }

    function showPlaceholder(name, iconName) {
        view.replaceChildren(placeholderTemplate.content.cloneNode(true));
        view.querySelector('#placeholderTitle').textContent = name;
        view.querySelector('#placeholderIcon').setAttribute('href', '#i-' + iconName);
    }

    function go(name, iconName) {
        if (name === 'จัดการผู้ใช้') {
            window.location.assign('/Users');
            return;
        }

        title.textContent = name;
        document.title = 'Newborn | ' + name;
        updateActiveItem(name);
        if (name === 'หน้าแรก') showHome();
        else showPlaceholder(name, iconName);
        closeDrawer();
        window.scrollTo(0, 0);
    }

    function wide() { return window.matchMedia('(min-width: 992px)').matches; }
    function closeDrawer() {
        body.classList.remove('drawer');
        burger.setAttribute('aria-expanded', String(wide() ? !body.classList.contains('collapsed') : false));
    }
    function saveState(value) {
        try { localStorage.setItem('nbSide', value); } catch { }
    }

    document.addEventListener('click', function (event) {
        var target = event.target.closest('[data-p]');
        if (!target || target.getAttribute('href') !== '#') return;
        event.preventDefault();
        if (!homeTemplate || !placeholderTemplate) {
            window.location.assign('/Dashboard');
            return;
        }
        go(target.dataset.p, target.dataset.i);
    });
    burger.addEventListener('click', function () {
        if (wide()) {
            var collapsed = body.classList.toggle('collapsed');
            burger.setAttribute('aria-expanded', String(!collapsed));
            saveState(collapsed ? '1' : '0');
        } else {
            var open = body.classList.toggle('drawer');
            burger.setAttribute('aria-expanded', String(open));
        }
    });
    document.getElementById('scrim').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeDrawer(); });
    window.matchMedia('(min-width: 992px)').addEventListener('change', function () {
        body.classList.remove('drawer');
        closeDrawer();
    });
    try {
        if (localStorage.getItem('nbSide') === '1' && wide()) body.classList.add('collapsed');
    } catch { }

    logoutForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (typeof AlertService === 'undefined') {
            logoutForm.submit();
            return;
        }
        var result = await AlertService.confirm('คุณต้องการออกจากระบบหรือไม่?', 'ยืนยันการออกจากระบบ');
        if (result.isConfirmed) logoutForm.submit();
    });

    updateActiveItem(window.dashboardPageTitle || 'หน้าแรก');
    if (window.dashboardPageTitle === 'หน้าแรก') showHome();
})();
