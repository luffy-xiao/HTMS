namespace WebApplication6.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AppartmentOwners",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IdentityCard = c.String(),
                        Name = c.String(),
                        ContractId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Contracts", t => t.ContractId, cascadeDelete: true)
                .Index(t => t.ContractId);
            
            CreateTable(
                "dbo.Appartments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CommunityId = c.Int(nullable: false),
                        Status = c.String(),
                        BuildingType = c.String(),
                        Floor = c.Int(nullable: false),
                        BuildingNumber = c.Int(nullable: false),
                        UnitNumber = c.Int(nullable: false),
                        Type = c.String(nullable: false),
                        Facing = c.String(),
                        DoorNumber = c.String(nullable: false),
                        DecorationStatus = c.String(nullable: false),
                        TotalPrice = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Size = c.Decimal(nullable: false, precision: 10, scale: 2),
                        UsableSize = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price1 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price2 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price3 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price4 = c.Decimal(nullable: false, precision: 10, scale: 2),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Communities", t => t.CommunityId, cascadeDelete: true)
                .Index(t => t.CommunityId);
            
            CreateTable(
                "dbo.Communities",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        ShortName = c.String(),
                        Usage = c.String(),
                        Address = c.String(),
                        Company = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AppartmentTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Changes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Field = c.String(),
                        OldValue = c.String(),
                        NewValue = c.String(),
                        Time = c.DateTime(nullable: false),
                        EntityType = c.String(),
                        EntityId = c.String(),
                        UserName = c.String(),
                        Type = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Contracts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        AppartmentId = c.Int(nullable: false),
                        PlacementRecordId = c.Int(nullable: false),
                        Size1 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Size2 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Size3 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Size4 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        ContractDate = c.DateTime(nullable: false),
                        TransitionDays = c.Int(nullable: false),
                        Deadline = c.DateTime(nullable: false),
                        InterestRate = c.Decimal(nullable: false, precision: 10, scale: 2),
                        GasFee = c.Decimal(nullable: false, precision: 10, scale: 2),
                        RepairUnitPrice = c.Decimal(nullable: false, precision: 10, scale: 2),
                        TransitionFee = c.Decimal(nullable: false, precision: 10, scale: 2),
                        InterestFee = c.Decimal(nullable: false, precision: 10, scale: 2),
                        TVFee = c.Decimal(nullable: false, precision: 10, scale: 2),
                        OtherFee = c.Decimal(nullable: false, precision: 10, scale: 2),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Appartments", t => t.AppartmentId, cascadeDelete: true)
                .ForeignKey("dbo.PlacementRecords", t => t.PlacementRecordId, cascadeDelete: true)
                .Index(t => t.AppartmentId)
                .Index(t => t.PlacementRecordId);
            
            CreateTable(
                "dbo.PlacementRecords",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RelocationRecordId = c.String(),
                        Size = c.Decimal(nullable: false, precision: 10, scale: 2),
                        PlacedSize = c.Decimal(nullable: false, precision: 10, scale: 2),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Residents",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        IdentityCard = c.String(),
                        Phone = c.String(),
                        Name = c.String(),
                        RelationshipType = c.String(),
                        RelocationRecordId = c.Int(nullable: false),
                        PlacementRecordId = c.Int(),
                        Status = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PlacementRecords", t => t.PlacementRecordId)
                .ForeignKey("dbo.RelocationRecords", t => t.RelocationRecordId, cascadeDelete: true)
                .Index(t => t.RelocationRecordId)
                .Index(t => t.PlacementRecordId);
            
            CreateTable(
                "dbo.DecorationTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FacingTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Headers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Field = c.String(),
                        Type = c.String(),
                        ModelName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Models",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        DisplayName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.PriceTemplates",
                c => new
                    {
                        Type = c.String(nullable: false, maxLength: 128),
                        Floor = c.Int(nullable: false),
                        Price1 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price2 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price3 = c.Decimal(nullable: false, precision: 10, scale: 2),
                        Price4 = c.Decimal(nullable: false, precision: 10, scale: 2),
                    })
                .PrimaryKey(t => new { t.Type, t.Floor });
            
            CreateTable(
                "dbo.RelationshipTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.RelocationBases",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        RelocationCompany = c.String(),
                        Relocator = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.RelocationRecords",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RelocationBaseId = c.Int(),
                        Village = c.String(),
                        Group = c.String(),
                        DoorNumber = c.String(),
                        Status = c.Int(),
                        DateCreated = c.DateTime(),
                        RelocationType = c.String(),
                        TotalCompensation = c.Decimal(precision: 10, scale: 2),
                        CashPayable = c.Decimal(precision: 10, scale: 2),
                        CashPaid = c.Decimal(precision: 10, scale: 2),
                        TotalPayable = c.Decimal(precision: 10, scale: 2),
                        TotalPaid = c.Decimal(precision: 10, scale: 2),
                        OtherPayment = c.Decimal(precision: 10, scale: 2),
                        DepositEWF = c.Decimal(precision: 10, scale: 2),
                        EWFPaid = c.Decimal(precision: 10, scale: 2),
                        EWAmount = c.Decimal(precision: 10, scale: 2),
                        PaymentDate = c.DateTime(),
                        ApprovedSize = c.Decimal(precision: 10, scale: 2),
                        HouseSize = c.Decimal(precision: 10, scale: 2),
                        RoomSize = c.Decimal(precision: 10, scale: 2),
                        AffliateSize = c.Decimal(precision: 10, scale: 2),
                        ReservedSize = c.Decimal(precision: 10, scale: 2),
                        UnapprovedSize = c.Decimal(precision: 10, scale: 2),
                        PunishedSize = c.Decimal(precision: 10, scale: 2),
                        NoRemovalSize = c.Decimal(precision: 10, scale: 2),
                        RelocationSize = c.Decimal(precision: 10, scale: 2),
                        EffectiveSize = c.Decimal(precision: 10, scale: 2),
                        MeasuredSize = c.Decimal(precision: 10, scale: 2),
                        NoConstructionSize = c.Decimal(precision: 10, scale: 2),
                        UncertifiedSize = c.Decimal(precision: 10, scale: 2),
                        BaseNumber = c.Int(),
                        TransitionFee = c.Decimal(precision: 10, scale: 2),
                        SickCompensation = c.Decimal(precision: 10, scale: 2),
                        NewVillageDate = c.DateTime(),
                        DeliveryDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.RelocationBases", t => t.RelocationBaseId)
                .Index(t => t.RelocationBaseId);
            
            CreateTable(
                "dbo.Villages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Residents", "RelocationRecordId", "dbo.RelocationRecords");
            DropForeignKey("dbo.RelocationRecords", "RelocationBaseId", "dbo.RelocationBases");
            DropForeignKey("dbo.Contracts", "PlacementRecordId", "dbo.PlacementRecords");
            DropForeignKey("dbo.Residents", "PlacementRecordId", "dbo.PlacementRecords");
            DropForeignKey("dbo.AppartmentOwners", "ContractId", "dbo.Contracts");
            DropForeignKey("dbo.Contracts", "AppartmentId", "dbo.Appartments");
            DropForeignKey("dbo.Appartments", "CommunityId", "dbo.Communities");
            DropIndex("dbo.RelocationRecords", new[] { "RelocationBaseId" });
            DropIndex("dbo.Residents", new[] { "PlacementRecordId" });
            DropIndex("dbo.Residents", new[] { "RelocationRecordId" });
            DropIndex("dbo.Contracts", new[] { "PlacementRecordId" });
            DropIndex("dbo.Contracts", new[] { "AppartmentId" });
            DropIndex("dbo.Appartments", new[] { "CommunityId" });
            DropIndex("dbo.AppartmentOwners", new[] { "ContractId" });
            DropTable("dbo.Villages");
            DropTable("dbo.RelocationRecords");
            DropTable("dbo.RelocationBases");
            DropTable("dbo.RelationshipTypes");
            DropTable("dbo.PriceTemplates");
            DropTable("dbo.Models");
            DropTable("dbo.Headers");
            DropTable("dbo.FacingTypes");
            DropTable("dbo.DecorationTypes");
            DropTable("dbo.Residents");
            DropTable("dbo.PlacementRecords");
            DropTable("dbo.Contracts");
            DropTable("dbo.Changes");
            DropTable("dbo.AppartmentTypes");
            DropTable("dbo.Communities");
            DropTable("dbo.Appartments");
            DropTable("dbo.AppartmentOwners");
        }
    }
}
