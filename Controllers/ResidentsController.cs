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
using System.Web.Http.OData.Query;
using Webapplication6.Custom;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
   [Authorize]
    public class ResidentsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/Residents
        [PagingQueryable(PageSize=50)]
        public IQueryable<Resident> GetResidents()
        {
            return db.Residents.AsQueryable();
        }

        // GET: api/Residents
        /*public PageResult<Resident> Get(ODataQueryOptions<Resident> options)
        {
            ODataQuerySettings settings = new ODataQuerySettings()
            {
                PageSize = 5
            };

            IQueryable results = options.ApplyTo(db.Residents.AsQueryable(), settings);

            return new PageResult<Resident>(
                results as IEnumerable<Resident>,
                Request.GetNextPageLink(),
                Request.GetInlineCount());
        }*/

        // GET: api/Residents/5
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> GetResident(int id)
        {
            Resident resident = await db.Residents.FindAsync(id);
            if (resident == null)
            {
                return NotFound();
            }

            return Ok(resident);
        }

        // PUT: api/Residents/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutResident(int id, Resident resident)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != resident.Id)
            {
                return BadRequest();
            }
            var resident_in_db = await db.Residents.FindAsync(id);
            if (resident_in_db.Status == 0 && resident.Status == 1)
            {
                resident.Status = 1;
            }
            else if(!resident.IdentityCard.Equals(resident_in_db.IdentityCard))
            {
                resident.Status = db.Residents.Count(re => re.IdentityCard.Equals(resident.IdentityCard) && !re.Id.Equals(resident.Id)) > 0 ? 0 : 1;
            }


            db.Entry(resident_in_db).State = EntityState.Detached;
            db.Entry(resident).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResidentExists(id))
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

        // POST: api/Residents
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> PostResident(Resident resident)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (db.Residents.Count(re => re.IdentityCard.Equals(resident.IdentityCard)) > 0) // resident already exist
            {
                resident.Status = 0;
                
            }

            db.Residents.Add(resident);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = resident.Id }, resident);
        }

        // DELETE: api/Residents/5
        [ResponseType(typeof(Resident))]
        public async Task<IHttpActionResult> DeleteResident(int id)
        {
            Resident resident = await db.Residents.FindAsync(id);
            if (resident == null)
            {
                return NotFound();
            }

            db.Residents.Remove(resident);
            await db.SaveChangesAsync();

            return Ok(resident);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResidentExists(int id)
        {
            return db.Residents.Count(e => e.Id == id) > 0;
        }
    }
}