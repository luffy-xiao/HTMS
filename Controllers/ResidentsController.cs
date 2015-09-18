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
using System.Web.Http.OData.Query;
using Webapplication6.Custom;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Authorize]
    public class ResidentsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Residents
        [PagingQueryable(MaxNodeCount=200)]
        public IQueryable<Resident> GetResidents()
        {
            return db.Residents.Include(r=>r.RelocationRecord);
        }

        // GET: api/Residents/5
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> GetResident(int id)
        {
            Resident resident = await db.Residents.FindAsync(id);
            if (resident == null)
            {
                return NotFound();
            }

            return Ok(resident);
        }

        // PUT: api/Residents/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutResident(int id, Resident resident)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != resident.Id)
            {
                return BadRequest();
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                db.Entry(resident).State = EntityState.Modified;
                db.SaveChanges();
                var rr = db.RelocationRecords.Find(resident.RelocationRecordId);
                db.Entry(rr).Collection(c => c.Residents).Load();
                var sign = false;
                foreach (Resident r in rr.Residents)
                {
                    db.Entry(r).Reload();
                    if(r.Status == 0){
                        sign = true;
                    }
                }
                if (sign == false)
                {
                    rr.Status = 1;
                }
                else
                {
                    rr.Status = 0;
                }

                db.Entry(rr).State = EntityState.Modified;
                await db.SaveChangesAsync();
                transaction.Commit();
               
               
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Residents
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> PostResident(Resident resident)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (db.Residents.Count(re => re.IdentityCard.Equals(resident.IdentityCard)) > 0) // resident already exist
            {
                resident.Status = 0;
                
            }

            db.Residents.Add(resident);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = resident.Id }, resident);
        }

        // DELETE: api/Residents/5
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> DeleteResident(int id)
        {
            Resident resident = await db.Residents.FindAsync(id);
            if (resident == null)
            {
                return NotFound();
            }

            db.Residents.Remove(resident);
            await db.SaveChangesAsync();

            return Ok(resident);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResidentExists(int id)
        {
            return db.Residents.Count(e => e.Id == id) > 0;
        }
    }
}