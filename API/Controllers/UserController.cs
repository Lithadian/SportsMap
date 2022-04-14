using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet("GetUserlist")]
        public IEnumerable<AppUser> Get()
        {
            return Enumerable.Range(1,10).Select(x=> new AppUser
            {
                Name =x,
                Surname =x,
                Email =x,
                Role =x,
            }).ToArray();
        }
        [HttpPost("AddUser")]
        public async Task<ActionResult<AppUser>> Post(string Name, string Surname)
        {

            return Ok();
        }
    }
}
