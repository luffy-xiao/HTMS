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
    public class FacingTypesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/FacingTypes
        public IQueryable<FacingType> GetFacingTypes()
        {
            return db.FacingTypes;
        }

        // GET: api/FacingTypes/5
        [ResponseType(typeof(FacingType))]
        public async Task<IHttpActionResult> GetFacingType(int id)
        {
            FacingType facingType = await db.FacingTypes.FindAsync(id);
            if (facingType == null)
            {
                return NotFound();
            }

            return Ok(facingType);
        }
        [Authorize(Roles = "Administrator")]
        // PUT: api/FacingTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutFacingType(int id, FacingType facingType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != facingType.Id)
            {
                return BadRequest();
            }

            db.Entry(facingType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacingTypeExists(id))
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
        // POST: api/FacingTypes
        [ResponseType(typeof(FacingType))]
        public async Task<IHttpActionResult> PostFacingType(FacingType facingType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.FacingTypes.Add(facingType);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = facingType.Id }, facingType);
        }

        // DELETE: api/FacingTypes/5
        [ResponseType(typeof(FacingType))]
        public async Task<IHttpActionResult> DeleteFacingType(int id)
        {
            FacingType facingType = await db.FacingTypes.FindAsync(id);
            if (facingType == null)
            {
                return NotFound();
            }

            db.FacingTypes.Remove(facingType);
            await db.SaveChangesAsync();

            return Ok(facingType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FacingTypeExists(int id)
        {
            return db.FacingTypes.Count(e => e.Id == id) > 0;
        }
    }
}