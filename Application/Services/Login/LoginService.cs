using NewBorn.Application.DTOs.Login;
using NewBorn.Application.Helpers.Common;
using NewBorn.Application.Interfaces.Repositories.Login;
using NewBorn.Application.Interfaces.Services.Login;
using NewBorn.Application.Mappings.Login;
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

    public async Task<AuthenticatedUser?> AuthenticateAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        string username = request.Username.Trim();
        LoginUser? user = await _loginRepository.FindByUsernameAsync(username, cancellationToken);
        if (user is null || !_passwordHasher.Verify(request.Password, user.Password))
        {
            return null;
        }

        return user.ToAuthenticatedUser();
    }
}
