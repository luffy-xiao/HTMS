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
        public IQueryable Results { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long? __count { get; set; }
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string __next { get; set; }
    }
    public class PagingQueryableAttribute : EnableQueryAttribute
    {
        public bool ForceInlineCount { get; private set; }
        public PagingQueryableAttribute(int PageSize = 100, bool forceInlineCount = true)
        {
            this.ForceInlineCount = forceInlineCount;
            //Enables server paging by default
            if (this.PageSize == 0)
            {
                this.PageSize = PageSize;
            }
        }
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            //Enables inlinecount by default if forced to do so by adding to query string
            if (this.ForceInlineCount && !actionExecutedContext.Request.GetQueryNameValuePairs().Any(c => c.Key == "inlinecount"))
            {
                var requestUri = actionExecutedContext.Request.RequestUri.ToString();
                if (string.IsNullOrEmpty(actionExecutedContext.Request.RequestUri.Query))
                    requestUri += "?$inlinecount=allpages";
                else
                    requestUri += "&$inlinecount=allpages";
                actionExecutedContext.Request.RequestUri = new Uri(requestUri);
            }
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
                        Results = (IQueryable)responseObject,
                        __count = odataOptions.TotalCount,
                        __next = (odataOptions.NextLink == null) ? null : odataOptions.NextLink.PathAndQuery
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