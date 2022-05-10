using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly SportsmapContext _context;
        public EventController(SportsmapContext context)
        {
            _context = context;
        }
        [HttpGet("GetEventList")]
        public async Task<List<Event>> Get()
        {
            var Events = from x in _context.Events select x;
            return Events.ToList();
        }

        [HttpGet("GetEventInfo")]
        public async Task<Event> Get(int eventId)
        {
            var Events = from x in _context.Events where x.EventId == eventId select x;
            return Events.FirstOrDefault();
        }

        [HttpPost("CreateEvent")]
        public async Task<ActionResult<Event>> Post(Eventinfo EventInfo)
        {
            try
            {
                var _event = new Event
                {
                   Name = EventInfo.Name,
                   Date = EventInfo.Date,
                   Type = EventInfo.Type,
                   EventStatus = EventInfo.EventStatus,
                   UsersMaxCount = EventInfo.UsersMaxCount,
                   PlaceCoordX = EventInfo.PlaceCoordX,
                   PlaceCoordY = EventInfo.PlaceCoordY,
                   Description = EventInfo.Description,
                  };
                if (EventInfo.EventAuthor != null) _event.EventAuthor = int.Parse(EventInfo.EventAuthor.Remove(7));
                _context.Events.Add(_event);
                _context.SaveChanges();
                return Ok("Event Created");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            
            return BadRequest("Unknown error");

        }

    }
}
