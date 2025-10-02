using Application.Contracts;
using AutoMapper;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Implementations
{
    public class FileService : IFileService
    {
        IRepositoryManager _manager;
        public  FileService(IRepositoryManager _manager) 
        {
            this._manager = _manager;
        }
        public bool DeleteFile(string filePath)
        {
            return true;
        }

        public bool IsImage(IFormFile file)
        {
            string extension = Path.GetExtension(file.FileName).ToLower();
            string[] permittedExtensions = { ".jpg", ".jpeg", ".png",".bmp"};
            return permittedExtensions.Contains(extension);
        }

        public bool IsVideo(IFormFile file)
        {
            string extension = Path.GetExtension(file.FileName).ToLower();
            string [] permittedExtensions = { ".mp4", ".avi", ".mov", ".wmv" };
            return permittedExtensions.Contains(extension);
        }

        public async Task<bool> UpdateFile(IFormFile file, string existingFilePath)
        {
            if (File.Exists(existingFilePath))
            {
                File.Delete(existingFilePath);
            }
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return true;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return filePath;
            }
            return null;
        }
    }
}
