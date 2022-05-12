using System;
using System.Collections.Generic;

namespace API.Models
{
    public partial class EventUser
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public int Id { get; set; }

        public virtual Event Event { get; set; }
        public virtual AppUser User { get; set; }
    }
}
