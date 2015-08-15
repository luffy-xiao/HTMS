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
    public class DecorationTypesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/DecorationTypes
        public IQueryable<DecorationType> GetDecorationTypes()
        {
            return db.DecorationTypes;
        }

        // GET: api/DecorationTypes/5
        [ResponseType(typeof(DecorationType))]
        public async Task<IHttpActionResult> GetDecorationType(int id)
        {
            DecorationType decorationType = await db.DecorationTypes.FindAsync(id);
            if (decorationType == null)
            {
                return NotFound();
            }

            return Ok(decorationType);
        }
        [Authorize(Roles = "Administrator")]
        // PUT: api/DecorationTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDecorationType(int id, DecorationType decorationType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != decorationType.Id)
            {
                return BadRequest();
            }

            db.Entry(decorationType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DecorationTypeExists(id))
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
        // POST: api/DecorationTypes
        [ResponseType(typeof(DecorationType))]
        public async Task<IHttpActionResult> PostDecorationType(DecorationType decorationType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.DecorationTypes.Add(decorationType);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = decorationType.Id }, decorationType);
        }

        // DELETE: api/DecorationTypes/5
        [ResponseType(typeof(DecorationType))]
        public async Task<IHttpActionResult> DeleteDecorationType(int id)
        {
            DecorationType decorationType = await db.DecorationTypes.FindAsync(id);
            if (decorationType == null)
            {
                return NotFound();
            }

            db.DecorationTypes.Remove(decorationType);
            await db.SaveChangesAsync();

            return Ok(decorationType);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DecorationTypeExists(int id)
        {
            return db.DecorationTypes.Count(e => e.Id == id) > 0;
        }
    }
}