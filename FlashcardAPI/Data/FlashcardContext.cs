using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FlashcardAPI.Data;

public partial class FlashcardContext : DbContext
{
    // Standard constructor that takes options from Program.cs
    public FlashcardContext(DbContextOptions<FlashcardContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Card> Cards { get; set; }
    public virtual DbSet<Folder> Folders { get; set; }
    public virtual DbSet<Login> Logins { get; set; }
    public virtual DbSet<Set> Sets { get; set; }
    public virtual DbSet<SetFolder> SetFolders { get; set; }
    public virtual DbSet<User> Users { get; set; }

    // Removed OnConfiguring with the hardcoded string. 
    // Configuration is now handled in Program.cs for better flexibility.

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Card>(entity =>
        {
            entity.Property(e => e.CardId).HasColumnName("CardID");
            entity.Property(e => e.CardBack).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.CardFront).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.SetId).HasColumnName("SetID");
        });

        modelBuilder.Entity<Folder>(entity =>
        {
            entity.HasKey(e => e.FolderId);
            entity.Property(e => e.FolderId).HasColumnName("FolderID");
            entity.Property(e => e.FolderDescription).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.FolderTitle).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<Login>(entity =>
        {
            entity.Property(e => e.LoginId).HasColumnName("LoginID");
            entity.Property(e => e.Password).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Username).HasMaxLength(50).IsUnicode(false);
        });

        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => e.SetId);
            entity.Property(e => e.SetDescription).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.SetId).ValueGeneratedOnAdd().HasColumnName("SetID");
            entity.Property(e => e.SetTitle).HasMaxLength(50).IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<SetFolder>(entity =>
        {
            entity.Property(e => e.SetFolderId).HasColumnName("SetFolderID");
            entity.Property(e => e.FolderId).HasColumnName("FolderID");
            entity.Property(e => e.SetId).HasColumnName("SetID");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Email).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(250).IsUnicode(false);
            entity.Property(e => e.LastName).HasMaxLength(250).IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}