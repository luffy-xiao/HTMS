using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebApplication6.Models
{
    public class WebApplication6Context : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public WebApplication6Context() : base("name=WebApplication6Context")
        {
            this.Configuration.LazyLoadingEnabled = false; 
        }

        public System.Data.Entity.DbSet<WebApplication6.Models.Appartment> Appartments { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Village> Villages { get; set; }
        public System.Data.Entity.DbSet<WebApplication6.Models.Change> Changes { get; set; }
        public System.Data.Entity.DbSet<WebApplication6.Models.RelationshipType> RelationshipTypes { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.RelocationBase> RelocationBases { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Properties<Decimal>()
                .Configure(config => config.HasPrecision(15, 2));

        }

        public System.Data.Entity.DbSet<WebApplication6.Models.RelocationRecord> RelocationRecords { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Resident> Residents { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Community> Communities { get; set; }


        public System.Data.Entity.DbSet<WebApplication6.Models.AppartmentType> AppartmentTypes { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.FacingType> FacingTypes { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.DecorationType> DecorationTypes { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Model> Models { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Header> Headers { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.PriceTemplate> PriceTemplates { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.Contract> Contracts { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.PlacementRecord> PlacementRecords { get; set; }

        public System.Data.Entity.DbSet<WebApplication6.Models.AppartmentOwner> AppartmentOwners { get; set; }


    }
}
