using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPSSApi.Domain.Entities;
public class Record
{
    public int RecordId { get; set; }

    public int TrxId { get; set; }

    public int TrxType { get; set; }

    public int PartId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; } = 0;

    public decimal Total { get; set; } = 0;

    public DateTime Date { get; set; }

    public Part Part { get; set; } = null!;
}
