using Application.Contracts;

namespace Serudemy.Services;

/// <summary>
/// Zamanlanmış dersleri otomatik olarak yayınlayan background service.
/// Her dakika çalışır ve yayın tarihi geçmiş dersleri yayına alır.
/// </summary>
public class LectureSchedulerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<LectureSchedulerService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // Her dakika kontrol et

    public LectureSchedulerService(
        IServiceProvider serviceProvider,
        ILogger<LectureSchedulerService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Ders Zamanlayıcı Servisi başlatıldı.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await PublishScheduledLecturesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Zamanlanmış dersler yayınlanırken hata oluştu.");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("Ders Zamanlayıcı Servisi durduruldu.");
    }

    private async Task PublishScheduledLecturesAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var lectureService = scope.ServiceProvider.GetRequiredService<ILectureService>();

        try
        {
            var publishedCount = lectureService.PublishScheduledLectures();
            
            if (publishedCount > 0)
            {
                _logger.LogInformation("{Count} adet zamanlanmış ders yayına alındı.", publishedCount);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Zamanlanmış dersleri yayınlama işlemi başarısız oldu.");
        }
        
        await Task.CompletedTask;
    }
}
