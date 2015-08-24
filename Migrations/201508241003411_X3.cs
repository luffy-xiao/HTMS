namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Contracts", "PaymentAmount", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.Contracts", "DeltaAmount", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.PlacementRecords", "ApprovedSize", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AddColumn("dbo.PlacementRecords", "UsedAmount", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.PlacementRecords", "UsedSize", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.PlacementRecords", "AppartmentCount", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.RelocationBases", "CreatedTime", c => c.DateTime(nullable: false));
            AddColumn("dbo.RelocationRecords", "RRId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.RelocationRecords", "RRId");
            DropColumn("dbo.RelocationBases", "CreatedTime");
            DropColumn("dbo.PlacementRecords", "AppartmentCount");
            DropColumn("dbo.PlacementRecords", "UsedSize");
            DropColumn("dbo.PlacementRecords", "UsedAmount");
            DropColumn("dbo.PlacementRecords", "ApprovedSize");
            DropColumn("dbo.Contracts", "DeltaAmount");
            DropColumn("dbo.Contracts", "PaymentAmount");
        }
    }
}
