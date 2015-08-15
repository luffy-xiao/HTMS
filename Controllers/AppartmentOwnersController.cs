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
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Authorize]
    public class AppartmentOwnersController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/AppartmentOwners
        public IQueryable<AppartmentOwner> GetAppartmentOwners()
        {
            return db.AppartmentOwners;
        }

        // GET: api/AppartmentOwners/5
        [ResponseType(typeof(AppartmentOwner))]
        public async Task<IHttpActionResult> GetAppartmentOwner(int id)
        {
            AppartmentOwner appartmentOwner = await db.AppartmentOwners.FindAsync(id);
            if (appartmentOwner == null)
            {
                return NotFound();
            }

            return Ok(appartmentOwner);
        }

        // PUT: api/AppartmentOwners/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAppartmentOwner(int id, AppartmentOwner appartmentOwner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != appartmentOwner.Id)
            {
                return BadRequest();
            }
            var origin = db.AppartmentOwners.Where(c => c.Id == id).AsNoTracking().First();

            //
            db.Entry(appartmentOwner).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppartmentOwnerExists(id))
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

        // POST: api/AppartmentOwners
        [ResponseType(typeof(AppartmentOwner))]
        public async Task<IHttpActionResult> PostAppartmentOwner(AppartmentOwner appartmentOwner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AppartmentOwners.Add(appartmentOwner);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = appartmentOwner.Id }, appartmentOwner);
        }

        // DELETE: api/AppartmentOwners/5
        [ResponseType(typeof(AppartmentOwner))]
        public async Task<IHttpActionResult> DeleteAppartmentOwner(int id)
        {
            AppartmentOwner appartmentOwner = await db.AppartmentOwners.FindAsync(id);
            if (appartmentOwner == null)
            {
                return NotFound();
            }

            db.AppartmentOwners.Remove(appartmentOwner);
            await db.SaveChangesAsync();

            return Ok(appartmentOwner);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AppartmentOwnerExists(int id)
        {
            return db.AppartmentOwners.Count(e => e.Id == id) > 0;
        }
    }
}