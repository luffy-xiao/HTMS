namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RelocationBases", "RBId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.RelocationBases", "RBId");
        }
    }
}
