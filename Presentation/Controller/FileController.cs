using Application.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controller
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
        [RequestSizeLimit(2147483648)] // 2GB
        [RequestFormLimits(MultipartBodyLengthLimit = 2147483648)]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var result = await _service.FileService.UploadFileAsync(file);
            if (result == null)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading file.");
            
            return Ok(new { message = "File uploaded successfully.", filePath = result });
        }

        [HttpPost("validate/image")]
        public IActionResult IsImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var result = _service.FileService.IsImage(file);
            return Ok(new { isImage = result });
        }

        [HttpPost("validate/video")]
        public IActionResult IsVideo(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            
            var result = _service.FileService.IsVideo(file);
            return Ok(new { isVideo = result });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateFile(IFormFile file, [FromQuery] string existingFilePath)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            
            var result = await _service.FileService.UpdateFile(file, existingFilePath);
            if (result == null)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error updating file.");
            
            return Ok(new { message = "File updated successfully.", filePath = result });
        }

        [HttpDelete]
        public IActionResult DeleteFile([FromQuery] string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
                return BadRequest("File path is required.");

            var result = _service.FileService.DeleteFile(filePath);
            if (!result)
                return NotFound("File not found or error deleting file.");

            return NoContent();
        }
    }
}