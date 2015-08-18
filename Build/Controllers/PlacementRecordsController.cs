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
    public class PlacementRecordsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/PlacementRecords
        [EnableQuery]
        public IQueryable<PlacementRecord> GetPlacementRecords()
        {
            return db.PlacementRecords.Include(pr=>pr.Residents);
        }

        // GET: api/PlacementRecords/5
        [ResponseType(typeof(PlacementRecord))]
        public async Task<IHttpActionResult> GetPlacementRecord(int id)
        {
            PlacementRecord placementRecord = await db.PlacementRecords.FindAsync(id);
            db.Entry<PlacementRecord>(placementRecord).Collection(c => c.Residents).Load();
            if (placementRecord == null)
            {
                return NotFound();
            }

            return Ok(placementRecord);
        }

        // PUT: api/PlacementRecords/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPlacementRecord(int id, PlacementRecord placementRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != placementRecord.Id)
            {
                return BadRequest();
            }

       

            try
            {
                using (var transaction = db.Database.BeginTransaction())
                {
                    
                    db.Entry(placementRecord).State = EntityState.Modified;
                    var orgin = db.PlacementRecords.Where(i => i.Id.Equals(id)).AsNoTracking().First();
                    db.Changes.AddRange(Helper.Logger.ChangeRecords<PlacementRecord>(orgin, placementRecord, RequestContext.Principal.Identity.Name));
                    await db.SaveChangesAsync();
                    transaction.Commit();
                }
               
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlacementRecordExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PlacementRecords
        [ResponseType(typeof(PlacementRecord))]
        public async Task<IHttpActionResult> PostPlacementRecord(PlacementRecord placementRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var transaction = db.Database.BeginTransaction())
            {
                var Residents = placementRecord.Residents;
                placementRecord.Residents = null;
                db.PlacementRecords.Add(placementRecord);
                await db.SaveChangesAsync();
                foreach (var r in Residents)
                {
                    if (r.PlacementRecordId != null)
                    {
                        transaction.Rollback();
                        return StatusCode(HttpStatusCode.Conflict);
                    }
                    r.PlacementRecordId = placementRecord.Id;
                    db.Entry<Resident>(r).State = EntityState.Modified;

                }

                await db.SaveChangesAsync();
                db.Changes.Add(Helper.Logger.NewRecord<PlacementRecord>(placementRecord,RequestContext.Principal.Identity.Name));
                await db.SaveChangesAsync();
                transaction.Commit();
            }

            return CreatedAtRoute("DefaultApi", new { id = placementRecord.Id }, placementRecord);
        }

        // DELETE: api/PlacementRecords/5
        [ResponseType(typeof(PlacementRecord))]
        public async Task<IHttpActionResult> DeletePlacementRecord(int id)
        {
            PlacementRecord placementRecord = await db.PlacementRecords.FindAsync(id);
            if (placementRecord == null)
            {
                return NotFound();
            }

            using (var transaction = db.Database.BeginTransaction())
            {
                db.Entry<PlacementRecord>(placementRecord).Collection(c => c.Residents).Load();
                var Residents = placementRecord.Residents;
                placementRecord.Residents = null;
                if( db.Contracts.Count(c=>c.PlacementRecordId==placementRecord.Id) > 0){
                    return StatusCode(HttpStatusCode.Forbidden);
                }
                
                foreach (var r in Residents)
                {
                    if (r.PlacementRecordId == id)
                    {
                        r.PlacementRecordId = null;
                    }
                    db.Entry<Resident>(r).State = EntityState.Modified;
                }
                db.Changes.Add(Helper.Logger.DeleteRecord<PlacementRecord>(placementRecord, RequestContext.Principal.Identity.Name));
                db.PlacementRecords.Remove(placementRecord);
                await db.SaveChangesAsync();
                transaction.Commit();
            }
            return Ok(placementRecord);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PlacementRecordExists(int id)
        {
            return db.PlacementRecords.Count(e => e.Id == id) > 0;
        }
    }
}