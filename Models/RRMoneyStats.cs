using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApplication6.Models
{
    public class RRMoneyStats
    {
        public int? RelocationBaseId { get; set; }
        public string RelocationType { get; set; }
        public int rrCount  { get; set; }
        public Decimal? TotalCompensation { get; set; }
        public Decimal? CashPayable { get; set; }
        public Decimal? TotalPayable { get; set; }
    }
}