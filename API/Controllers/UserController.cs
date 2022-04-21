using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        public IEnumerable<AppUser> Get()
        {
            return Enumerable.Range(1, 10).Select(x => new AppUser
            {
                Name = x.ToString(),
                Surname = x.ToString(),
                Email = x.ToString(),
                Role = (short)x,
            }).ToArray();
        }
        [HttpPost("AddUser")]
        public async Task<ActionResult<AppUser>> Post(string Id, string Surname)
        {

            return Ok();

        }
    }
}
