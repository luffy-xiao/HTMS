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
    public class ChangesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Changes
        public IQueryable<Change> GetChanges()
        {
            return db.Changes;
        }

        // GET: api/Changes/5
        [ResponseType(typeof(Change))]
        public async Task<IHttpActionResult> GetChange(int id)
        {
            Change change = await db.Changes.FindAsync(id);
            if (change == null)
            {
                return NotFound();
            }

            return Ok(change);
        }

        // PUT: api/Changes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutChange(int id, Change change)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != change.Id)
            {
                return BadRequest();
            }

            db.Entry(change).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChangeExists(id))
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

        // POST: api/Changes
        [ResponseType(typeof(Change))]
        public async Task<IHttpActionResult> PostChange(Change change)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Changes.Add(change);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = change.Id }, change);
        }

        // DELETE: api/Changes/5
        [ResponseType(typeof(Change))]
        public async Task<IHttpActionResult> DeleteChange(int id)
        {
            Change change = await db.Changes.FindAsync(id);
            if (change == null)
            {
                return NotFound();
            }

            db.Changes.Remove(change);
            await db.SaveChangesAsync();

            return Ok(change);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ChangeExists(int id)
        {
            return db.Changes.Count(e => e.Id == id) > 0;
        }
    }
}