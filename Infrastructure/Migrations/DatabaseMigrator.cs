using Microsoft.Data.SqlClient;

namespace NewBorn.Infrastructure.Migrations;

public static class DatabaseMigrator
{
    public static async Task ApplyAsync(string connectionString, CancellationToken cancellationToken = default)
    {
        string resourceName = typeof(DatabaseMigrator).Assembly
            .GetManifestResourceNames()
            .Single(name => name.EndsWith("V_1_1_1.sql", StringComparison.Ordinal));

        await using Stream scriptStream = typeof(DatabaseMigrator).Assembly
            .GetManifestResourceStream(resourceName)
            ?? throw new InvalidOperationException("The login migration script could not be loaded.");
        using var reader = new StreamReader(scriptStream);
        string script = await reader.ReadToEndAsync(cancellationToken);

        await using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new SqlCommand(script, connection);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }
}
