using NewBorn.Application.DTOs.Login;
using NewBorn.Application.Helpers.Common;
using NewBorn.Application.Interfaces.Repositories.Login;
using NewBorn.Application.Interfaces.Services.Login;
using NewBorn.Domain.Entities.Login;

namespace NewBorn.Application.Services.Login;

public sealed class LoginService : ILoginService
{
    private readonly ILoginRepository _loginRepository;
    private readonly IPasswordHasher _passwordHasher;

    public LoginService(ILoginRepository loginRepository, IPasswordHasher passwordHasher)
    {
        _loginRepository = loginRepository;
        _passwordHasher = passwordHasher;
    }

    public Task CreateAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var user = new LoginUser
        {
            Username = request.Username.Trim(),
            Password = _passwordHasher.Hash(request.Password),
            Created = DateTime.UtcNow.AddHours(7)
        };

        return _loginRepository.CreateAsync(user, cancellationToken);
    }
}
