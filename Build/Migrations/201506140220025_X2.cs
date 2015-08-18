namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class X2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Appartments", "TotalPrice", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "Size", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "UsableSize", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "Price1", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "Price2", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "Price3", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Appartments", "Price4", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size1", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size2", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size3", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "Size4", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "InterestRate", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "GasFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "RepairUnitPrice", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TransitionFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "InterestFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "TVFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.Contracts", "OtherFee", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PlacementRecords", "Size", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PlacementRecords", "TotalCompensation", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price1", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price2", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price3", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price4", c => c.Decimal(nullable: false, precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalCompensation", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "CashPayable", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "CashPaid", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalPayable", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalPaid", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "OtherPayment", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "DepositEWF", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EWFPaid", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EWAmount", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "ApprovedSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "HouseSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "RoomSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "AffliateSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "ReservedSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "UnapprovedSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "PunishedSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "NoRemovalSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "RelocationSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EffectiveSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "MeasuredSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "NoConstructionSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "UncertifiedSize", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TransitionFee", c => c.Decimal(precision: 15, scale: 2));
            AlterColumn("dbo.RelocationRecords", "SickCompensation", c => c.Decimal(precision: 15, scale: 2));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.RelocationRecords", "SickCompensation", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TransitionFee", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "UncertifiedSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "NoConstructionSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "MeasuredSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EffectiveSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "RelocationSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "NoRemovalSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "PunishedSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "UnapprovedSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "ReservedSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "AffliateSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "RoomSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "HouseSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "ApprovedSize", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EWAmount", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "EWFPaid", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "DepositEWF", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "OtherPayment", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalPaid", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalPayable", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "CashPaid", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "CashPayable", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.RelocationRecords", "TotalCompensation", c => c.Decimal(precision: 10, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price4", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price3", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price2", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.PriceTemplates", "Price1", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.PlacementRecords", "TotalCompensation", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.PlacementRecords", "Size", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "OtherFee", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "TVFee", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "InterestFee", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "TransitionFee", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "RepairUnitPrice", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "GasFee", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "InterestRate", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "Size4", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "Size3", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "Size2", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Contracts", "Size1", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "Price4", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "Price3", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "Price2", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "Price1", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "UsableSize", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "Size", c => c.Decimal(nullable: false, precision: 10, scale: 2));
            AlterColumn("dbo.Appartments", "TotalPrice", c => c.Decimal(nullable: false, precision: 10, scale: 2));
        }
    }
}
