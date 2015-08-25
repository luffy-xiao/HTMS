namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X6 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Contracts", "TransitionSize", c => c.Decimal(nullable: false, precision: 15, scale: 2));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Contracts", "TransitionSize");
        }
    }
}
