class AlertService {
    static success(message, title = 'สำเร็จ') {
        return Swal.fire({
            icon: 'success',
            title,
            text: message,
            confirmButtonText: 'ตกลง'
        });
    }

    static error(message, title = 'เกิดข้อผิดพลาด') {
        return Swal.fire({
            icon: 'error',
            title,
            text: message,
            confirmButtonText: 'ตกลง'
        });
    }

    static warning(message, title = 'แจ้งเตือน') {
        return Swal.fire({
            icon: 'warning',
            title,
            text: message,
            confirmButtonText: 'ตกลง'
        });
    }

    static info(message, title = 'ข้อมูล') {
        return Swal.fire({
            icon: 'info',
            title,
            text: message,
            confirmButtonText: 'ตกลง'
        });
    }

    static confirm(message, title = 'ยืนยันการทำรายการ') {
        return Swal.fire({
            icon: 'question',
            title,
            text: message,
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });
    }

    static loading(message = 'กำลังดำเนินการ...') {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading()
        });
    }

    static close() {
        Swal.close();
    }
}

window.AlertService = AlertService;
