using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApplication6.Models
{
    public class Contract
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int AppartmentId { get; set; }
        public virtual Appartment Appartment { get; set; }

        public int PlacementRecordId { get; set; }
        public PlacementRecord PlacementRecord { get; set; }

        public ICollection<AppartmentOwner> AppartmentOwners { get; set; }
        public decimal? Size1 { get; set; }
        public decimal? Size2 { get; set; }
        public decimal? Size3 { get; set; }
        public decimal? Size4 { get; set; }
        public decimal? PaymentAmount { get; set; }
        public decimal? DeltaAmount { get; set; }
       

        public  DateTime? ContractDate { get;set; }

        public int TransitionDays { get; set; }
        public decimal? TransitionSize { get; set; }
        public DateTime? Deadline { get; set; }
        public decimal? InterestRate { get; set; }
        public decimal? GasFee { get; set; }
        public decimal? RepairUnitPrice { get; set; }

        public decimal? TransitionFee { get; set; }
        public decimal? InterestFee { get; set; }

        public decimal? TVFee { get; set; }

        public decimal? OtherFee { get; set; }
        
    }

    public class AppartmentOwner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual int Id { get; set; }

        public string IdentityCard { get; set; }

        public string Name { get; set; }

        public int ContractId { get; set; }
        public bool? ShowAsOwner { get; set; }
        public bool? ShowOnCert { get; set; }
    }

    public class AppartmentOwnerComparator : IEqualityComparer<AppartmentOwner>
    {
        public bool Equals(AppartmentOwner a, AppartmentOwner b)
        {
            if (ReferenceEquals(a, b)) return true;

            if (ReferenceEquals(a, null) || ReferenceEquals(b, null))
                return false;

            return a.Name == b.Name && a.IdentityCard == b.IdentityCard;
        }

        public int GetHashCode(AppartmentOwner product)
        {
            if (ReferenceEquals(product, null)) return 0;
            var hashProductId = (product.Name+product.IdentityCard).GetHashCode();
            return hashProductId;
        }
    }
}