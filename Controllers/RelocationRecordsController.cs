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
using Webapplication6.Custom;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{

    public class RelocationRecordsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        [PagingQueryable(MaxNodeCount=200)]
        // GET: api/RelocationRecords
        public IQueryable<RelocationRecord> GetRelocationRecords()
        {
            return db.RelocationRecords.Include(b=>b.Residents);
        }

        // GET: api/RelocationRecords/5
        [ResponseType(typeof(RelocationRecord))]
        public async Task<IHttpActionResult> GetRelocationRecord(int id)
        {
            RelocationRecord relocationRecord = await db.RelocationRecords.FindAsync(id);
            db.Entry<RelocationRecord>(relocationRecord).Reference(c => c.RelocationBase).Load();
            if (relocationRecord == null)
            {
                return NotFound();
            }
            
            db.Entry(relocationRecord).Collection(rr => rr.Residents).Load();
     
            
            return Ok(relocationRecord);
        }
       
        // PUT: api/RelocationRecords/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRelocationRecord(int id, RelocationRecord relocationRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != relocationRecord.Id)
            {
                return BadRequest();
            }
            var origin = db.RelocationRecords.Where(i => i.Id == id).AsNoTracking().First();
            db.Changes.AddRange(Helper.Logger.ChangeRecords<RelocationRecord>(origin, relocationRecord,RequestContext.Principal.Identity.Name));

            db.Entry(relocationRecord).State = EntityState.Modified;
            
            
            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RelocationRecordExists(id))
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

        // POST: api/RelocationRecords
        [ResponseType(typeof(RelocationRecord))]
        public async Task<IHttpActionResult> PostRelocationRecord(RelocationRecord relocationRecord)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

             using (var transaction = db.Database.BeginTransaction())
            {
                var Residents = relocationRecord.Residents;
               
                foreach (var r in Residents)
                {
                    if (r.RelationshipType != null && r.IdentityCard != null && !r.RelationshipType.Equals("") && !r.IdentityCard.Equals(""))
                    {

                        /*
                        if (r.RelationshipType.Equals("户主") && db.Residents.Count(re => re.IdentityCard.Equals(r.IdentityCard) && re.RelationshipType.Equals("户主")) > 0)
                        {
                            return StatusCode(HttpStatusCode.Conflict);
                        }*/
                        r.Status = db.Residents.Count(re => re.IdentityCard.Equals(r.IdentityCard) && re.RelocationRecord.RelocationType.Equals("居住")) > 0 ? 0 : 1;
                        if (r.Status == 0)
                        {
                            relocationRecord.Status = 0;
                        }
                    }
                    else
                    {
                        r.Status = 1;
                    }
                }
                db.RelocationRecords.Add(relocationRecord);
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateException e)
                {
                    Console.Write(e);
                }
                db.Changes.Add(Helper.Logger.NewRecord<RelocationRecord>(relocationRecord, RequestContext.Principal.Identity.Name));
                await db.SaveChangesAsync();
                transaction.Commit();
            }
         

    

            return CreatedAtRoute("DefaultApi", new { id = relocationRecord.Id }, relocationRecord);
        }

        // DELETE: api/RelocationRecords/5
        [ResponseType(typeof(RelocationRecord))]
        public async Task<IHttpActionResult> DeleteRelocationRecord(int id)
        {
            RelocationRecord relocationRecord = await db.RelocationRecords.FindAsync(id);
            db.Entry<RelocationRecord>(relocationRecord).Collection(c=>c.Residents).Load();
            if (relocationRecord == null)
            {
                return NotFound();
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                foreach (var r in relocationRecord.Residents)
                {
                    if (r.PlacementRecordId != null)
                    {
                        return StatusCode(HttpStatusCode.Forbidden);
                    }
                }
                db.Residents.RemoveRange(relocationRecord.Residents);
                db.Changes.Add(Helper.Logger.DeleteRecord<RelocationRecord>(relocationRecord, RequestContext.Principal.Identity.Name));
                db.RelocationRecords.Remove(relocationRecord);
                await db.SaveChangesAsync();
                transaction.Commit();
            }
            return Ok(relocationRecord);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RelocationRecordExists(int id)
        {
            return db.RelocationRecords.Count(e => e.Id == id) > 0;
        }
    }
}