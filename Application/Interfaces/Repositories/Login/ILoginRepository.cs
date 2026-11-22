using NewBorn.Domain.Entities.Login;

namespace NewBorn.Application.Interfaces.Repositories.Login;

public interface ILoginRepository
{
    Task CreateAsync(LoginUser user, CancellationToken cancellationToken = default);
}
