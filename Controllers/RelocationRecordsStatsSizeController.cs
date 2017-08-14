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
using Webapplication6.Custom;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    public class RelocationRecordsStatsSizeController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/RelocationRecordsStatsSize
        public List<RRSizeStats> GetRelocationRecordsStatsSize()
        {
            string query = "select RelocationBaseId, sum(MeasuredSize) as MeasuredSize, "
                + "sum(EffectiveSize) as EffectiveSize, sum(NoConstructionSize) as NoConstructionSize, " 
                + "sum(UncertifiedSize) as UncertifiedSize from dbo.RelocationRecords "
                + "where Status = 1 group by RelocationBaseId";
            IEnumerable<RRSizeStats> stats = db.Database.SqlQuery<RRSizeStats>(query);
            return stats.ToList();
        }
	}
}