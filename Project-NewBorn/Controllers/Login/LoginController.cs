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
    public IActionResult Index() => View("~/Views/Login/Login.cshtml");

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {

        await _loginService.CreateAsync(request, cancellationToken);

        return Ok(new
        {
            success = true,
            message = "บันทึกข้อมูลผู้ใช้ลงฐานข้อมูลแล้ว"
        });
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
