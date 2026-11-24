using Microsoft.Data.SqlClient;
using NewBorn.Application.Interfaces.Repositories.Login;
using NewBorn.Domain.Entities.Login;
using NewBorn.Infrastructure.Data.Common;

namespace NewBorn.Infrastructure.Repositories.Login;

public sealed class LoginRepository : ILoginRepository
{
    private readonly SqlConnectionFactory _connectionFactory;

    public LoginRepository(SqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<LoginUser?> FindByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        const string sql = """
            SELECT TOP (1)
                Id, Username, Password, Createdate, Updatedate,
                Createby, Updateby, Createdateutc, Updatedateutc
            FROM dbo.[User]
            WHERE 1=1 AND Username = @Username;
            """;

        await using SqlConnection connection = _connectionFactory.Create();
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar, 100).Value = username;

        await connection.OpenAsync(cancellationToken);
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return new LoginUser
        {
            Id = reader.GetInt32(0),
            Username = reader.GetString(1),
            Password = reader.GetString(2),
            Createdate = reader.GetDateTime(3),
            Updatedate = reader.GetDateTime(4),
            Createby = reader.IsDBNull(5) ? null : reader.GetString(5),
            Updateby = reader.IsDBNull(6) ? null : reader.GetString(6),
            CreatedateUtc = reader.GetDateTime(7),
            UpdatedateUtc = reader.GetDateTime(8)
        };
    }
}
