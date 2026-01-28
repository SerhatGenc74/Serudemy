using Application.Contracts;
using Application.Implementations;
using AutoMapper;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Presentation.Controller;
using Serudemy.Services;
using Serudemy.Utilities.AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Kestrel sunucu ayarları - büyük dosya yüklemeleri için
builder.Services.Configure<Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServerOptions>(options =>
{
    options.Limits.MaxRequestBodySize = 2147483648; // 2GB (2 * 1024 * 1024 * 1024)
    options.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(10);
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(10);
});

// Form options - multipart form data için
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = 2147483648; // 2GB
    options.MultipartHeadersLengthLimit = int.MaxValue;
});

builder.Services.AddDbContext<SerudemyContext>();

var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(configureOptions =>
    {
        configureOptions.RequireHttpsMetadata = false;
        configureOptions.SaveToken = true;
        configureOptions.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(jwtSettings["Key"])),
            ClockSkew = TimeSpan.Zero
        };
    });


builder.Services.AddControllers()
    .AddApplicationPart(typeof(CourseController).Assembly);


builder.Services.AddCors(opt =>
{
    opt.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true);
    });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();   

// Infrastructure layer registration
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

// Application layer services registration (Clean Architecture DI)
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IAccountRoleService, AccountRoleService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ILectureService, LectureService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IStudentCourseService, StudentCourseService>();
builder.Services.AddScoped<IStudentProgressService, StudentProgressService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IFacultyService, FacultyService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// ServiceManager aggregates all services (receives them via DI)
builder.Services.AddScoped<IServiceManager, ServiceManager>();

// Background Services - Zamanlanmış dersleri otomatik yayınla
builder.Services.AddHostedService<LectureSchedulerService>();

builder.Services.AddAutoMapper(typeof(MappingProfile));
var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// HTTPS redirect removed for development (prevents video streaming issues)
// app.UseHttpsRedirection();
app.UseStaticFiles();

// Uploads klasörleri oluştur
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

var imagesPath = Path.Combine(uploadsPath, "images");
if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);
}

var videosPath = Path.Combine(uploadsPath, "videos");
if (!Directory.Exists(videosPath))
{
    Directory.CreateDirectory(videosPath);
}

// Static file serving for uploads
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});


app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
