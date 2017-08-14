using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApplication6.Models
{
    public class RRSizeStats
    {
        public int? RelocationBaseId { get; set; }
        public Decimal? MeasuredSize { get; set; }
        public Decimal? EffectiveSize { get; set; }
        public Decimal? NoConstructionSize { get; set; }
        public Decimal? UncertifiedSize { get; set; }
    }
}