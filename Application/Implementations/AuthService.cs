using Application.Contracts;
using AutoMapper;
using Contracts.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _manager;
        private readonly IConfiguration _configuration;

        public AuthService(IRepositoryManager manager, IMapper mapper, IConfiguration configuration)
        {
            _manager = manager;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResultDto> SignInAsync(string email, string password)
        {
            try
            {
                var account = await _manager.Account.FindSingleByConditionAsync(
                    a => a.UserEmail == email && a.Password == password, trackChanges: false);

                if (account == null)
                {
                    return new AuthResultDto(false, null, null, null, "Geçersiz email veya şifre", null);
                }

                var accountRole = await _manager.AccountRole.FindSingleByConditionAsync(
                    ar => ar.AccountId == account.Id, trackChanges: false);

                if (accountRole == null)
                {
                    return new AuthResultDto(false, null, null, null, "Kullanıcıya rol atanmamış", null);
                }

                var role = await _manager.Role.FindSingleByConditionAsync(
                    r => r.Id == accountRole.RoleId, trackChanges: false);

                if (role == null)
                {
                    return new AuthResultDto(false, null, null, null, "Rol bilgisi bulunamadı", null);
                }

                var userInfo = new
                {
                    id = account.Id,
                    name = account.Name,
                    email = account.UserEmail,
                    role = role.Name
                };

                return new AuthResultDto(
                    true, 
                    CreateToken(account,role.Name), 
                    null, // refresh token
                    DateTime.UtcNow.AddHours(24), 
                    "Giriş başarılı", 
                    userInfo);
            }
            catch (Exception ex)
            {
                return new AuthResultDto(false, null, null, null, $"Hata: {ex.Message}", null);
            }
        }

        public async Task<RegisterResultDto> RegisterAsync(AccountCreateDTO request, int defaultRoleId = 3)
        {
            try
            {
                // Email kontrolü - async method kullan
                var emailExists = await _manager.Account.ExistsAsync(a => a.UserEmail == request.UserEmail);
                if (emailExists)
                {
                    return new RegisterResultDto(false, null, "Bu email adresi zaten kullanılıyor");
                }


                try
                {
                    // Yeni hesap oluştur
                    var account = _mapper.Map<Account>(request);
                    account.CreatedAt = DateTime.Now;

                    _manager.Account.Create(account);
                    await _manager.SaveAsync();

                    // Rol ata
                    var accountRole = new AccountRole
                    {
                        AccountId = account.Id,
                        RoleId = defaultRoleId
                    };

                    _manager.AccountRole.Create(accountRole);
                    await _manager.SaveAsync();

                   

                    return new RegisterResultDto(true, account.Id, "Kayıt başarılı");
                }
                catch
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return new RegisterResultDto(false, null, $"Kayıt sırasında hata: {ex.Message}");
            }
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _manager.Account.ExistsAsync(a => a.UserEmail == email);
        }

        private string CreateToken(Account account, string role)
        {
            var claims = new List<Claim>
            { 
                new Claim(ClaimTypes.Name, account.Name),
                new Claim(ClaimTypes.Email, account.UserEmail),
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString())
            };

            // JWT ayarlarını appsettings.json'dan oku
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            var expirationHours = _configuration.GetValue<int>("Jwt:ExpirationHours", 24); // Default 24 saat

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddHours(expirationHours),
                signingCredentials: creds
                );

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.WriteToken(tokenDescriptor);
            return token;
        }

        public Task<bool> LogOutAsync()
        {
            return Task.FromResult(true);
        }
    }
}
