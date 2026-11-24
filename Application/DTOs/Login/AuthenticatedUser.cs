namespace NewBorn.Application.DTOs.Login;

public sealed class AuthenticatedUser
{
    public required int Id { get; init; }
    public required string Username { get; init; }
}