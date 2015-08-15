using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;


namespace WebApplication6.Models
{
    public class Community
    {
       [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string ShortName { get; set; }

        public string Usage { get; set; }

        public string Address { get; set; }

        public string Company { get; set; }

    }

    public class Appartment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int CommunityId { get; set; }
        public string Status { get; set; }
        public  Community Community { get; set; }
        public string BuildingType { get; set; }

        public int Floor { get; set; }
        [Required]
        public int BuildingNumber { get; set; }

        [Required]
        public int UnitNumber { get; set; }

        [Required]
        public string Type { get; set; }

        public string Facing { get; set; }

        [Required]
        public string DoorNumber { get; set; }
        [Required]
        public string DecorationStatus { get; set; }

        public Decimal TotalPrice { get; set; }
        public Decimal Size { get; set; }

        public Decimal UsableSize { get; set; }

        public Decimal Price1 { get; set; }
        public Decimal Price2 { get; set; }
        public Decimal Price3 { get; set; }
        public Decimal Price4 { get; set; }

     }

    public class PriceTemplate
    {

        [Key]
        [Column(Order = 1)] 
        public virtual string Type { get; set; }

        [Key]
        [Column(Order = 2)] 
        public virtual int Floor { get; set; }

        public decimal Price1 { get; set; }
        public decimal Price2 { get; set; }
        public decimal Price3 { get; set; }
        public decimal Price4 { get; set; }
    }
}