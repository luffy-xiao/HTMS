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
    [Authorize(Roles = "Administrator")]
    public class HeadersController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Headers
        [EnableQuery]
        public IQueryable<Header> GetHeaders()
        {
            return db.Headers;
        }

        // GET: api/Headers/5
        [ResponseType(typeof(Header))]
        public async Task<IHttpActionResult> GetHeader(int id)
        {
            Header header = await db.Headers.FindAsync(id);
            if (header == null)
            {
                return NotFound();
            }

            return Ok(header);
        }

        // PUT: api/Headers/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutHeader(int id, Header header)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != header.Id)
            {
                return BadRequest();
            }

            db.Entry(header).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HeaderExists(id))
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

        // POST: api/Headers
        [ResponseType(typeof(Header))]
        public async Task<IHttpActionResult> PostHeader(Header header)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Headers.Add(header);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = header.Id }, header);
        }

        // DELETE: api/Headers/5
        [ResponseType(typeof(Header))]
        public async Task<IHttpActionResult> DeleteHeader(int id)
        {
            Header header = await db.Headers.FindAsync(id);
            if (header == null)
            {
                return NotFound();
            }

            db.Headers.Remove(header);
            await db.SaveChangesAsync();

            return Ok(header);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool HeaderExists(int id)
        {
            return db.Headers.Count(e => e.Id == id) > 0;
        }
    }
}