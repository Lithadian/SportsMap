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
        public async Task<List<Event>> GetEventList()
        {
            var Events = from x in _context.Events select x;
            return Events.ToList();
        }

        [HttpGet("GetEventInfo")]
        public async Task<Event> GetEventInfo(int eventId)
        {
            var Events = from x in _context.Events where x.EventId == eventId select x;
            return Events.FirstOrDefault();
        }

        [HttpPost("CreateEvent")]
        public async Task<ActionResult<Event>> PostCreateEvent(Eventinfo EventInfo)
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
                return Ok("{}");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return BadRequest("Unknown error");

        }

        [HttpPost("JoinEvent")]
        public async Task<ActionResult> PostJoinEvent(string eventId, string userId)
        {

            try
            {
                var _eventId = int.Parse(eventId);
                var _userId = int.Parse(userId.Remove(7));
                var result = from x in _context.EventUsers where x.EventId == _eventId && x.UserId == _userId select x;
                if (result.Any())
                {
                    _context.Remove(result);
                    _context.SaveChanges();
                    return Ok("{}");
                }
                else
                {
                    var eventuser = new EventUser();
                    eventuser.UserId = _userId;
                    eventuser.EventId = _eventId;
                    _context.Add(eventuser);
                    _context.SaveChanges();
                    return Ok("{}");
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return BadRequest("Unknown error");

        }

        [HttpGet("GetEventParticipants")]
        public async Task<List<EventUser>> GetEventParticipants(int eventId)
        {
            var Users = from x in _context.EventUsers where x.EventId == eventId select x;
            return Users.ToList();
        }
    }
}
