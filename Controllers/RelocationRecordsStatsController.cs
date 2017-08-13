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
    public class RelocationRecordsStatsController : ApiController
    {
        private WebApplication6Context db = new WebApplication6Context();

        // GET: api/RelocationRecordsStats
        public List<RRMoneyStats> GetRelocationRecordsStats()
        {
            string query = "SELECT RelocationBaseId, RelocationType, COUNT(Id) AS rrCount, "
                + "SUM(TotalPayable) AS TotalPayable, SUM(CashPayable) AS CashPayable, SUM(TotalCompensation) AS TotalCompensation "
                + "FROM dbo.RelocationRecords WHERE Status = 1 "
                + "GROUP BY RelocationBaseId, RelocationType "
                + "ORDER BY RelocationBaseId";
            IEnumerable<RRMoneyStats> stats = db.Database.SqlQuery<RRMoneyStats>(query);
            return stats.ToList();
        }
	}
}