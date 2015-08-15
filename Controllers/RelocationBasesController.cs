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
    [Authorize(Roles="Administrator,Operator")]
    public class RelocationBasesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/RelocationBases
        public IQueryable<RelocationBase> GetRelocationBases()
        {
            return db.RelocationBases;
        }

        // GET: api/RelocationBases/5
        [ResponseType(typeof(RelocationBase))]
        public async Task<IHttpActionResult> GetRelocationBase(int id)
        {
            RelocationBase relocationBase = await db.RelocationBases.FindAsync(id);
            if (relocationBase == null)
            {
                return NotFound();
            }

            return Ok(relocationBase);
        }
        [Authorize(Roles = "Administrator")]
        // PUT: api/RelocationBases/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRelocationBase(int id, RelocationBase relocationBase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != relocationBase.Id)
            {
                return BadRequest();
            }

            db.Entry(relocationBase).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RelocationBaseExists(id))
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
        // POST: api/RelocationBases
        [ResponseType(typeof(RelocationBase))]
        public async Task<IHttpActionResult> PostRelocationBase(RelocationBase relocationBase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RelocationBases.Add(relocationBase);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = relocationBase.Id }, relocationBase);
        }

        // DELETE: api/RelocationBases/5
        [ResponseType(typeof(RelocationBase))]
        public async Task<IHttpActionResult> DeleteRelocationBase(int id)
        {
            RelocationBase relocationBase = await db.RelocationBases.FindAsync(id);
            if (relocationBase == null)
            {
                return NotFound();
            }

            db.RelocationBases.Remove(relocationBase);
            await db.SaveChangesAsync();

            return Ok(relocationBase);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RelocationBaseExists(int id)
        {
            return db.RelocationBases.Count(e => e.Id == id) > 0;
        }
    }
}