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
    public class AppartmentsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Appartments
        [EnableQuery]
        public IQueryable<Appartment> GetAppartments()
        {
            return db.Appartments.Include(a=>a.Community);
        }

        // GET: api/Appartments/5
        [ResponseType(typeof(Appartment))]
        public async Task<IHttpActionResult> GetAppartment(int id)
        {
            Appartment appartment = await db.Appartments.FindAsync(id);
            if (appartment == null)
            {
                return NotFound();
            }

            return Ok(appartment);
        }

        // PUT: api/Appartments/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAppartment(int id, Appartment appartment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != appartment.Id)
            {
                return BadRequest();
            }
            var origin = db.Appartments.Where(i => i.Id.Equals(id)).AsNoTracking().First();
            db.Changes.AddRange(Helper.Logger.ChangeRecords<Appartment>(origin, appartment, RequestContext.Principal.Identity.Name));
            db.Entry(appartment).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppartmentExists(id))
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

        // POST: api/Appartments
        [ResponseType(typeof(Appartment))]
        public async Task<IHttpActionResult> PostAppartment(Appartment appartment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                if (db.Appartments.Count(e => e.CommunityId == appartment.CommunityId
                    && e.BuildingNumber == appartment.BuildingNumber && e.UnitNumber == e.UnitNumber
                    && e.DoorNumber == appartment.DoorNumber) > 0)
                {
                    return StatusCode(HttpStatusCode.Conflict);
                }
                if (appartment.Status == null)
                {
                    appartment.Status = "可售";
                }
                db.Appartments.Add(appartment);
                await db.SaveChangesAsync();
                db.Changes.Add(Helper.Logger.NewRecord<Appartment>(appartment,RequestContext.Principal.Identity.Name));
                await db.SaveChangesAsync();
                db.Entry(appartment).Reference(b => b.Community).Load();
                transaction.Commit();
            }
            return CreatedAtRoute("DefaultApi", new { id = appartment.Id }, appartment);
        }

        // DELETE: api/Appartments/5
        [ResponseType(typeof(Appartment))]
        public async Task<IHttpActionResult> DeleteAppartment(int id)
        {
            Appartment appartment = await db.Appartments.FindAsync(id);
            if (appartment == null)
            {
                return NotFound();
            }
            using (var transaction = db.Database.BeginTransaction())
            {
                db.Changes.Add(Helper.Logger.DeleteRecord<Appartment>(appartment, RequestContext.Principal.Identity.Name));
                db.Appartments.Remove(appartment);
                await db.SaveChangesAsync();
                transaction.Commit();
            }
            return Ok(appartment);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AppartmentExists(int id)
        {
            return db.Appartments.Count(e => e.Id == id) > 0;
        }
    }
}