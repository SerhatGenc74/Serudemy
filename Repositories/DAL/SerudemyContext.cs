using System;
using System.Collections.Generic;
using Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace Serudemy.DAL;

public partial class SerudemyContext : DbContext
{
    public SerudemyContext()
    {
    }

    public SerudemyContext(DbContextOptions<SerudemyContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<StudentCourse> StudentCourses { get; set; }

    public virtual DbSet<AccountRole> AccountRoles { get; set; }

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Lecture> Lectures { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<StudentProgress> StudentProgresses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\serha01;Initial Catalog=Serudemy;Integrated Security=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Account__3214EC2795FDC62C");

            entity.ToTable("Account");

            entity.HasIndex(e => e.UserEmail, "UQ__Account__08638DF8F1253CF6").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(40);
            entity.Property(e => e.Password).HasMaxLength(64);
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Surname).HasMaxLength(40);
            entity.Property(e => e.UserEmail).HasMaxLength(50);
            entity.Property(e => e.Userno).HasMaxLength(15);
        });

        modelBuilder.Entity<StudentCourse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AccountC__3214EC27528A838D");

            entity.ToTable("StudentCourse");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.CoursesId).HasColumnName("CoursesID");

            entity.HasOne(d => d.Account).WithMany(p => p.StudentCourses)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__AccountCo__Accou__5535A963");

            entity.HasOne(d => d.Courses).WithMany(p => p.StudentCourses)
                .HasForeignKey(d => d.CoursesId)
                .HasConstraintName("FK__AccountCo__Cours__5629CD9C");
        });

        modelBuilder.Entity<AccountRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AccountR__3214EC27384AF9C2");

            entity.ToTable("AccountRole");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");

            entity.HasOne(d => d.Account).WithMany(p => p.AccountRoles)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__AccountRo__Accou__29572725");

            entity.HasOne(d => d.Role).WithMany(p => p.AccountRoles)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__AccountRo__RoleI__2A4B4B5E");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__Courses__C92D718731793B56");

            entity.Property(e => e.CourseId)
                .ValueGeneratedNever()
                .HasColumnName("CourseID");
            entity.Property(e => e.CourseOwnerId).HasColumnName("CourseOwnerID");
            entity.Property(e => e.ImageUrl).HasColumnName("ImageUrl");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(30);

            entity.HasOne(d => d.CourseOwner).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CourseOwnerId)
                .HasConstraintName("FK__Courses__CourseO__300424B4");
        });

        modelBuilder.Entity<Lecture>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Lectures__3214EC279BFFBF51");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CoursesId).HasColumnName("CoursesID");
            entity.Property(e => e.Name).HasMaxLength(40);
            entity.Property(e => e.VideoDesc).HasMaxLength(500);
            entity.Property(e => e.VideoName).HasMaxLength(40);
            entity.Property(e => e.LectureOrder).HasMaxLength(40);

            entity.HasOne(d => d.Courses).WithMany(p => p.Lectures)
                .HasForeignKey(d => d.CoursesId)
                .HasConstraintName("FK__Lectures__Course__3E52440B");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Role__3214EC27B1AABEA4");

            entity.ToTable("Role");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(12);
        });

        modelBuilder.Entity<StudentProgress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__StudentP__3214EC27E5DACEED");

            entity.ToTable("StudentProgress");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.PlaybackPosition).HasColumnName("PlaybackPosition");
            entity.Property(e => e.WatchedSeconds).HasColumnName("WatchedSeconds");
            entity.Property(e => e.LastUpdate)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.LecturesId).HasColumnName("LecturesID");
            entity.Property(e => e.ProgressPerc).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Account).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__StudentPr__Accou__49C3F6B7");

            entity.HasOne(d => d.Lectures).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.LecturesId)
                .HasConstraintName("FK__StudentPr__Lectu__4AB81AF0");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
