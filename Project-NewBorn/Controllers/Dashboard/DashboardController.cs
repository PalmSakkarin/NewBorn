using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Project_NewBorn.Controllers.Dashboard;

[Authorize]
public sealed class DashboardController : Controller
{
    [HttpGet]
    public IActionResult Index() => View();
}