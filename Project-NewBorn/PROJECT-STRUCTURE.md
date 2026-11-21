# Project-NewBorn Structure

เอกสารนี้สรุปหน้าที่ของโฟลเดอร์และไฟล์หลักในโปรเจคแบบสั้น ๆ
This document gives a simple overview of the main project structure.

## Project overview

โปรเจคเป็น ASP.NET Core MVC web application บน .NET 10
The web project uses MVC pattern with Razor Views.

```text
Project-NewBorn/
├── Project-NewBorn/              # Main web project
│   ├── Controllers/              # รับ HTTP request และเลือก View/response
│   ├── Models/                   # View models และ data models ที่ใช้กับหน้าเว็บ
│   ├── Views/                    # Razor pages สำหรับแสดงผล HTML
│   │   ├── Home/                 # หน้าทั่วไป เช่น Index และ Privacy
│   │   ├── Login/                # หน้า Login
│   │   └── Shared/               # Layout, error page และ shared partials
│   ├── wwwroot/                  # Static files ที่ browser เข้าถึงได้โดยตรง
│   │   ├── css/                  # Stylesheets
│   │   ├── js/                   # Client-side JavaScript
│   │   └── lib/                  # Front-end libraries เช่น Bootstrap และ jQuery
│   ├── Program.cs                # Application startup และ routing configuration
│   ├── appsettings.json          # Application configuration
│   └── NewBorn.Web.csproj        # .NET project settings และ project references
├── Application/                  # Application layer สำหรับ business use cases
├── Domain/                      # Domain layer ของระบบ
├── Infrastructure/              # Data access, logging และ external services
├── NewBorn.Domain/              # Domain project ที่มีอยู่แยกอีกชุดหนึ่ง
├── NewBorn.slnx                 # Solution file
└── README.md                    # Project introduction แบบสั้น
```

## Main web project

### `Program.cs`

ตั้งค่า MVC services และ HTTP request pipeline เช่น HTTPS redirection, routing,
authorization และ static assets.

Configures MVC services and the request pipeline. The default route is:

```text
/{controller=Home}/{action=Index}/{id?}
```

ดังนั้น `/` จะเข้า `HomeController.Index()` และตอนนี้แสดงหน้า Login
The root URL currently renders `Views/Login/Login.cshtml`.

### `Controllers/`

- `HomeController.cs` — จัดการ route หลัก เช่น Home, Privacy และ Error
- `HomeController.Index()` — เป็น entry point ของหน้า root และ render Login view ในปัจจุบัน

Controllers should coordinate requests and responses. Business logic should stay in
Application/Domain layers when the project grows.

### `Models/`

- `ErrorViewModel.cs` — model สำหรับแสดง request id ในหน้า error

สามารถเพิ่ม Login request model ในโฟลเดอร์นี้ได้เมื่อเริ่มทำระบบ login จริง
Add dedicated request/view models here when the login flow becomes functional.

### `Views/`

#### `Views/Login/Login.cshtml`

หน้า Login แบบโครงสร้างพื้นฐาน มี username, password และปุ่ม Login
Minimal login page. It uses `Layout = null` so it does not include the shared navbar/footer.

The page loads:

- `wwwroot/css/Login/Login.css`
- `wwwroot/js/Login/Login.js`

#### `Views/Home/Index.cshtml`

หน้า Home template เดิมจาก ASP.NET Core ปัจจุบันไม่ได้ถูกใช้เป็นหน้า root แล้ว
Default Home template. It is currently not rendered by the root route.

#### `Views/Home/Privacy.cshtml`

หน้า Privacy แบบ template เดิม และใช้ shared layout
Default privacy page that uses the shared layout.

#### `Views/Shared/_Layout.cshtml`

Shared layout สำหรับหน้าที่ใช้ layout ปกติ ประกอบด้วย navbar, footer และ common assets.
It loads Bootstrap, the shared stylesheet, and shared JavaScript.

#### `Views/Shared/_Layout.cshtml.css`

Scoped CSS ของ `_Layout.cshtml` สำหรับ navbar, footer และ utility styles
Scoped stylesheet generated/used for the shared layout.

#### `Views/Shared/_ValidationScriptsPartial.cshtml`

Partial สำหรับโหลด jQuery Validation และ unobtrusive validation
Validation scripts for future forms. It is not currently included by the Login page.

