using NewBorn.Application.DTOs.Login;

namespace NewBorn.Application.Interfaces.Services.Login;

public interface ILoginService
{
    Task<AuthenticatedUser?> AuthenticateAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
