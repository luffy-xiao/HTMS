using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace WebApplication6.Models
{

    public class RelocationRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }

        public int? RelocationBaseId { get; set; }
        public RelocationBase RelocationBase { get; set; }
        public string Village { get; set; }
        public string Group { get; set; }
        public string DoorNumber { get; set; }
        public string RRId { get; set; }
        public int? Status { get; set; } //0 is valid, 1 is invalid
         
        public DateTime? DateCreated { get; set; }
        //address

        public string RelocationType { get; set; }
        
        public virtual ICollection<Resident> Residents { get; set; }

        public Decimal? TotalCompensation { get; set; }
        public Decimal? CashPayable { get; set; }
        public Decimal? CashPaid { get; set; }
        public Decimal? TotalPayable { get; set; }
        public Decimal? TotalPaid { get; set; }
        public Decimal? OtherPayment { get; set; }
        public Decimal? DepositEWF { get; set; }
        public Decimal? EWFPaid { get; set; }
        public Decimal? EWAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public Decimal? ApprovedSize { get; set; }
        public Decimal? HouseSize { get; set; }
        public Decimal? RoomSize { get; set; }
        public Decimal? AffliateSize { get; set; }
        public Decimal? ReservedSize { get; set; }
        public Decimal? UnapprovedSize { get; set; }
        public Decimal? PunishedSize { get; set; }
        public Decimal? NoRemovalSize { get; set; }
        public Decimal? RelocationSize { get; set; }
        public Decimal? EffectiveSize { get; set; }
        public Decimal? MeasuredSize { get; set; }
        public Decimal? NoConstructionSize { get; set; }
        public Decimal? UncertifiedSize { get; set; }
        public int? BaseNumber { get; set; }
        public Decimal? TransitionFee { get; set; }
        public Decimal? SickCompensation { get; set; }
        public DateTime? NewVillageDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

    }
    public class Resident
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
     
        public string IdentityCard { get; set; }
        
        public string Phone { get; set; }
      
        public string Name { get; set; }
         
        public string RelationshipType { get; set; }

        public int RelocationRecordId { get; set; }
        public virtual RelocationRecord RelocationRecord { get; set; }

        public int? PlacementRecordId { get; set; }
        public int? Status { get; set; }
    }

    public class RelationshipType
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class Village
    {
        [Key,DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }

    public class PlacementRecord
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }
        public string RelocationRecordId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string Name { get {
            if (Residents == null) return null;
            string name = "";
            if (Residents != null)
            {
                foreach (var r in Residents)
                {
                    name += r.Name + " ";
                }
            }
            return name;
        } }
        public virtual ICollection<Resident> Residents { get; set; }

        public Decimal Size { get; set; }
        public Decimal TotalCompensation { get; set; }
        public Decimal ApprovedSize { get; set; }

        public Decimal? UsedAmount { get; set; }
        public Decimal? UsedSize { get; set; }
        public Decimal? AppartmentCount { get; set; }
    }
}