using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using WebApplication6.Models;
using WebApplication6.Providers;
using WebApplication6.Results;
using System.Linq;

namespace WebApplication6.Controllers
{
    
   
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _applicationDbContext;

        public AccountController()
        {
            
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public ApplicationDbContext ApplicationDbContext
        {
            get
            {
                return _applicationDbContext ?? Request.GetOwinContext().Get<ApplicationDbContext>();
            }
            private set
            {
                _applicationDbContext = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }
        [Authorize(Roles = "Administrator,Operator1,Operator2")]
        // POST api/Account/Logout
 
        [Route("api/Account/Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }
         [Authorize(Roles = "Administrator,Operator1,Operator2")]
        // Get api/Account/info
        [Route("api/Account/info")]
        public async Task<User> GetInfo()
        {
            IdentityUser u = await UserManager.FindByIdAsync(User.Identity.GetUserId());
            var user = new User();
            var role = new UserRole();
            user.Id = u.Id;
            user.UserName = u.UserName;
            role.Id = u.Roles.First().RoleId;
            user.Roles = new List<UserRole>();
            user.Roles.Add(role);
           
            return user;
        }
        [Authorize(Roles = "Administrator,Operator1,Operator2")]
        // POST api/Account/SetPassword
        [Route("api/Account/SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Authorize(Roles = "Administrator")]
        [Route("api/Users")]
        public async Task<IHttpActionResult> PostUser(User newuser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new ApplicationUser() { UserName = newuser.UserName};
            IdentityResult result = await UserManager.CreateAsync(user, newuser.Password);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            string role;
            if (newuser.Roles.First().Id.Equals("1"))
            {
               role= "Administrator";
            }
            else if (newuser.Roles.First().Id.Equals("2"))
            {
                role = "Operator1";
            }
            else 
            {
                role = "Operator2";
            }

            result = await UserManager.AddToRoleAsync(user.Id, role);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok(newuser);
        }
         [Authorize(Roles = "Administrator")]
        [Route("api/UserRoles")]
        public List<IdentityRole> GetUserRoles()
        {
           /* List<UserRole> roles = new List<UserRole>();
            foreach(IdentityRole role in ApplicationDbContext.Roles) {
                var userrole = new UserRole();
                userrole.Id = role.Id;
                userrole.Name = role.Name;
                roles.Add(userrole);
            }
            return roles;*/
            return ApplicationDbContext.Roles.ToList<IdentityRole>();

        }

        [Authorize(Roles = "Administrator,Operator1")]
        [Route("api/Users")]
        public List<User> GetUsers()
        {
            List<User> users = new List<User>();
            foreach (IdentityUser u in ApplicationDbContext.Users.ToList<IdentityUser>())
            {
                var user = new User();
                var role = new UserRole();
                user.Id = u.Id;
                user.UserName = u.UserName;
                role.Id = u.Roles.First().RoleId;
                user.Roles = new List<UserRole>();
                user.Roles.Add(role);
                users.Add(user);
            }
            return users;
           
        }

       [Authorize(Roles = "Administrator")]  
        [Route("api/Users/{userId}")]
        public async Task<IHttpActionResult> DeleteUser(string userId)
        {
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }
            await UserManager.DeleteAsync(user);
            return Ok();
            
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region 帮助程序

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // 没有可发送的 ModelState 错误，因此仅返回空 BadRequest。
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits 必须能被 8 整除。", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
