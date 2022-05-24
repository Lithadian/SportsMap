using System.Collections.Generic;

namespace API.Controllers
{
    public class EventParticipantsId
    {
        public int EventId { get; set; }
        public List<int> Participants { get; set; }
        public string username { get; set; }
    }
}
