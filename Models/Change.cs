using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApplication6.Models
{
    public class Change
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Field { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }

        public DateTime Time { get; set; }

        public string EntityType { get; set; }

        public string EntityId { get; set; }

        public string UserName { get; set; }
        public string Type { get; set; }
    }
}