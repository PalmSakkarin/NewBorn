namespace NewBorn.Domain.Entities;

public sealed class LoginUser
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public DateTime Created { get; set; }
}
