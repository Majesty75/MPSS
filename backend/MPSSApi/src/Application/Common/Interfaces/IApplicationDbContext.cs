using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }

    DbSet<Vendor> Vendors { get; }
    
    DbSet<Part> Parts { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
