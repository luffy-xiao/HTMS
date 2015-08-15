using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using System.Web.Http.OData;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
        [Authorize]
    public class ContractsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Contracts
        [EnableQuery]
        public IQueryable<Contract> GetContracts()
        {
            return db.Contracts.Include(c=>c.Appartment.Community).Include(c=>c.AppartmentOwners);
        }

        // GET: api/Contracts/5
        [ResponseType(typeof(Contract))]
        public async Task<IHttpActionResult> GetContract(int id)
        {
            Contract contract = await db.Contracts.FindAsync(id);
            db.Entry<Contract>(contract).Collection(c => c.AppartmentOwners).Load();
            db.Entry<Contract>(contract).Reference(c => c.Appartment).Load();
            db.Entry<Contract>(contract).Reference(c => c.PlacementRecord).Load();
            db.Entry<PlacementRecord>(contract.PlacementRecord).Collection(c =>c.Residents).Load();
            db.Entry<Appartment>(contract.Appartment).Reference(c => c.Community).Load();

            
            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        // PUT: api/Contracts/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutContract(int id, Contract contract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contract.Id)
            {
                return BadRequest();
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                var origin = db.Contracts.Find(contract.Id);
                db.Entry<Contract>(origin).Collection(c => c.AppartmentOwners).Load();

                db.Changes.AddRange(Helper.Logger.ChangeRecords<Contract>(origin, contract, RequestContext.Principal.Identity.Name));
                var added = contract.AppartmentOwners.Except(origin.AppartmentOwners.ToList(), new AppartmentOwnerComparator());
                var deleted = origin.AppartmentOwners.ToList().Except(contract.AppartmentOwners, new AppartmentOwnerComparator());
                db.AppartmentOwners.RemoveRange(deleted);
                foreach (var ao in added)
                {
                    ao.ContractId = contract.Id;
                    db.AppartmentOwners.Add(ao);
                }
                db.Entry<Contract>(origin).State = EntityState.Detached;
                await db.SaveChangesAsync();
                contract.AppartmentOwners = null;
                db.Entry<Contract>(contract).State = EntityState.Modified;
               
                try
                {
                    await db.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ContractExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                transaction.Commit();
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Contracts
        [ResponseType(typeof(Contract))]
        public async Task<IHttpActionResult> PostContract(Contract contract)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                db.Contracts.Add(contract);
                Appartment app = await db.Appartments.FindAsync(contract.AppartmentId);
                if (app.Status != null && !app.Status.Equals("可售"))
                {
                    return StatusCode(HttpStatusCode.Forbidden);
                }
                app.Status = "已售";
                PlacementRecord pr = await db.PlacementRecords.FindAsync(contract.PlacementRecordId);
                //pr.PlacedSize += app.Size;
                db.Entry<Appartment>(app).State = EntityState.Modified;
                db.Entry<PlacementRecord>(pr).State = EntityState.Modified;
                await db.SaveChangesAsync();
                db.Entry<Appartment>(contract.Appartment).Reference(c => c.Community).Load();
                db.Changes.Add(Helper.Logger.NewRecord<Contract>(contract, RequestContext.Principal.Identity.Name));
                await db.SaveChangesAsync();
                transaction.Commit();
            }
            return CreatedAtRoute("DefaultApi", new { id = contract.Id }, contract);
        }

        // DELETE: api/Contracts/5
        [ResponseType(typeof(Contract))]
        public async Task<IHttpActionResult> DeleteContract(int id)
        {
            Contract contract = await db.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                Appartment app = await db.Appartments.FindAsync(contract.AppartmentId);
                PlacementRecord pr = await db.PlacementRecords.FindAsync(contract.PlacementRecordId);
                //pr.PlacedSize -= app.Size;
                app.Status = "可售";
                db.Changes.Add(Helper.Logger.DeleteRecord<Contract>(contract, RequestContext.Principal.Identity.Name));
                db.Contracts.Remove(contract);
                db.Entry<Appartment>(app).State = EntityState.Modified;
                db.Entry<PlacementRecord>(pr).State = EntityState.Modified;
                await db.SaveChangesAsync();
                transaction.Commit();
            }
           // db.Entry<Contract>(contract).Reference(c=>c.Appartment).Load();
           
            return Ok(contract);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ContractExists(int id)
        {
            return db.Contracts.Count(e => e.Id == id) > 0;
        }
    }
}