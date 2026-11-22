using Microsoft.Data.SqlClient;
using NewBorn.Application.Interfaces.Repositories;
using NewBorn.Domain.Entities;
using NewBorn.Infrastructure.Data;

namespace NewBorn.Infrastructure.Repositories;

public sealed class LoginRepository : ILoginRepository
{
    private readonly SqlConnectionFactory _connectionFactory;

    public LoginRepository(SqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task CreateAsync(LoginUser user, CancellationToken cancellationToken = default)
    {
        const string sql = """
            INSERT INTO dbo.LoginUsers (Username, [Password], Created)
            VALUES (@Username, @Password, @Created);
            """;

        await using SqlConnection connection = _connectionFactory.Create();
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar, 100).Value = user.Username;
        command.Parameters.Add("@Password", System.Data.SqlDbType.NVarChar, 200).Value = user.Password;
        command.Parameters.Add("@Created", System.Data.SqlDbType.DateTime2).Value = user.Created;

        await connection.OpenAsync(cancellationToken);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }
}
