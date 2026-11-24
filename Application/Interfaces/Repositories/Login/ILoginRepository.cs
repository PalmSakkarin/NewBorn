using NewBorn.Domain.Entities.Login;

namespace NewBorn.Application.Interfaces.Repositories.Login;

public interface ILoginRepository
{
    Task<LoginUser?> FindByUsernameAsync(string username, CancellationToken cancellationToken = default);
}
