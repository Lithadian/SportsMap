using System;
using System.Collections.Generic;

namespace API.Models
{
    public partial class Event
    {
        public Event()
        {
            EventUsers = new HashSet<EventUser>();
        }

        public int EventId { get; set; }
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string Type { get; set; }
        public short EventStatus { get; set; }
        public short? UsersMaxCount { get; set; }
        public double? PlaceCoordX { get; set; }
        public double? PlaceCoordY { get; set; }
        public string Description { get; set; }
        public int? EventAuthor { get; set; }

        public virtual AppUser EventAuthorNavigation { get; set; }
        public virtual ICollection<EventUser> EventUsers { get; set; }
    }
}
