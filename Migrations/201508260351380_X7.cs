namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X7 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AppartmentOwners", "ShowAsOwner", c => c.Boolean());
            AddColumn("dbo.AppartmentOwners", "ShowOnCert", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.AppartmentOwners", "ShowOnCert");
            DropColumn("dbo.AppartmentOwners", "ShowAsOwner");
        }
    }
}
