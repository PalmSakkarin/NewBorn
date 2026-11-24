# NewBorn Project Skill

## 1. Purpose

เอกสารแนวทางสำหรับพัฒนาโปรเจกต์ NewBorn ให้โครงสร้างและรูปแบบการทำงานสอดคล้องกัน

## 2. Project Structure

```text
NewBorn/
├── Application/
│   ├── DTOs/
│   │   └── Login/
│   │       ├── LoginRequest.cs
│   │       └── AuthenticatedUser.cs
│   ├── Mappings/
│   │   └── Login/
│   │       └── LoginUserMapper.cs
│   ├── Helpers/
│   │   └── Common/
│   ├── Interfaces/
│   │   ├── Repositories/
│   │   │   └── Login/
│   │   └── Services/
│   │       └── Login/
│   └── Services/
│       └── Login/
├── Domain/
│   ├── Entities/
│   │   └── Login/
│   └── NewBorn.Domain.csproj
├── Infrastructure/
│   ├── Data/
│   │   └── Common/
│   ├── Migrations/
│   │   └── Login/
│   └── Repositories/
│       └── Login/
└── Project-NewBorn/
	├── Controllers/
	│   └── Login/
	├── Views/
	│   └── Login/
	└── wwwroot/
		├── css/
		│   └── Login/
		└── js/
			└── Login/
```

## 3. Layer Responsibilities

- **Domain**: Entity และกฎทางธุรกิจที่ไม่ผูกกับฐานข้อมูลหรือ Web
- **Application**: DTO, interface, service และ helper ที่ใช้ร่วมกัน
- **Infrastructure**: Database connection, repository และ migration
- **Project-NewBorn**: Controller, View และไฟล์ CSS/JavaScript

## 4. Shared classes and helpers

- ก่อนสร้าง class, helper หรือ service ใหม่ ต้องค้นหาและพิจารณา reuse ของที่มีอยู่ก่อน
- ห้ามสร้าง class กลางเพิ่มเพียงเพราะต้องการแยกไฟล์ หาก logic ยังเป็นของ feature เดียวและยังไม่มีการใช้ซ้ำ
- ถ้า logic มีโอกาสถูกเรียกใช้ซ้ำข้ามหน้า, Controller หรือ feature ให้สร้างเป็น class กลางหรือ helper ในชั้นที่เหมาะสม
- ปัจจุบันให้ reuse `PasswordHasher`, `LoginUserMapper` และ `AlertService` เป็นจุดกลางแทนการเขียน logic ซ้ำ
- เลือกตำแหน่งตามหน้าที่: business/helper อยู่ใน `Application`, mapping อยู่ใน `Application/Mappings` และ shared client script อยู่ใน `wwwroot/js/Common`
- ถ้า logic ใช้เฉพาะไฟล์เดียวและไม่มีแนวโน้มใช้ซ้ำ ไม่ต้องสร้าง abstraction เพิ่ม ให้คงไว้ในไฟล์นั้นเพื่อไม่เพิ่มความซับซ้อนโดยไม่จำเป็น
- หลีกเลี่ยงการสร้าง class กลางที่เป็นเพียง wrapper โดยไม่มีพฤติกรรมหรือประโยชน์ร่วมที่ชัดเจน

แนวทางการตัดสินใจ:

1. ใช้ของเดิมที่ตรงหน้าที่ก่อน
2. ถ้ายังไม่มี ให้พิจารณาว่า logic นี้ใช้ซ้ำจริงหรือไม่
3. ถ้าใช้ซ้ำข้าม feature ให้เพิ่ม abstraction ใน layer ที่ถูกต้อง
4. ถ้าเป็น logic เฉพาะ feature ให้เก็บไว้ใน service/controller/file ของ feature นั้น

## 5. Migration Convention

- เก็บไฟล์ไว้ที่ `Infrastructure/Migrations/<Feature>/`
- ตั้งชื่อ migration เป็น version เช่น `V_1_1_1.sql`
- ทุก migration ต้องมี comment เปิดและปิดเฉพาะในไฟล์ migration

```sql
-- ===start migration V_1_1_1===
-- SQL changes
-- ===end migration V_1_1_1===
```

- Migration ต้องรองรับการรันซ้ำโดยไม่สร้าง table หรือ constraint ซ้ำ
- ถ้ามีการเปลี่ยน schema ให้เพิ่ม migration version ใหม่ ไม่แก้ทับ migration เก่า

## 6. Login API Convention

- หน้า Login เก็บ HTML element ไว้ใน `.cshtml`
- JavaScript มีหน้าที่อ่านค่าและส่ง JSON ไปยัง Controller
- URL ของ action ให้ประกาศจาก Razor และส่ง Anti-forgery token เช่น:

