using NewBorn.Application.DTOs.Login;
using NewBorn.Domain.Entities.Login;

namespace NewBorn.Application.Mappings.Login;

public static class LoginUserMapper
{
    public static AuthenticatedUser ToAuthenticatedUser(this LoginUser user)
    {
        ArgumentNullException.ThrowIfNull(user);

        return new AuthenticatedUser
        {
            Id = user.Id,
            Username = user.Username
        };
    }
}