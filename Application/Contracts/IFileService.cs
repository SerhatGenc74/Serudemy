using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts
{
    public interface IFileService
    {
        public Task<string> UploadFileAsync(IFormFile file);
        public bool DeleteFile(string filePath);
        public bool IsImage(IFormFile file);
        public bool IsVideo(IFormFile file);
        public Task<string?> UpdateFile(IFormFile file, string existingFilePath);
    }
}
