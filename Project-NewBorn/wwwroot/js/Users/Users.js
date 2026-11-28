(function () {
    'use strict';

    // Mock data only; edits remain in memory and aren't saved to the database.
    var users = [
        { id: 1, first: 'สมชาย', last: 'ใจดี', username: 'somchai.j', active: true, photo: null },
        { id: 2, first: 'สมหญิง', last: 'รักษ์สุข', username: 'somying.r', active: true, photo: null },
        { id: 3, first: 'วิชัย', last: 'พัฒนากุล', username: 'wichai.p', active: true, photo: null },
        { id: 4, first: 'ปรียา', last: 'ศรีสวัสดิ์', username: 'preeya.s', active: false, photo: null },
        { id: 5, first: 'อนันต์', last: 'มั่นคง', username: 'anan.m', active: true, photo: null },
        { id: 6, first: 'มาลี', last: 'วงศ์ไทย', username: 'malee.w', active: true, photo: null },
        { id: 7, first: 'ธนากร', last: 'เจริญสุข', username: 'thanakorn.c', active: false, photo: null },
        { id: 8, first: 'กัลยา', last: 'แก้วมณี', username: 'kanlaya.k', active: true, photo: null }
    ];
    var nextId = 9;
    var query = '';
    var currentPage = 1;
    var pageSize = 10;
    var listPage = document.getElementById('userListPage');
    var detailPage = document.getElementById('userDetailPage');
    var rowTemplate = document.getElementById('userRowTemplate');
    var emptyTemplate = document.getElementById('userEmptyTemplate');
    var detailTemplate = document.getElementById('userDetailTemplate');

    function fullName(user) { return user.first + ' ' + user.last; }
    function findUser(id) { return users.filter(function (user) { return user.id === id; })[0]; }

    function updateList(scrollToTop) {
        var key = query.trim().toLowerCase();
        var result = users.filter(function (user) {
            return (fullName(user) + ' ' + user.username).toLowerCase().indexOf(key) !== -1;
        });
        var pageCount = Math.max(1, Math.ceil(result.length / pageSize));
        currentPage = Math.min(currentPage, pageCount);
        var start = (currentPage - 1) * pageSize;
        var pageUsers = result.slice(start, start + pageSize);
        var rows = document.createDocumentFragment();

        pageUsers.forEach(function (user, index) {
            var row = rowTemplate.content.firstElementChild.cloneNode(true);
            var nameLink = row.querySelector('.un a');
            var status = row.querySelector('[data-status]');
            row.querySelector('[data-row-number]').textContent = String(start + index + 1);
            nameLink.textContent = fullName(user);
            nameLink.dataset.edit = String(user.id);
            row.querySelector('[data-username]').textContent = user.username;
            status.textContent = user.active ? 'ใช้งาน' : 'ปิดใช้งาน';
            status.classList.add(user.active ? 'on' : 'off');
            row.querySelector('.act[data-edit]').dataset.edit = String(user.id);
            row.querySelector('[data-delete]').dataset.delete = String(user.id);
            row.querySelector('.act[data-edit]').setAttribute('aria-label', 'แก้ไข ' + fullName(user));
            row.querySelector('[data-delete]').setAttribute('aria-label', 'ลบ ' + fullName(user));
            rows.appendChild(row);
        });

        document.getElementById('uList').replaceChildren(rows);
        document.getElementById('uCount').textContent = key
            ? 'พบ ' + result.length + ' จาก ' + users.length + ' คน'
            : 'ผู้ใช้ทั้งหมด ' + users.length + ' คน';
        document.getElementById('uWrap').hidden = result.length === 0;
        document.getElementById('uEmpty').replaceChildren();
        if (result.length === 0) {
            document.getElementById('uEmpty').appendChild(emptyTemplate.content.cloneNode(true));
        }
        document.getElementById('pagination').hidden = result.length === 0;
        document.getElementById('pageInfo').textContent = 'หน้า ' + currentPage + ' / ' + pageCount;
        document.getElementById('previousPage').disabled = currentPage <= 1;
        document.getElementById('nextPage').disabled = currentPage >= pageCount;
        if (scrollToTop) document.getElementById('uWrap').scrollTop = 0;
    }

    function showList() {
        detailPage.hidden = true;
        detailPage.replaceChildren();
        listPage.hidden = false;
        updateList();
    }

    function deleteUser(user) {
        if (!user || !window.confirm('ต้องการลบผู้ใช้ ' + fullName(user) + ' ใช่หรือไม่?')) return;
        users = users.filter(function (item) { return item.id !== user.id; });
        updateList();
    }

    function renderDetail(user) {
        var draft = user
            ? { first: user.first, last: user.last, username: user.username, active: user.active, photo: user.photo }
            : { first: '', last: '', username: '', active: true, photo: null };
        detailPage.replaceChildren(detailTemplate.content.cloneNode(true));
        listPage.hidden = true;
        detailPage.hidden = false;

        var form = detailPage.querySelector('#userDetailForm');
        var firstInput = detailPage.querySelector('#firstName');
        var lastInput = detailPage.querySelector('#lastName');
        var usernameInput = detailPage.querySelector('#username');
        var activeInput = detailPage.querySelector('#isActive');
        var photoInput = detailPage.querySelector('#photoFile');
        var photoPreview = detailPage.querySelector('.profile-img');
        var photoPlaceholder = detailPage.querySelector('.profile-placeholder');
        var deletePhotoButton = detailPage.querySelector('#deletePhoto');

        firstInput.value = draft.first;
        lastInput.value = draft.last;
        usernameInput.value = draft.username;
        activeInput.checked = draft.active;
        paintPhoto();
        updateActiveText();

        detailPage.querySelector('#uploadPhoto').addEventListener('click', function () { photoInput.click(); });
        photoInput.addEventListener('change', function () {
            var file = photoInput.files[0];
            var error = detailPage.querySelector('#photoError');
            if (!file) return;
            if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
                error.textContent = 'ไฟล์ต้องเป็น JPG, PNG, WebP หรือ GIF';
                photoInput.value = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                error.textContent = 'ไฟล์ใหญ่เกิน 2 MB';
                photoInput.value = '';
                return;
            }
            error.textContent = '';
            var reader = new FileReader();
            reader.onload = function () { draft.photo = reader.result; paintPhoto(); };
            reader.onerror = function () { error.textContent = 'อ่านไฟล์รูปไม่สำเร็จ กรุณาลองอีกครั้ง'; };
            reader.readAsDataURL(file);
        });
        deletePhotoButton.addEventListener('click', function () {
            draft.photo = null;
            photoInput.value = '';
            detailPage.querySelector('#photoError').textContent = '';
            paintPhoto();
        });
        activeInput.addEventListener('change', updateActiveText);
        detailPage.querySelector('#detailBack').addEventListener('click', showList);
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var first = firstInput.value.trim();
            var last = lastInput.value.trim();
            var username = usernameInput.value.trim();
            var usernamePattern = /^[A-Za-z0-9._-]{3,20}$/;
            var duplicate = users.some(function (item) {
                return (!user || item.id !== user.id) && item.username.toLowerCase() === username.toLowerCase();
            });
            var usernameError = !usernamePattern.test(username)
                ? 'ชื่อผู้ใช้ต้องมี 3-20 ตัว ใช้ได้เฉพาะ a-z 0-9 . _ -'
                : duplicate ? 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' : '';

            detailPage.querySelector('#firstError').textContent = first ? '' : 'กรอกชื่อก่อนบันทึก';
            detailPage.querySelector('#lastError').textContent = last ? '' : 'กรอกนามสกุลก่อนบันทึก';
            detailPage.querySelector('#usernameError').textContent = usernameError;
            if (!first || !last || usernameError) return;

            if (!user) {
                user = { id: nextId++, photo: null };
                users.unshift(user);
            }
            user.first = first;
            user.last = last;
            user.username = username;
            user.active = activeInput.checked;
            user.photo = draft.photo;
            showList();
        });

        function paintPhoto() {
            photoPreview.hidden = !draft.photo;
            photoPlaceholder.hidden = !!draft.photo;
            if (draft.photo) photoPreview.src = draft.photo;
            deletePhotoButton.disabled = !draft.photo;
        }

        function updateActiveText() {
            detailPage.querySelector('#activeText').textContent = activeInput.checked
                ? 'บัญชีนี้เข้าสู่ระบบได้'
                : 'บัญชีนี้ถูกปิดการใช้งาน';
        }
    }

    document.getElementById('uq').addEventListener('input', function (event) {
        query = event.target.value;
        currentPage = 1;
        updateList();
    });
    document.getElementById('pageSize').addEventListener('change', function (event) {
        pageSize = Number(event.target.value);
        currentPage = 1;
        updateList();
    });
    document.getElementById('previousPage').addEventListener('click', function () {
        if (currentPage > 1) { currentPage--; updateList(true); }
    });
    document.getElementById('nextPage').addEventListener('click', function () {
        currentPage++;
        updateList(true);
    });
    document.getElementById('uAdd').addEventListener('click', function () { renderDetail(null); });
    document.getElementById('uList').addEventListener('click', function (event) {
        var edit = event.target.closest('[data-edit]');
        var remove = event.target.closest('[data-delete]');
        if (edit) { event.preventDefault(); renderDetail(findUser(Number(edit.dataset.edit))); return; }
        if (remove) { event.preventDefault(); deleteUser(findUser(Number(remove.dataset.delete))); }
    });

    updateList();
})();