```html
<script>
	const createLoginUrl = '@Url.Action("Create", "Login")';
</script>
```

- Request ใช้ JSON เช่น:

```json
{
  "username": "example",
  "password": "example-password"
}
```

- Controller อยู่ที่ `Project-NewBorn/Controllers/Login/LoginController.cs`
- Login ต้อง Query ผู้ใช้ผ่าน Application service และ repository ไม่ Insert ข้อมูลซ้ำ
- Login สำเร็จต้องสร้าง Cookie Authentication และ Redirect ไป `returnUrl` ที่เป็น local URL หรือ Dashboard
- Action Logout ต้องใช้ POST และ `[ValidateAntiForgeryToken]`

## 7. Authentication and authorization

- ลงทะเบียน Cookie Authentication ใน `Program.cs` ก่อน `UseAuthorization()` และเรียก `UseAuthentication()` ก่อนเสมอ
- Cookie ใช้ `HttpOnly`, `Secure`, `SameSite` และมีอายุจำกัด
- Controller/Action ที่ต้อง Login ต้องติด `[Authorize]`
- ผู้ใช้ที่ยังไม่ Login เมื่อเปิดลิงก์โดยตรงต้องถูกส่งกลับหน้า Login
- ห้ามใช้ JavaScript เป็นตัวป้องกันสิทธิ์หลัก การตรวจสิทธิ์ต้องเกิดที่ Server
- `LoginUserMapper` แปลง Domain Entity เป็น `AuthenticatedUser` DTO ก่อนส่งข้อมูลไป Web layer

## 8. Password Storage

- ห้ามเก็บ password แบบ plain text
- ใช้ PBKDF2 hash
- รูปแบบค่าที่จัดเก็บเป็น:

```text
salt.hash
```

- ค่า iteration ใช้ภายในระบบและไม่ต้องนำมาใส่เป็น prefix ในค่าที่บันทึก

## 9. Date and Time

- ค่า `Createdate` และ `Updatedate` ใช้เวลา UTC+7
- ค่า `Createdateutc` และ `Updatedateutc` ใช้เวลา UTC
- ให้คำนวณค่าทั้งสองชุดจาก UTC เดียวกัน

## 10. Naming

- Controller ใช้ชื่อตาม feature เช่น `LoginController`
- Service interface ใช้รูปแบบ `I...Service`
- Repository interface ใช้รูปแบบ `I...Repository`
- URL variable ต้องสื่อความหมาย เช่น `createLoginUrl` ไม่ใช้ชื่อทั่วไป เช่น `url1`

## 11. Validation and Error Handling

- JavaScript ตรวจค่าที่จำเป็นก่อนส่ง request แต่ไม่จำกัดความยาว Password ฝั่ง Client หากไม่มี requirement ทางธุรกิจ
- Backend ต้องตรวจสอบซ้ำเสมอ
- Response ของ JSON ควรมีรูปแบบ `success`, `message` และข้อมูล Redirect เท่าที่จำเป็น
- ห้ามกลืน exception หรือคืนค่า success เมื่อบันทึกไม่สำเร็จ
- ข้อความ Login ผิดควรเป็นข้อความกลาง เช่น `ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง`

## 12. Shared alert service

- ใช้ `wwwroot/js/Common/AlertService.js` เป็นจุดกลางสำหรับ SweetAlert2
- หน้า Login ใช้ Error Popup หลังได้รับผลลัพธ์จาก Server และใช้ข้อความบนปุ่มระหว่างรอแทน Loading Popup
- หน้าอื่นที่ใช้ `_Layout.cshtml` เรียก `AlertService.success()`, `error()`, `warning()`, `info()` หรือ `confirm()` ได้

## 13. Verification Checklist

- Build โปรเจกต์ Web สำเร็จ
- ตรวจ syntax ของ JavaScript
- ตรวจว่า migration ถูกฝังเป็น Embedded Resource
- ตรวจว่า route และ URL action ตรงกับ Controller
- ตรวจว่าไม่มี reference ไปยังไฟล์หรือ Controller ที่ถูกลบ

## 14. Local Configuration

- เก็บค่าร่วมที่ไม่เป็นความลับไว้ใน `appsettings.json`
- เก็บ password, connection string เฉพาะเครื่อง และ secret ไว้ใน `appsettings.Development.json`
- ห้าม commit `appsettings.Development.json` หรือ `appsettings.Local.json`
- ถ้าต้องการ override ค่าในเครื่อง ให้ใช้ชื่อ key เดิมในไฟล์ Development เช่น:

```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Server=localhost;Database=NewBornDb;User Id=sa;Password=local-password;TrustServerCertificate=True;Encrypt=False"
  }
}
```

- ASP.NET Core จะโหลดค่า Development ทับค่าจาก `appsettings.json` อัตโนมัติเมื่อรันใน Development
