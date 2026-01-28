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
                var extension = Path.GetExtension(file.FileName);

                if (IsVideo(file))
                {
                    // Delete existing file if it exists
                    if (!string.IsNullOrEmpty(existingFilePath))
                    {
                        var fullExistingPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads/videos/", existingFilePath.TrimStart('/'));
                        if (File.Exists(fullExistingPath))
                        {
                            File.Delete(fullExistingPath);
                        }
                    }

                    // Save new file
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "videos", file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Return the database path
                    var dbPath = Path.Combine("/uploads/videos", file.FileName);
                    return dbPath;
                }
                else
                {
                    // Delete existing file if it exists
                    if (!string.IsNullOrEmpty(existingFilePath))
                    {
                        var fullExistingPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads/images", existingFilePath.TrimStart('/'));
                        if (File.Exists(fullExistingPath))
                        {
                            File.Delete(fullExistingPath);
                        }
                    }

                    // Save new file
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "images", file.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Return web-compatible path
                    return $"/uploads/images/{file.FileName}";
                }
                   
            }
            catch
            {
                return null;
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var extension = Path.GetExtension(file.FileName).ToLower();
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            
            string folder;
            if (IsVideo(file))
            {
                folder = "videos";
            }
            else if (IsImage(file))
            {
                folder = "images";
            }
            else
            {
                return null; // Desteklenmeyen dosya tipi
            }

            // Klasör yolunu oluştur
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", folder);
            
            // Klasör yoksa oluştur
            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Dosyayı kaydet
            var filePath = Path.Combine(uploadsPath, uniqueFileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Web-uyumlu path döndür
            return $"/uploads/{folder}/{uniqueFileName}";
        }
    }
}
