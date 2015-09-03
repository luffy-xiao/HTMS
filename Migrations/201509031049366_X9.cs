namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X9 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RelocationRecords", "DocumentNumber", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.RelocationRecords", "DocumentNumber");
        }
    }
}
