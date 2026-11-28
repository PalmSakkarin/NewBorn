# AGENTS.md — NewBorn Web project guide

## Mandatory instructions for AI agents

ก่อนเริ่มงานทุกครั้ง AI ต้องอ่านเอกสารทั้งหมดนี้ตามลำดับ:

1. `Project-NewBorn/AGENTS.md`
2. `Project-NewBorn/CLAUDE.md`
3. `Project-NewBorn/README/skill.md`

หากมีไฟล์ instruction ระดับ repository หรือระดับโฟลเดอร์ที่อยู่เหนือ/ใกล้กว่านี้ ให้ตรวจสอบและปฏิบัติตามร่วมกันด้วย หากคำสั่งขัดแย้งกัน ให้ใช้คำสั่งที่มี scope ใกล้ไฟล์เป้าหมายกว่า และหยุดถามเมื่อไม่สามารถตัดสินได้อย่างปลอดภัย

กฎนี้ใช้กับ AI ทุก model ไม่จำกัดเฉพาะ Claude โดย Claude ต้องอ่าน `CLAUDE.md` เพิ่มตามชื่อไฟล์ และ AI ทุกตัวต้องอ่าน `AGENTS.md` กับ `README/skill.md` เช่นเดียวกัน

เอกสารนี้เป็นแนวทางสำหรับการแก้ไขและเพิ่มฟีเจอร์ในโปรเจกต์ NewBorn เพื่อให้โครงสร้างสม่ำเสมอ ดูแลต่อได้ง่าย และลดการเขียนซ้ำ

## โครงสร้างหลัก

- `Project-NewBorn/Controllers/` — MVC controllers แยกตาม feature เช่น `Controllers/Users/UsersController.cs`
- `Project-NewBorn/Views/` — Razor views แยกตาม feature และ layout อยู่ที่ `Views/Shared/`
- `Project-NewBorn/wwwroot/css/Common/` — CSS ที่ใช้ร่วมกันทุกหน้าหรือหลาย feature
- `Project-NewBorn/wwwroot/css/<Feature>/` — CSS เฉพาะ feature เช่น `Users/Users.css`
- `Project-NewBorn/wwwroot/js/Common/` — JavaScript helper/service ที่ใช้ร่วมกัน
- `Project-NewBorn/wwwroot/js/<Feature>/` — JavaScript เฉพาะ feature
- `Project-NewBorn/README/UI-Standard.md` — มาตรฐาน UI กลางและ template สำหรับ list/table
- `Application/` — DTOs, interfaces, services และ application logic
- `Domain/` — entities และกฎของโดเมน
- `Infrastructure/` — database, repositories และ external integrations

## กฎการสร้างไฟล์

1. วางไฟล์ตาม feature และ layer ที่ถูกต้อง ห้ามรวมทุกอย่างไว้ในไฟล์เดียวหรือโฟลเดอร์ root แบบไม่มีเหตุผล
2. Feature ใหม่ควรมีโครงสร้างแยกของตัวเอง เช่น Controller, View, CSS และ JS ตามความจำเป็น
3. ใช้ชื่อ PascalCase สำหรับ C# และชื่อ feature ที่สอดคล้องกันใน View/CSS/JS เช่น `UsersController`, `Views/Users`, `css/Users`, `js/Users`
4. ใช้ `_DashboardLayout.cshtml` สำหรับหน้าหลัง login และเพิ่ม asset เฉพาะหน้าผ่าน `@section Styles`/`@section Scripts`
5. ห้ามสร้างไฟล์ซ้ำกับ helper หรือ component ที่มีอยู่แล้ว ให้ค้นหาของเดิมก่อนเสมอ

## กฎการใช้ CSS

1. โหลด `wwwroot/css/Common/Common.css` ก่อน CSS ของ feature
2. ใช้ design tokens กลาง เช่น `var(--y)`, `var(--card)`, `var(--line)`, `var(--field)` แทนการ hard-code สีซ้ำ
3. ถ้า style ถูกใช้ตั้งแต่ 2 feature ขึ้นไป ให้ย้ายไป `Common.css` หรือสร้าง component class กลางที่มีชื่อสื่อความหมาย
4. CSS เฉพาะหน้าให้ใช้ prefix หรือชื่อที่บอก feature เช่น `.users-page`, `.users-panel`, `.user-modal` เพื่อป้องกันชนกับหน้าอื่น
5. ก่อนสร้าง class ใหม่ ให้ตรวจสอบ `.btn-nb`, `.ico`, focus ring, spacing และ component กลางที่มีอยู่แล้ว
6. รักษา responsive behavior, dark mode และ `prefers-reduced-motion` ของระบบเดิม

## กฎการใช้ JavaScript

1. Logic ของ feature ให้อยู่ใน `wwwroot/js/<Feature>/` และ helper ที่ใช้ซ้ำให้อยู่ใน `wwwroot/js/Common/`
2. ห้าม copy ฟังก์ชัน escape, toast, modal, validation หรือ formatting ถ้ามี helper กลางที่เหมาะสมอยู่แล้ว
3. แยกข้อมูล mock, rendering, event handlers และ validation ให้ชัดเจน
4. ถ้าเป็น mock UI ให้ระบุให้ชัดว่าไม่บันทึกฐานข้อมูล และอย่าแอบเพิ่ม API/DB integration โดยไม่ได้ร้องขอ
5. ตรวจสอบ input ที่นำไปสร้าง HTML และใช้ escaping/DOM API อย่างถูกต้อง

## กฎการแก้ไข MVC/C#

1. Controller รับผิดชอบ routing/authorization และเรียก application service ไม่ใส่ business logic ยาว ๆ ใน controller
2. ห้ามให้ View ติดต่อ repository หรือ database โดยตรง
3. โค้ดที่เป็น business logic ให้อยู่ Application/Domain ตามความเหมาะสม
4. ใช้ `[Authorize]` กับหน้าที่ต้อง login และตรวจสอบ authorization ก่อนเพิ่มข้อมูลที่เป็น sensitive
5. รักษา nullable/type safety และใช้ naming/formatting ตามรูปแบบเดิมของโปรเจกต์

## ขั้นตอนก่อนส่งงาน

- ตรวจสอบว่าไฟล์อยู่ในโฟลเดอร์ที่ถูกต้อง
- ค้นหาการใช้งาน class/helper เดิมก่อนเพิ่มของใหม่
- ตรวจสอบว่า layout โหลด common asset ก่อน feature asset
- รัน `dotnet build Project-NewBorn/NewBorn.Web.csproj`
- จัด format ไฟล์ของทุกหน้าให้เรียบร้อยก่อน build ตาม `README/UI-Standard.md`
- ตรวจ syntax ของ JavaScript เมื่อมีการแก้ JS
- สรุปไฟล์ที่แก้และบอกชัดเจนว่าส่วนใดเป็น mock หรือยังไม่ต่อฐานข้อมูล

## สิ่งที่ควรหลีกเลี่ยง

- ไม่สร้างไฟล์ซ้ำเพียงเพราะชื่อ feature ต่างกัน ถ้าพฤติกรรมเป็น component กลาง
- ไม่ย้าย style ที่เป็นเฉพาะหน้าไป common เพียงเพื่อให้ไฟล์สั้นลง
- ไม่แก้ไฟล์หรือ refactor unrelated code
- ไม่ hard-code secret, connection string หรือข้อมูลส่วนตัว
- ไม่ใช้ broad catch หรือซ่อน error ด้วย fallback ที่ทำให้ดูเหมือนสำเร็จ
