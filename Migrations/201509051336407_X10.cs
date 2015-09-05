namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X10 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Contracts", "Comment", c => c.String());
            AddColumn("dbo.PlacementRecords", "RepurchasePrice", c => c.Decimal(precision: 15, scale: 2));
            AddColumn("dbo.RelocationBases", "RepurchasePrice", c => c.Decimal(precision: 15, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.RelocationBases", "RepurchasePrice");
            DropColumn("dbo.PlacementRecords", "RepurchasePrice");
            DropColumn("dbo.Contracts", "Comment");
        }
    }
}
