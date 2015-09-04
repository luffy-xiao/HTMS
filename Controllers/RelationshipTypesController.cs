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
    public class RelationshipTypesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/RelationshipTypes
        public IQueryable<RelationshipType> GetRelationshipTypes()
        {
            return db.RelationshipTypes;
        }

        // GET: api/RelationshipTypes/5
        [ResponseType(typeof(RelationshipType))]
        public async Task<IHttpActionResult> GetRelationshipTypes(string id)
        {
            RelationshipType relationshipType = await db.RelationshipTypes.FindAsync(id);
            if (relationshipType == null)
            {
                return NotFound();
            }

            return Ok(relationshipType);
        }
        [Authorize(Roles = "Administrator")]
        // PUT: api/RelationshipTypes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutRelationshipTypes(int id, RelationshipType relationshipType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != relationshipType.Id)
            {
                return BadRequest();
            }

            db.Entry(relationshipType).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RelationshipTypesExists(id))
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
        // POST: api/RelationshipTypes
        [ResponseType(typeof(RelationshipType))]
        public async Task<IHttpActionResult> PostRelationshipTypes(RelationshipType relationshipType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.RelationshipTypes.Add(relationshipType);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RelationshipTypesExists(relationshipType.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = relationshipType.Id }, relationshipType);
        }

        // DELETE: api/RelationshipTypes/5
        [ResponseType(typeof(RelationshipType))]
        public async Task<IHttpActionResult> DeleteRelationshipTypes(int id)
        {
            RelationshipType relationshipTypes = await db.RelationshipTypes.FindAsync(id);
            if (relationshipTypes == null)
            {
                return NotFound();
            }

            db.RelationshipTypes.Remove(relationshipTypes);
            await db.SaveChangesAsync();

            return Ok(relationshipTypes);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool RelationshipTypesExists(int id)
        {
            return db.RelationshipTypes.Count(e => e.Id == id) > 0;
        }
    }
}