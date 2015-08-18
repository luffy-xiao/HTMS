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
    public class PriceTemplatesController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/PriceTemplates
        public IQueryable<PriceTemplate> GetPriceTemplates()
        {
            return db.PriceTemplates;
        }

        /* GET: api/PriceTemplates/5
        [ResponseType(typeof(PriceTemplate))]
        public async Task<IHttpActionResult> GetPriceTemplate(string id)
        {
            PriceTemplate priceTemplate = await db.PriceTemplates.FindAsync(id);
            if (priceTemplate == null)
            {
                return NotFound();
            }

            return Ok(priceTemplate);
        }*/

        // PUT: api/PriceTemplates/5
        [ResponseType(typeof(void))]
        [Authorize(Roles = "Administrator")]
        public async Task<IHttpActionResult> PutPriceTemplate(string Id, PriceTemplate priceTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (Id != priceTemplate.Type+priceTemplate.Floor)
            {
                return BadRequest();
            }
            
            db.Entry(priceTemplate).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
 
            }

            return Ok(priceTemplate);
        }
        
        // POST /api/PriceTemplates HTTP/1.1
        [Authorize(Roles = "Administrator")]
        [ResponseType(typeof(PriceTemplate))]
        public async Task<IHttpActionResult> PostPriceTemplate(PriceTemplate priceTemplate)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.PriceTemplates.Add(priceTemplate);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return StatusCode(HttpStatusCode.InternalServerError);
            }

            return Ok(priceTemplate);
        }
        
        /* DELETE: api/PriceTemplates/5
        [ResponseType(typeof(PriceTemplate))]
        public async Task<IHttpActionResult> DeletePriceTemplate(string id)
        {
            PriceTemplate priceTemplate = await db.PriceTemplates.FindAsync(id);
            if (priceTemplate == null)
            {
                return NotFound();
            }

            db.PriceTemplates.Remove(priceTemplate);
            await db.SaveChangesAsync();

            return Ok(priceTemplate);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PriceTemplateExists(string id)
        {
            return db.PriceTemplates.Count(e => e.Type == id) > 0;
        }
         * */
    }
}