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
    public class CommunitiesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Communities
        public IQueryable<Community> GetCommunities()
        {
            return db.Communities;
        }

        // GET: api/Communities/5

        [ResponseType(typeof(Community))]
        public async Task<IHttpActionResult> GetCommunity(int id)
        {
            Community community = await db.Communities.FindAsync(id);
            if (community == null)
            {
                return NotFound();
            }

            return Ok(community);
        }

        // PUT: api/Communities/5
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutCommunity(int id, Community community)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != community.Id)
            {
                return BadRequest();
            }

            db.Entry(community).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommunityExists(id))
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

        // POST: api/Communities
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(Community))]
        public async Task<IHttpActionResult> PostCommunity(Community community)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Communities.Add(community);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = community.Id }, community);
        }

        // DELETE: api/Communities/5
        [ResponseType(typeof(Community))]
        public async Task<IHttpActionResult> DeleteCommunity(int id)
        {
            Community community = await db.Communities.FindAsync(id);
            if (community == null)
            {
                return NotFound();
            }

            db.Communities.Remove(community);
            await db.SaveChangesAsync();

            return Ok(community);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CommunityExists(int id)
        {
            return db.Communities.Count(e => e.Id == id) > 0;
        }
    }
}