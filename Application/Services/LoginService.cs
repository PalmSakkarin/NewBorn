using NewBorn.Application.DTOs;
using NewBorn.Application.Helpers;
using NewBorn.Application.Interfaces.Repositories;
using NewBorn.Application.Interfaces.Services;
using NewBorn.Domain.Entities;

namespace NewBorn.Application.Services;

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
