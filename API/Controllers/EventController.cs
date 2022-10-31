using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<ActionResult> PostJoinEvent(EventParticipant eventParticipant)
        {

            try
            {
                var _eventId = eventParticipant.EventId;
                var _userId = int.Parse(eventParticipant.UserId.Remove(7));
                var result = _context.EventUsers.Where(x => x.EventId == _eventId && x.UserId == _userId);
                if (result.Any())
                {
                    _context.RemoveRange(result);
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
        [HttpPost("GetEventParticipants")]
        public async Task<List<EventParticipantsId>> GetEventParticipants(List<Event> eventlist)
        {
            var listParticipats = new List<EventParticipantsId>();
            foreach (var ev in eventlist)
            {
                var participantList = _context.EventUsers.Where(x => x.EventId == ev.EventId).Select(x => x.UserId).ToList();
                var _username = _context.AppUsers.Where(x => x.UserId == ev.EventAuthor).Select(x => x.Username).FirstOrDefault().ToString();
                listParticipats.Add(new EventParticipantsId { Participants = participantList, EventId = ev.EventId, username = _username });
            }
            return listParticipats;
        }
    }
}
