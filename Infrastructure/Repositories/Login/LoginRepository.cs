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

    public async Task CreateAsync(LoginUser user, CancellationToken cancellationToken = default)
    {
        const string sql = """
            INSERT INTO dbo.[User]
                (Username, [Password], Createdate, Updatedate, Createby, Updateby, Createdateutc, Updatedateutc)
            VALUES
                (@Username, @Password, @Createdate, @Updatedate, @Createby, @Updateby, @CreatedateUtc, @UpdatedateUtc);
            """;

        await using SqlConnection connection = _connectionFactory.Create();
        await using var command = new SqlCommand(sql, connection);
        command.Parameters.Add("@Username", System.Data.SqlDbType.NVarChar, 100).Value = user.Username;
        command.Parameters.Add("@Password", System.Data.SqlDbType.NVarChar, 200).Value = user.Password;
        command.Parameters.Add("@Createdate", System.Data.SqlDbType.DateTime2).Value = user.Createdate;
        command.Parameters.Add("@Updatedate", System.Data.SqlDbType.DateTime2).Value = user.Updatedate;
        command.Parameters.Add("@Createby", System.Data.SqlDbType.NVarChar, 100).Value = (object?)user.Createby ?? DBNull.Value;
        command.Parameters.Add("@Updateby", System.Data.SqlDbType.NVarChar, 100).Value = (object?)user.Updateby ?? DBNull.Value;
        command.Parameters.Add("@CreatedateUtc", System.Data.SqlDbType.DateTime2).Value = user.CreatedateUtc;
        command.Parameters.Add("@UpdatedateUtc", System.Data.SqlDbType.DateTime2).Value = user.UpdatedateUtc;

        await connection.OpenAsync(cancellationToken);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }
}
