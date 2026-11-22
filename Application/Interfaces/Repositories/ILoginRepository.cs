using NewBorn.Domain.Entities;

namespace NewBorn.Application.Interfaces.Repositories;

public interface ILoginRepository
{
    Task CreateAsync(LoginUser user, CancellationToken cancellationToken = default);
}
