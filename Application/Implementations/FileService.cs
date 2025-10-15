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

        public async Task<string?> UpdateFile(IFormFile file, string existingFilePath)
        {
            try
            {
                // Delete existing file if it exists
                if (!string.IsNullOrEmpty(existingFilePath))
                {
                    var fullExistingPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", existingFilePath.TrimStart('/'));
                    if (File.Exists(fullExistingPath))
                    {
                        File.Delete(fullExistingPath);
                    }
                }
                
                // Save new file
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                
                // Return the database path
                var dbPath = Path.Combine("/images/", file.FileName);
                return dbPath;
            }
            catch
            {
                return null;
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName);
            if (file != null && file.Length > 0)
            {
                if (extension == ".mp4")
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    var dbPath = Path.Combine("/videos/", file.FileName);
                    return dbPath;
                }
                else
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    var dbPath = Path.Combine("/images/", file.FileName);
                    return dbPath;
                }
               
            }
            return "";
        }
    }
}
