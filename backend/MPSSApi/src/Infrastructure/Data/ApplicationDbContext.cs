﻿using System.Reflection;
using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Domain.Entities;
using MPSSApi.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using Microsoft.EntityFrameworkCore.Storage;

namespace MPSSApi.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<TodoList> TodoLists => Set<TodoList>();

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    public DbSet<Vendor> Vendors => Set<Vendor>();

    public DbSet<Part> Parts => Set<Part>();

    public DbSet<Sale> Sales => Set<Sale>();

    public DbSet<Purchase> Purchases => Set<Purchase>();

    public DbSet<Record> Records => Set<Record>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);
    }

    IDbContextTransaction IApplicationDbContext.StartTransaction()
    {
        return base.Database.BeginTransaction();
    } 
}
