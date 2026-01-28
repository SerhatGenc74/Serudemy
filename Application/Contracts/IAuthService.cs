using Contracts.DTOs;

namespace Application.Contracts
{
    public interface IAuthService
    {
        Task<AuthResultDto> SignInAsync(string email, string password);
        Task<RegisterResultDto> RegisterAsync(AccountCreateDTO request, int defaultRoleId = 3);
        Task<bool> LogOutAsync();
        //Task<TokenPairDto?> RefreshTokenAsync(string refreshToken);
        //Task<bool> RevokeRefreshTokenAsync(string refreshToken);
        //Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }

    public record AuthResultDto(
        bool Success,
        string? AccessToken,
        string? RefreshToken,   
        DateTime? ExpiresAt,
        string? Message,
        object? User);

    public record RegisterResultDto(bool Success, int? UserId, string? Message);

}
