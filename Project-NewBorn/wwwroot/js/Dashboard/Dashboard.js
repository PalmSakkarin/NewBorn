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

const BABY = '<svg class="baby" viewBox="40 20 220 250" aria-hidden="true"><g class="fl"><g class="hd">' +
    '<circle cx="60" cy="168" r="15" fill="#FFF4CC" stroke="#111" stroke-width="5"/><circle cx="240" cy="168" r="15" fill="#FFF4CC" stroke="#111" stroke-width="5"/>' +
    '<circle cx="150" cy="160" r="92" fill="#FFF4CC" stroke="#111" stroke-width="5"/><path class="tf" d="M148 70C132 44 164 30 158 52" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>' +
    '<ellipse class="ck" cx="98" cy="192" rx="16" ry="10" fill="#FFA000" opacity=".6"/><ellipse class="ck" cx="202" cy="192" rx="16" ry="10" fill="#FFA000" opacity=".6"/>' +
    '<path class="ey" d="M104 158q14 14 28 0M168 158q14 14 28 0" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/>' +
    '<path class="mo" d="M138 190q12 12 24 0" fill="none" stroke="#111" stroke-width="6" stroke-linecap="round"/></g></g></svg>';

const nav = document.getElementById('nav');
const view = document.getElementById('view');
const title = document.getElementById('title');
const body = document.body;
const burger = document.getElementById('burger');
const logoutForm = document.getElementById('logoutForm');

function ico(name) { return '<svg class="ico" aria-hidden="true"><use href="#i-' + name + '"></use></svg>'; }
function navItem(menu) { return '<a class="item" href="#" data-p="' + menu.t + '" data-i="' + menu.i + '" title="' + menu.t + '">' + ico(menu.i) + '<span>' + menu.t + '</span></a>'; }
function renderNav() {
    nav.innerHTML = '<a class="item" href="#" data-p="หน้าแรก" data-i="home" title="หน้าแรก" aria-current="page">' + ico('home') + '<span>หน้าแรก</span></a>' +
        '<div class="grp"><span>เมนูหลัก</span></div>' + MENU.main.map(navItem).join('') +
        '<div class="grp"><span>ตั้งค่า</span></div>' + MENU.set.map(navItem).join('');
}
function cards(list, className) {
    return '<div class="cgrid">' + list.map(function (menu) {
        return '<a class="mcard" href="#" data-p="' + menu.t + '" data-i="' + menu.i + '">' +
            '<svg class="ico go" aria-hidden="true"><use href="#i-go"></use></svg>' +
            '<div class="cic ' + className + '">' + ico(menu.i) + '</div><h3>' + menu.t + '</h3><p>' + menu.d + '</p></a>';
    }).join('') + '</div>';
}
function home() {
    view.innerHTML = '<section class="hero d-flex align-items-center justify-content-between gap-3"><div><h2>สวัสดี ' + window.dashboardUserName + '</h2><p>เลือกเมนูที่ต้องการใช้งานได้เลย</p></div>' + BABY + '</section>' +
        '<div class="sec">เมนูหลัก</div>' + cards(MENU.main, '') + '<div class="sec">ตั้งค่า</div>' + cards(MENU.set, 'set');
}
function go(name, icon) {
    title.textContent = name;
    document.title = 'Newborn | ' + name;
    nav.querySelectorAll('.item').forEach(function (item) {
        if (item.dataset.p === name) item.setAttribute('aria-current', 'page');
        else item.removeAttribute('aria-current');
    });
    if (name === 'หน้าแรก') home();
    else view.innerHTML = '<div class="empty"><div class="cic">' + ico(icon) + '</div><h2>' + name + '</h2><p>หน้านี้เป็นตัวอย่าง ยังไม่มีเนื้อหา</p><button class="btn-nb" type="button" data-p="หน้าแรก" data-i="home">กลับหน้าแรก</button></div>';
    closeDrawer();
    window.scrollTo(0, 0);
}
function wide() { return window.matchMedia('(min-width: 992px)').matches; }
function closeDrawer() {
    body.classList.remove('drawer');
    burger.setAttribute('aria-expanded', String(wide() ? !body.classList.contains('collapsed') : false));
}
function saveState(value) { try { localStorage.setItem('nbSide', value); } catch { } }

document.addEventListener('click', function (event) {
    const target = event.target.closest('[data-p]');
    if (!target) return;
    event.preventDefault();
    go(target.dataset.p, target.dataset.i);
});
burger.addEventListener('click', function () {
    if (wide()) {
        const collapsed = body.classList.toggle('collapsed');
        burger.setAttribute('aria-expanded', String(!collapsed));
        saveState(collapsed ? '1' : '0');
    } else {
        const open = body.classList.toggle('drawer');
        burger.setAttribute('aria-expanded', String(open));
    }
});
document.getElementById('scrim').addEventListener('click', closeDrawer);
document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeDrawer(); });
window.matchMedia('(min-width: 992px)').addEventListener('change', function () { body.classList.remove('drawer'); closeDrawer(); });
try { if (localStorage.getItem('nbSide') === '1' && wide()) body.classList.add('collapsed'); } catch { }

logoutForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (typeof AlertService === 'undefined') {
        logoutForm.submit();
        return;
    }

    const result = await AlertService.confirm('คุณต้องการออกจากระบบหรือไม่?', 'ยืนยันการออกจากระบบ');
    if (result.isConfirmed) logoutForm.submit();
});

renderNav();
if (window.dashboardPageTitle === 'หน้าแรก') home();
