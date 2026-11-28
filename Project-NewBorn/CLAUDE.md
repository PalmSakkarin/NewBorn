# NewBorn Web coding instructions

ก่อนดำเนินการใด ๆ ให้ AI อ่านเอกสารต่อไปนี้ทุกครั้ง:

- `AGENTS.md`
- `CLAUDE.md`
- `README/skill.md`

ข้อกำหนดนี้ใช้กับ AI ทุก model หากเป็น Claude ให้ใช้เอกสารนี้เป็นคำแนะนำเพิ่มเติมจาก `AGENTS.md` และ `README/skill.md` ไม่ใช่ใช้แทนกัน

ให้ปฏิบัติตาม `AGENTS.md` เป็นแนวทางหลักของ repository นี้

หลักสำคัญ:

- สร้างไฟล์ตาม layer และ feature ไม่วางไฟล์ปะปนกัน
- ค้นหาและ reuse class/helper กลางก่อนสร้างของใหม่
- CSS ที่ใช้หลายหน้าให้ไว้ใน `Project-NewBorn/wwwroot/css/Common/` และ CSS เฉพาะหน้าไว้ในโฟลเดอร์ feature
- JavaScript helper ที่ใช้ซ้ำให้ไว้ใน `wwwroot/js/Common/` ส่วน logic เฉพาะหน้าไว้ใน `wwwroot/js/<Feature>/`
- ใช้ design tokens และ component กลางเดิม เช่น `.ico`, `.btn-nb` และ `var(--*)`
- หน้าหลัง login ใช้ `_DashboardLayout.cshtml` และโหลด asset เฉพาะหน้าผ่าน sections
- Mock UI ต้องระบุชัดว่าไม่บันทึกฐานข้อมูล
- หลังแก้ C#/Razor ให้ build โปรเจกต์ และหลังแก้ JS ให้ตรวจ syntax
- หลีกเลี่ยงการแก้ไข unrelated code และห้ามเพิ่ม secret ลง repository
