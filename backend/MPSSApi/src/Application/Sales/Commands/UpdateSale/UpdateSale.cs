﻿using MPSSApi.Application.Common.Interfaces;
using MPSSApi.Application.Common.Models;
using MPSSApi.Domain.Entities;

namespace MPSSApi.Application.Sales.Commands.UpdateSale;

public record UpdateSaleCommand : IRequest
{
    public int Id { get; set; }

    public string SaleNumber { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public DateTime Date { get; set; }

    public string? CustomerName { get; set; }

    public string? CustomerContact { get; set; }

    public IList<RecordCommand> Records { get; set; } = new List<RecordCommand>();
}

public class UpdateSaleCommandValidator : AbstractValidator<UpdateSaleCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSaleCommandValidator(IApplicationDbContext context)
    {
        _context = context;

        RuleFor(v => v.SaleNumber)
            .NotEmpty()
            .MaximumLength(20)
            .MustAsync(BeUniqueNumber)
                .WithMessage("'{PropertyName}' must be unique.")
                .WithErrorCode("Unique");

        RuleFor(v => v.Date)
            .NotNull()
                .WithMessage("'{PropertyName}' is required.")
                .WithErrorCode("Invalid");

        RuleFor(v => v.Records)
            .NotEmpty()
                .WithMessage("'{PropertyName}' is required.")
                .WithErrorCode("Invalid");
    }

    public async Task<bool> BeUniqueNumber(UpdateSaleCommand command, string number, CancellationToken cancellationToken)
    {
        return await _context.Sales
            .AllAsync(s => s.Id == command.Id || s.SaleNumber != number, cancellationToken);
    }
}

public class UpdateSaleCommandHandler : IRequestHandler<UpdateSaleCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UpdateSaleCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task Handle(UpdateSaleCommand request, CancellationToken cancellationToken)
    {
        var records = _mapper.Map<IList<RecordCommand>, IList<Record>>(request.Records);
        
        var entity = await _context.Sales.Include(s => s.Records)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.SaleNumber = request.SaleNumber;
        entity.Total = records.Sum(r => r.Total);
        entity.Date = request.Date;
        entity.CustomerName = request.CustomerName;
        entity.CustomerContact = request.CustomerContact;

        using var transaction = _context.StartTransaction();
        try
        {
            await _context.SaveChangesAsync(cancellationToken);


            foreach (var item in records)
            {
                item.SaleId = entity.Id;
                item.PurchaseId = null;
                item.Date = entity.Date;
            }

            var updateRecords = records.Where(r => r.Id > 0).Select(r => r.Id);

            foreach (var item in entity.Records)
            {
                var part = _context.Parts.FirstOrDefault(p => p.Id == item.PartId);

                if (!updateRecords.Contains(item.Id))
                {
                    // Remove this items
                    if (part != null)
                    {
                        // Deleting sales record means increase quantity
                        part.Quantity += item.Quantity;
                    }
                }
                else
                {
                    var record = records.First(r => r.Id == item.Id);

                    // Update this items
                    if (part != null)
                    {
                        // Updating sales record means increase old part quantity
                        part.Quantity += item.Quantity;

                        if (part.Quantity < 0) part.Quantity = 0;
                    }

                    item.PartId = record.PartId;
                    item.Date = entity.Date;
                    item.Quantity = record.Quantity;
                    item.Price = record.Price;
                    item.Total = item.Price * item.Quantity;

                    part = _context.Parts.FirstOrDefault(p => p.Id == item.PartId);
                    if (part != null)
                    {
                        // Updating sales record means decrease new part quantity
                        part.Quantity -= item.Quantity;
                        if (part.Quantity < 0) part.Quantity = 0;
                    }
                }
            }

            foreach(var item in records.Where(r => r.Id < 0))
            {
                item.Id = 0;

                // Add this items
                var part = _context.Parts.FirstOrDefault(p => p.Id == item.PartId);

                if (part != null)
                {
                    // Creating sales record means decrease quantity
                    part.Quantity -= item.Quantity;

                    if (part.Quantity < 0) part.Quantity = 0;
                }

                entity.Records.Add(item);
            }

            _context.Records.RemoveRange(entity.Records.Where(r => !updateRecords.Contains(r.Id)));

            await _context.SaveChangesAsync(cancellationToken);

            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            var mess = ex.Message;
            throw;
        }

    }
}
