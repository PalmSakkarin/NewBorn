using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using NewBorn.Application.DTOs.Login;
using NewBorn.Application.Interfaces.Services.Login;
using Project_NewBorn.Models;
using System.Diagnostics;

namespace Project_NewBorn.Controllers.Login;

public sealed class LoginController : Controller
{
    private readonly ILoginService _loginService;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpGet]
    public IActionResult Index(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return LocalRedirect(IsLocalUrl(returnUrl) ? returnUrl! : "/Dashboard");
        }

        ViewData["ReturnUrl"] = IsLocalUrl(returnUrl) ? returnUrl : string.Empty;
        return View("~/Views/Login/Login.cshtml");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([FromBody] LoginRequest request, string? returnUrl, CancellationToken cancellationToken)
    {
        if (request is null || !ModelState.IsValid)
        {
            return BadRequest(new
            {
                success = false,
                message = "กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน"
            });
        }

        var user = await _loginService.AuthenticateAsync(request, cancellationToken);
        if (user is null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            });
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity),
            new AuthenticationProperties { IsPersistent = false });

        return Ok(new
        {
            success = true,
            message = "เข้าสู่ระบบสำเร็จ",
            redirectUrl = IsLocalUrl(returnUrl) ? returnUrl : Url.Action("Index", "Dashboard")
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Index));
    }

    private bool IsLocalUrl(string? url) => !string.IsNullOrWhiteSpace(url) && Url.IsLocalUrl(url);

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
