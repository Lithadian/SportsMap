using System;
using System.Collections.Generic;

namespace API.Models
{
    public partial class AppUser
    {
        public AppUser()
        {
            Events = new HashSet<Event>();
        }

        public int UserId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public short Role { get; set; }
        public int FriendListId { get; set; }
        public string UserDescription { get; set; }
        public string Username { get; set; }

        public virtual ICollection<Event> Events { get; set; }
    }
}
