namespace NewBorn.Domain.Entities.Login;

public sealed class LoginUser
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    public DateTime Createdate { get; set; }
    public DateTime Updatedate { get; set; }
    public string? Createby { get; set; }
    public string? Updateby { get; set; }
    public DateTime CreatedateUtc { get; set; }
    public DateTime UpdatedateUtc { get; set; }
}
