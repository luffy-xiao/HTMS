using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using WebApplication6.Models;

namespace WebApplication6.Helper
{
    public class Logger
    {
        public static ICollection<Change> ChangeRecords<T>(T oldobject,T newobject, string username ){
            Type type = newobject.GetType();
            string entityid = "";
            List<Change> results = new List<Change>();
            foreach (PropertyInfo propertyInfo in type.GetProperties())
            {
                if (propertyInfo.CanRead && propertyInfo.Name.Equals("Id"))
                {
                    entityid = propertyInfo.GetValue(newobject).ToString();
                }

            }
            if (entityid.Equals(""))
            {
                throw new MissingMemberException();
            }
            if (oldobject == null)
            {
                Change change = new Change();
                change.EntityId = entityid;
                change.EntityType = newobject.GetType().ToString();
                results.Add(change);
            }
            else
            {
  
                foreach (PropertyInfo propertyInfo in type.GetProperties())
                {
                    var p = propertyInfo;
                    if (propertyInfo!=null && propertyInfo.CanRead)
                    {
                        object firstValue = propertyInfo.GetValue(oldobject, null);
                        object secondValue = propertyInfo.GetValue(newobject, null);
                     
                        if (firstValue==null || secondValue==null)
                        {
                          
                        }
                      
                        else if (!object.Equals(firstValue, secondValue))
                        {
                            var change = new Change();
                            change.EntityId = entityid;
                            change.EntityType = type.Name;
                            change.Field = propertyInfo.Name;
                            change.OldValue = firstValue.ToString();
                            change.NewValue = secondValue.ToString();
                            change.Time = DateTime.Now;
                            change.UserName = username;
                            change.Type = "Modify";
                            results.Add(change);
                        }
                    }

                }
            }

            return results;
        }
        public static Change NewRecord<T>(T newobject,string username)
        {
            Type type = newobject.GetType();
            string entityid = "";
             Change change = new Change();
            foreach (PropertyInfo propertyInfo in type.GetProperties())
            {
                if (propertyInfo.CanRead && propertyInfo.Name.Equals("Id"))
                {
                    entityid = propertyInfo.GetValue(newobject).ToString();
                }

            }
            if (entityid.Equals(""))
            {
                throw new MissingMemberException();
            }
           
            change.Field = "";
            change.EntityId = entityid;
            change.EntityType = type.Name.ToString();
            change.OldValue = change.NewValue = "";
            change.Time = DateTime.Now;
            change.UserName = username;
            change.Type = "Create";
            return change;
        }
        public static Change DeleteRecord<T>(T newobject, string username)
        {
            Type type = newobject.GetType();
            string entityid = "";
            Change change = new Change();
            foreach (PropertyInfo propertyInfo in type.GetProperties())
            {
                if (propertyInfo.CanRead && propertyInfo.Name.Equals("Id"))
                {
                    entityid = propertyInfo.GetValue(newobject).ToString();
                }

            }
            if (entityid.Equals(""))
            {
                throw new MissingMemberException();
            }

            change.Field = "";
            change.EntityId = entityid;
            change.EntityType = type.Name.ToString().Split('_')[0];
            change.OldValue = change.NewValue = "";
            change.Time = DateTime.Now;
            change.UserName = username;
            change.Type = "Delete";
            return change;
        }
    }
}