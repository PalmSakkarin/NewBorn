# NewBorn Project Skill

## 1. Purpose

เอกสารแนวทางสำหรับพัฒนาโปรเจกต์ NewBorn ให้โครงสร้างและรูปแบบการทำงานสอดคล้องกัน

## 2. Project Structure

```text
NewBorn/
├── Application/
│   ├── DTOs/
│   ├── Helpers/
│   ├── Interfaces/
│   └── Services/
├── Domain/
│   ├── Entities/
│   └── NewBorn.Domain.csproj
├── Infrastructure/
│   ├── Data/
│   ├── Migrations/
│   └── Repositories/
└── Project-NewBorn/
	├── Controllers/
	├── Views/
	└── wwwroot/
		├── css/
		└── js/
```

## 3. Layer Responsibilities

- **Domain**: Entity และกฎทางธุรกิจที่ไม่ผูกกับฐานข้อมูลหรือ Web
- **Application**: DTO, interface, service และ helper ที่ใช้ร่วมกัน
- **Infrastructure**: Database connection, repository และ migration
- **Project-NewBorn**: Controller, View และไฟล์ CSS/JavaScript

## 4. Migration Convention

- เก็บไฟล์ไว้ที่ `Infrastructure/Migrations/`
- ตั้งชื่อ migration เป็น version เช่น `V_1_1_1.sql`
- ทุก migration ต้องมี comment เปิดและปิดเฉพาะในไฟล์ migration

```sql
-- ===start migration V_1_1_1===
-- SQL changes
-- ===end migration V_1_1_1===
```

- Migration ต้องรองรับการรันซ้ำโดยไม่สร้าง table หรือ constraint ซ้ำ
- ถ้ามีการเปลี่ยน schema ให้เพิ่ม migration version ใหม่ ไม่แก้ทับ migration เก่า

## 5. Login API Convention

- หน้า Login เก็บ HTML element ไว้ใน `.cshtml`
- JavaScript มีหน้าที่อ่านค่าและส่ง JSON ไปยัง Controller
- URL ของ action ให้ประกาศจาก Razor เช่น:

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

- Controller อยู่ที่ `Project-NewBorn/Controllers/LoginController.cs`
- การบันทึกข้อมูลให้เรียกผ่าน Application service และ repository

## 6. Password Storage

- ห้ามเก็บ password แบบ plain text
- ใช้ PBKDF2 hash
- รูปแบบค่าที่จัดเก็บเป็น:

```text
salt.hash
```

- ค่า iteration ใช้ภายในระบบและไม่ต้องนำมาใส่เป็น prefix ในค่าที่บันทึก

## 7. Date and Time

- ค่า `Created` ใช้เวลา UTC+7
- ให้คำนวณจาก UTC เช่น `DateTime.UtcNow.AddHours(7)`

## 8. Naming

- Controller ใช้ชื่อตาม feature เช่น `LoginController`
- Service interface ใช้รูปแบบ `I...Service`
- Repository interface ใช้รูปแบบ `I...Repository`
- URL variable ต้องสื่อความหมาย เช่น `createLoginUrl` ไม่ใช้ชื่อทั่วไป เช่น `url1`

## 9. Validation and Error Handling

- JavaScript ตรวจค่าที่จำเป็นก่อนส่ง request
- Backend ต้องตรวจสอบซ้ำเสมอ
- Response ของ JSON ควรมีรูปแบบ `success` และ `message`
- ห้ามกลืน exception หรือคืนค่า success เมื่อบันทึกไม่สำเร็จ

## 10. Verification Checklist

- Build โปรเจกต์ Web สำเร็จ
- ตรวจ syntax ของ JavaScript
- ตรวจว่า migration ถูกฝังเป็น Embedded Resource
- ตรวจว่า route และ URL action ตรงกับ Controller
- ตรวจว่าไม่มี reference ไปยังไฟล์หรือ Controller ที่ถูกลบ
