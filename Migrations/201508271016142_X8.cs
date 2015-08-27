namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X8 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Contracts", "Size1", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size2", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size3", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size4", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "ContractDate", c => c.DateTime());
            AlterColumn("dbo.Contracts", "TransitionSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Deadline", c => c.DateTime());
            AlterColumn("dbo.Contracts", "InterestRate", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "GasFee", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "RepairUnitPrice", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TransitionFee", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "InterestFee", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TVFee", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "OtherFee", c => c.Decimal(precision: 15, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Contracts", "OtherFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TVFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "InterestFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TransitionFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "RepairUnitPrice", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "GasFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "InterestRate", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Deadline", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Contracts", "TransitionSize", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "ContractDate", c => c.DateTime(nullable: false));
            AlterColumn("dbo.Contracts", "Size4", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size3", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size2", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size1", c => c.Decimal(nullable: false, precision: 15, scale: 2));
        }
    }
}
