namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X12 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RelocationRecords", "ResidentsCount", c => c.Int());
            AddColumn("dbo.RelocationRecords", "EffectiveResidentsCount", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.RelocationRecords", "EffectiveResidentsCount");
            DropColumn("dbo.RelocationRecords", "ResidentsCount");
        }
    }
}
