namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X11 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Contracts", "Status", c => c.Int());
            AddColumn("dbo.Contracts", "StatusComment", c => c.String());
            AddColumn("dbo.PlacementRecords", "PRId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.PlacementRecords", "PRId");
            DropColumn("dbo.Contracts", "StatusComment");
            DropColumn("dbo.Contracts", "Status");
        }
    }
}
