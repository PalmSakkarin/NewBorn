using NewBorn.Application.DTOs;

namespace NewBorn.Application.Interfaces.Services;

public interface ILoginService
{
    Task CreateAsync(LoginRequest request, CancellationToken cancellationToken = default);
}
