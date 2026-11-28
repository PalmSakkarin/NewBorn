# NewBorn UI Standard

เอกสารนี้เป็นมาตรฐานกลางสำหรับหน้าเว็บหลังเข้าสู่ระบบ และเป็นแหล่งอ้างอิงหลักเมื่อสร้างหรือปรับหน้าใหม่

## 1. Reference page

ให้ยึดหน้า Users เป็นตัวอย่างหลัก:

- View: `Views/Users/Index.cshtml`
- Page style: `wwwroot/css/Users/Users.css`
- Shared list style: `wwwroot/css/Common/List.css`
- Shared tokens, buttons และ focus state: `wwwroot/css/Common/Common.css`

ไม่ต้องเลียนแบบ UI จาก Material หรือ component library อื่น หากทำให้รูปแบบต่างจากหน้า Users

## 2. List/table template

หน้า list ใหม่ควรใช้โครงสร้างและ class กลางต่อไปนี้ แล้วเติม class prefix ของ feature เมื่อจำเป็น:

```html
<section class="<feature>-page nb-list-card">
	<div class="row g-3 align-items-center nb-list-toolbar">
		<div class="nb-list-search col-12 col-md-10">
			<label class="visually-hidden" for="query">ค้นหา</label>
			<input class="form-control" id="query" type="search" placeholder="ค้นหา" autocomplete="off">
		</div>
		<div class="col-12 col-md-2">
			<button class="btn-nb btn-green w-100" type="button">เพิ่มรายการ</button>
		</div>
	</div>

	<p class="nb-list-count" aria-live="polite"></p>

	<div class="nb-table-wrap">
		<table class="nb-table">
			<thead>
				<tr>
					<th scope="col">รายการ</th>
					<th scope="col">สถานะ</th>
					<th scope="col" class="text-end">จัดการ</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td data-hide-mobile>1</td>
					<td>ตัวอย่างรายการ</td>
					<td data-actions>
						<button class="nb-table-action" type="button">แก้ไข</button>
						<button class="nb-table-action is-danger" type="button">ลบ</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="nb-pagination">
		<label class="nb-page-size" for="pageSize">แสดง <select class="form-select" id="pageSize"></select> รายการ</label>
		<div class="nb-page-controls">
			<button class="nb-page-button" type="button">ก่อนหน้า</button>
			<span aria-live="polite">หน้า 1 / 1</span>
			<button class="nb-page-button" type="button">ถัดไป</button>
		</div>
	</div>
</section>
```

### ตารางและ card

- ใช้ `nb-list-card` เป็น card หลัก: พื้นขาว, ขอบ `var(--line)`, มุมมน 20px และ shadow เบา
- ใช้ `nb-table-wrap` เพื่อให้ตาราง scroll ได้และหัวตาราง sticky
- หัวตารางใช้สีหลัก `var(--y)`
- แถวสลับใช้ `#FBF8EC` และ hover ใช้ `#FFF1B8`
- หน้าจอเล็กจะแสดงแต่ละแถวเป็น card อัตโนมัติ ไม่ทำให้ตารางล้นจอ
- สถานะให้ใช้สีตามความหมาย เช่น เขียวสำหรับใช้งาน และแดงสำหรับลบ/ข้อผิดพลาด

## 3. Buttons and inputs

### Buttons

- ปุ่มหลักใช้ `.btn-nb`; ปุ่มยืนยัน/บันทึกใช้ `.btn-nb.btn-green`
- ปุ่มรองใช้ `.btn-ol`
- ปุ่มลบใช้ `.btn-ol.btn-red` หรือ action ในตารางใช้ `.nb-table-action.is-danger`
- ปุ่ม action ในตารางใช้ `.nb-table-action` และมี icon จาก symbol กลางเมื่อมี icon ที่เหมาะสม
- ห้ามสร้างรูปแบบปุ่มใหม่ซ้ำกับ class กลางโดยไม่จำเป็น

### Inputs

- ใช้ Bootstrap `.form-control` และ `.form-select` เป็นฐาน
- ช่องค้นหาใน list ใช้ `.nb-list-search .form-control`
- ใช้ label ที่สัมพันธ์กับ input ทุกครั้ง และใช้ `autocomplete` ให้เหมาะกับข้อมูล
- focus state ต้องเป็นวงแหวนสีเหลืองตาม `Common.css`
- ข้อความ validation ใช้สี `var(--err)` และไม่ซ่อน error ที่ผู้ใช้ควรเห็น

## 4. Color tokens

| ใช้กับ | Token |
|---|---|
| สีหลัก/หัวตาราง/hover focus | `--y` |
| พื้นหลังหน้า | `--bg` |
| พื้น card/input | `--card`, `--field` |
| ตัวอักษรหลัก/รอง | `--tx`, `--mu` |
| เส้นขอบ | `--line` |
| สำเร็จ/ใช้งาน | `--green`, `--green-bg` |
| ลบ/ข้อผิดพลาด | `--red`, `--red-bg`, `--err` |
| action ข้อมูล | `--blue`, `--blue-bg` |

หลีกเลี่ยงการกำหนดสีใหม่ในหน้า feature หากมี token ที่ตรงความหมายอยู่แล้ว

## 5. Format และ build

ทุกครั้งก่อน build ต้อง format ไฟล์ของทุกหน้าและไฟล์ที่เกี่ยวข้องก่อนเสมอ เพื่อไม่ให้รูปแบบแต่ละหน้าแตกต่างกัน:

```powershell
dotnet format NewBorn.slnx --include Project-NewBorn\Views Project-NewBorn\wwwroot
dotnet build Project-NewBorn\NewBorn.Web.csproj
```

หาก `dotnet format` ไม่รองรับไฟล์ Razor/CSS/JavaScript ในเครื่อง ให้จัดรูปแบบตามโครงสร้างของหน้า Users และตรวจด้วยตนเองก่อน build โดยต้องคง line ending และ encoding เดิมของไฟล์

หลังแก้ JavaScript ให้ตรวจ syntax เพิ่ม และหลังแก้ Razor/C# ให้ build โปรเจกต์ Web ทุกครั้ง