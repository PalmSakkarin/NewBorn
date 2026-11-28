using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Project_NewBorn.Controllers.Users;

[Authorize]
[Route("Users")]
public sealed class UsersController : Controller
{
    [HttpGet("")]
    public IActionResult Index() => View();
}
