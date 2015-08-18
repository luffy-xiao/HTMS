namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PlacementRecords", "TotalCompensation", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            DropColumn("dbo.PlacementRecords", "PlacedSize");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PlacementRecords", "PlacedSize", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            DropColumn("dbo.PlacementRecords", "TotalCompensation");
        }
    }
}
