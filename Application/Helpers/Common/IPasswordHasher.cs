namespace NewBorn.Application.Helpers.Common;

public interface IPasswordHasher
{
    string Hash(string password);
}
