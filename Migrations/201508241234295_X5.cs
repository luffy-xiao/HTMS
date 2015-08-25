namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X5 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.RelocationBases", "CreatedTime", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.RelocationBases", "CreatedTime", c => c.DateTime(nullable: false));
        }
    }
}