#### `Views/_ViewStart.cshtml`

กำหนดให้ Razor Views ใช้ `_Layout` เป็นค่าเริ่มต้น
Sets `_Layout` as the default layout. Login explicitly overrides this with `Layout = null`.

#### `Views/_ViewImports.cshtml`

รวม namespace และ MVC Tag Helpers ที่ใช้ร่วมกันในทุก Razor View
Provides shared namespaces and MVC Tag Helpers.

## `wwwroot/`

ไฟล์ static ที่ส่งให้ browser โดยตรง เช่น CSS, JavaScript, images และ libraries.
Static web assets served directly to the browser.

### CSS

- `css/Login/Login.css` — style เฉพาะหน้า Login ตอนนี้มีเพียง text color แบบง่าย ๆ
- `css/Style/site.css` — shared site styles สำหรับหน้าที่ใช้ `_Layout`

### JavaScript

- `js/Login/Login.js` — JavaScript ของหน้า Login ตอนนี้ใช้ `console.log` เพื่อทดสอบการโหลดไฟล์
- `js/site.js` — shared site script จาก template ปัจจุบันยังไม่มี logic

### `lib/`

มี front-end libraries ที่ติดตั้งไว้จาก template:

- Bootstrap — ใช้โดย `_Layout.cshtml` สำหรับ navbar และ utility classes
- jQuery — ถูกโหลดโดย shared layout และเป็น dependency ของ validation scripts
- jQuery Validation / Unobtrusive — เตรียมไว้สำหรับ form validation ในอนาคต

ยังไม่ควรลบ library เหล่านี้ทันที เพราะ shared layout และฟอร์มในอนาคตอาจใช้งาน
They can be removed later if the project intentionally switches to plain CSS/JavaScript
and no view uses them anymore.

## Project layers

### `Application/`

Application services และ use cases ของระบบ ควรเป็นที่รวม workflow ของ business operation.
Contains application-level use cases and services.

### `Domain/` และ `NewBorn.Domain/`

Domain models และ business rules ของระบบ
Contains domain concepts and business rules.

ขณะนี้มี domain project สองชุด ควรตรวจสอบภายหลังว่าใช้ชุดใดเป็นหลัก
There are currently two domain projects. Confirm which one is canonical before removing either.

### `Infrastructure/`

การเชื่อมต่อฐานข้อมูล, logging และ external service implementations.
Contains infrastructure implementations such as repositories and logging.

## Web references and cleanup notes

- แก้ path ใน `_Layout.cshtml` จาก `~/css/site.css` เป็น `~/css/Style/site.css` ให้ตรงกับไฟล์จริงแล้ว
- `Login.cshtml` ไม่ใช้ `_Layout` จึงไม่โหลด Bootstrap/jQuery ของ shared layout
- `Home/Index.cshtml` ยังเก็บไว้ได้ หากต้องการใช้เป็นหน้า Home ในอนาคต แต่ตอนนี้เป็น template ที่ไม่ได้ถูกเรียกจาก root
- `js/site.js` ยังว่าง เป็น placeholder; ลบได้เมื่อแน่ใจว่าไม่มี shared script ที่ต้องใช้
- `Views/Shared/_ValidationScriptsPartial.cshtml` ยังเป็นของที่เตรียมไว้ ไม่จำเป็นต้องลบจนกว่าจะยืนยันว่าไม่มี form validation
- `wwwroot/lib` ไม่ควรลบแบบเลือกบางไฟล์เอง เพราะไฟล์ `.min.js`, `.css` และ source map เป็นชุดเดียวกัน ควรลบผ่าน package/library configuration ถ้าไม่ใช้จริง
- `bin/`, `obj/` และ `.vs/` เป็น generated files ไม่ใช่ source code หลัก และไม่ควรนำมาเขียนเอกสารโครงสร้างเชิงพัฒนา

## Recommended next steps

1. เพิ่ม Login view model และ POST action เมื่อเริ่มทำ login จริง
2. เลือก domain project หลักระหว่าง `Domain/` และ `NewBorn.Domain/`
3. ลบ template files ที่ไม่ใช้หลังจากกำหนดหน้าและ flow จริงแล้ว
4. เพิ่ม README usage เช่น วิธี run project และ URL ที่ใช้ทดสอบ
