namespace Serudemy.Services
{
    public static class CurrentUser
    {
        private static IHttpContextAccessor _httpContextAccessor;
        public static void Configure(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public static int UserId { 
            get 
            {
                var userId = _httpContextAccessor.HttpContext.User?.FindFirst("UserId")?.Value;
                if (userId == null)
                    throw new Exception("User not found");
                return int.TryParse(userId,out var id) ? id : 0;
            } 
        }

    }
}
