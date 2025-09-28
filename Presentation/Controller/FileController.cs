using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Contracts;

namespace Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IServiceManager _service;

        public FileController(IServiceManager service)
        {
            _service = service;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            var result = await _service.FileService.UploadFileAsync(file);
            if (result == null)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading file.");
            return Ok("File uploaded successfully.");
        }
        [HttpPost("is-image")]
        public IActionResult IsImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var result = _service.FileService.IsImage(file);
            if (!result)
                return BadRequest("File is not Image");
            return Ok("File is Image");
        }
        [HttpPost("is-video")]
        public IActionResult IsVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            var result = _service.FileService.IsVideo(file);
            if (!result)
                return BadRequest("File is not Video");
            return Ok("File is Video");
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateFile(IFormFile file, [FromQuery] string existingFilePath)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            var result = await _service.FileService.UpdateFile(file, existingFilePath);
            if (!result)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating file.");
            return Ok("File updated successfully.");
        }
    }
}