using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SportsmapContext _context;
        public UserController(SportsmapContext context)
        {
            _context = context;
        }
        [HttpGet("GetUserlist")]
        public async Task<List<AppUser>> Get()
        {
            var users = from x in _context.AppUsers select x;
            return users.ToList();
        }
        [HttpPost("AddUser")]
        public async Task<ActionResult<AppUser>> Post(string Id, string Surname)
        {

            return Ok();

        }
    }
}
