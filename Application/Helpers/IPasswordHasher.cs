namespace NewBorn.Application.Helpers;

public interface IPasswordHasher
{
    string Hash(string password);
}
