using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;
using System.Web.Http.OData;
using System.Web.Http.OData.Extensions;
using System.Web.Http.OData.Query;
namespace Webapplication6.Custom
{
    internal class ODataVerbose
    {
        public IQueryable Items { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long? Count { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string NextPageLink { get; set; }
    }
    public class PagingQueryableAttribute : EnableQueryAttribute
    {
        public bool ForceInlineCount { get; private set; }
        
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            //Let OData implementation handle everything
            base.OnActionExecuted(actionExecutedContext);
            //Examine if we want to return fat result instead of default
            var odataOptions = actionExecutedContext.Request.ODataProperties();  //This is the secret sauce, really.
            object responseObject;
            if (
              ResponseIsValid(actionExecutedContext.Response)
              && actionExecutedContext.Response.TryGetContentValue(out responseObject)
              && responseObject is IQueryable)
            {
                actionExecutedContext.Response =
                  actionExecutedContext.Request.CreateResponse(
                    HttpStatusCode.OK,
                    new ODataVerbose
                    {
                        Items = (IQueryable)responseObject,
                        Count = odataOptions.TotalCount,
                        NextPageLink = (odataOptions.NextLink == null) ? null : odataOptions.NextLink.PathAndQuery
                    }
                  );
            }
        }
        private bool ResponseIsValid(HttpResponseMessage response)
        {
            return (response != null && response.StatusCode == HttpStatusCode.OK && (response.Content is ObjectContent));
        }
    }
}