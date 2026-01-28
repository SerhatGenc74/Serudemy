using Domain.Entities;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

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

    public virtual DbSet<AccountRole> AccountRoles { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    // Removed legacy Class/ClassDepartment tables

    public virtual DbSet<Course> Courses { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Faculty> Faculties { get; set; }

    public virtual DbSet<Lecture> Lectures { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    // Removed legacy StudentClass table

    public virtual DbSet<StudentProgress> StudentProgresses { get; set; }

    public virtual DbSet<StudentCourse> StudentCourses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\serha01;Initial Catalog=Serudemy;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Ignore legacy entities so EF drops them in migration
        modelBuilder.Ignore<Class>();
        modelBuilder.Ignore<ClassDepartment>();
        modelBuilder.Ignore<StudentClass>();

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Account__3214EC27ABD2A6B5");

            entity.ToTable("Account");

            entity.HasIndex(e => e.UserEmail, "UQ__Account__08638DF84046D939").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Birthday).HasColumnType("datetime");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.Gender).HasMaxLength(17);
            entity.Property(e => e.Name).HasMaxLength(40);
            entity.Property(e => e.Password).HasMaxLength(64);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsFixedLength();
            entity.Property(e => e.Surname).HasMaxLength(40);
            entity.Property(e => e.UserEmail).HasMaxLength(50);
            entity.Property(e => e.Userno).HasMaxLength(15);

            entity.HasOne(d => d.Department).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("FK__Account__Departm__6C190EBB");
        });

        modelBuilder.Entity<AccountRole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AccountR__3214EC270ECF3284");

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

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3214EC07EC228659");

            entity.ToTable("Category");

            entity.Property(e => e.Name).HasMaxLength(20);
        });

        // Removed legacy Class and ClassDepartment mappings

        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CourseId).HasName("PK__Courses__C92D71870B612069");

            entity.Property(e => e.CourseId)
                .ValueGeneratedNever()
                .HasColumnName("CourseID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CourseOwnerId).HasColumnName("CourseOwnerID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(30);
            entity.Property(e => e.TargetDepartmentId).HasColumnName("TargetDepartmentID");
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");

            entity.HasOne(d => d.Category).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK__Courses__Categor__5CD6CB2B");

            entity.HasOne(d => d.CourseOwner).WithMany(p => p.Courses)
                .HasForeignKey(d => d.CourseOwnerId)
                .HasConstraintName("FK__Courses__CourseO__2D27B809");

            entity.HasOne(d => d.TargetDepartment).WithMany(p => p.Courses)
                .HasForeignKey(d => d.TargetDepartmentId)
                .HasConstraintName("FK__Courses__TargetD__6D0D32F4");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Departme__3214EC074A463591");

            entity.ToTable("Department");

            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.Faculty).WithMany(p => p.Departments)
                .HasForeignKey(d => d.FacultyId)
                .HasConstraintName("FK__Departmen__Facul__619B8048");
        });

        modelBuilder.Entity<Faculty>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Faculty__3214EC0740D872B4");

            entity.ToTable("Faculty");

            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Lecture>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Lectures__3214EC278787CDD7");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CoursesId).HasColumnName("CoursesID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(40);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.VideoDesc).HasMaxLength(500);
            entity.Property(e => e.VideoName).HasMaxLength(40);

            entity.HasOne(d => d.Courses).WithMany(p => p.Lectures)
                .HasForeignKey(d => d.CoursesId)
                .HasConstraintName("FK__Lectures__Course__300424B4");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Role__3214EC277EA0F7B5");

            entity.ToTable("Role");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name).HasMaxLength(12);
        });

        // Removed legacy StudentClass mapping

        modelBuilder.Entity<StudentProgress>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__StudentP__3214EC2758825C1D");

            entity.ToTable("StudentProgress");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AccountId).HasColumnName("AccountID");
            entity.Property(e => e.LastUpdate)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.LecturesId).HasColumnName("LecturesID");
            entity.Property(e => e.ProgressPerc).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Account).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__StudentPr__Accou__36B12243");

            entity.HasOne(d => d.Lectures).WithMany(p => p.StudentProgresses)
                .HasForeignKey(d => d.LecturesId)
                .HasConstraintName("FK__StudentPr__Lectu__37A5467C");
        });

        modelBuilder.Entity<StudentCourse>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("StudentCourse");

            entity.Property(e => e.Id).HasColumnName("Id");
            entity.Property(e => e.AccountId).HasColumnName("AccountId");
            entity.Property(e => e.CourseId).HasColumnName("CourseId");
            entity.Property(e => e.CourseCompleted).HasColumnName("CourseCompleted");
            entity.Property(e => e.EnrolledAt).HasColumnType("datetime");
            entity.Property(e => e.CompletedAt).HasColumnType("datetime");
            entity.Property(e => e.Progress).HasColumnType("decimal(5, 2)");

            entity.HasOne(d => d.Account).WithMany()
                .HasForeignKey(d => d.AccountId)
                .HasConstraintName("FK__StudentCourse__Account");

            entity.HasOne(d => d.Courses).WithMany()
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK__StudentCourse__Course");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
