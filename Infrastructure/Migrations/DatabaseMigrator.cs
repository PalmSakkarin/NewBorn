using Microsoft.Data.SqlClient;
using System.Text.RegularExpressions;

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

        var masterConnectionBuilder = new SqlConnectionStringBuilder(connectionString)
        {
            InitialCatalog = "master"
        };

        await using var connection = new SqlConnection(masterConnectionBuilder.ConnectionString);
        await connection.OpenAsync(cancellationToken);
        string[] batches = Regex.Split(script, @"^\s*GO\s*$", RegexOptions.Multiline | RegexOptions.IgnoreCase);

        foreach (string batch in batches)
        {
            if (string.IsNullOrWhiteSpace(batch))
            {
                continue;
            }

            await using var command = new SqlCommand(batch, connection);
            await command.ExecuteNonQueryAsync(cancellationToken);
        }
    }
}
