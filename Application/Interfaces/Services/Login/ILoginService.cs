using NewBorn.Application.DTOs.Login;

namespace NewBorn.Application.Interfaces.Services.Login;

public interface ILoginService
{
    Task CreateAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
