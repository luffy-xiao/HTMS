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
    public class AppartmentTypesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/AppartmentTypes
        public IQueryable<AppartmentType> GetAppartmentTypes()
        {
            return db.AppartmentTypes;
        }

        // GET: api/AppartmentTypes/5
        [ResponseType(typeof(AppartmentType))]
        public async Task<IHttpActionResult> GetAppartmentType(int id)
        {
            AppartmentType appartmentType = await db.AppartmentTypes.FindAsync(id);
            if (appartmentType == null)
            {
                return NotFound();
            }

            return Ok(appartmentType);
        }

        // PUT: api/AppartmentTypes/5
         [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAppartmentType(int id, AppartmentType appartmentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != appartmentType.Id)
            {
                return BadRequest();
            }

            db.Entry(appartmentType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppartmentTypeExists(id))
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
        [Authorize(Roles = "Administrator")]
        // POST: api/AppartmentTypes
        [ResponseType(typeof(AppartmentType))]
        public async Task<IHttpActionResult> PostAppartmentType(AppartmentType appartmentType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.AppartmentTypes.Add(appartmentType);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = appartmentType.Id }, appartmentType);
        }

        // DELETE: api/AppartmentTypes/5
        [ResponseType(typeof(AppartmentType))]
        public async Task<IHttpActionResult> DeleteAppartmentType(int id)
        {
            AppartmentType appartmentType = await db.AppartmentTypes.FindAsync(id);
            if (appartmentType == null)
            {
                return NotFound();
            }

            db.AppartmentTypes.Remove(appartmentType);
            await db.SaveChangesAsync();

            return Ok(appartmentType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AppartmentTypeExists(int id)
        {
            return db.AppartmentTypes.Count(e => e.Id == id) > 0;
        }
    }
}