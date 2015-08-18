using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using WebApplication6.Models;

namespace WebApplication6
{
    // 配置此应用程序中使用的应用程序用户管理器。UserManager 在 ASP.NET Identity 中定义，并由此应用程序使用。

    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            // 配置用户名的验证逻辑
            manager.UserValidator = new UserValidator<ApplicationUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                
            };
            // 配置密码的验证逻辑
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            var db = context.Get<ApplicationDbContext>();
            if (db.Roles.Find("1") == null)
            {
                var r = db.Roles.Create();
                r.Id = "1";
                r.Name = "Administrator";
                db.Roles.Add(r);
            }
            if (db.Roles.Find("2") == null)
            {
                var r = db.Roles.Create();
                r.Id = "2";
                r.Name = "Operator1";
                db.Roles.Add(r);
            }
            if (db.Roles.Find("3") == null)
            {
                var r = db.Roles.Create();
                r.Id = "3";
                r.Name = "Operator2";
                db.Roles.Add(r);
            }
            db.SaveChanges();
            if(manager.FindByName("Admin")==null){
                var user = new ApplicationUser() { UserName = "Admin" };
                manager.Create(user, "User@123");
                manager.AddToRole(user.Id, "Administrator");
            }
            
            
            return manager;
        }
    }
}
