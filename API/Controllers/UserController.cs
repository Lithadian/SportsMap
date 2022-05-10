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
        //call to goolge api validate 
        // bearer tocknen donten
        //claims dostupi
        [HttpGet("GetUserlist")]
        public async Task<List<AppUser>> Get()
        {
            var users = from x in _context.AppUsers select x;
            return users.ToList();
        }
        [HttpPost("LoginUser")]
        public async Task<ActionResult<AppUser>> Post(UserInfo userInfo)
        {
            if (userInfo == null)  return BadRequest(); 
            var usersExist = from x in _context.AppUsers 
                             where int.Parse(userInfo.UserId.Remove(7)) == x.UserId
                             select x;
            
            if (usersExist.Any())
            {
                return Ok(usersExist.FirstOrDefault().Role);
            }
            else
            {
                try
                {
                    var newUser = new AppUser
                    {
                        UserId = int.Parse(userInfo.UserId.Remove(7)),
                        Email = userInfo.Email,
                        Name = userInfo.Name,
                        Surname = userInfo.Surname,
                        Username = userInfo.Email.ToLower().Remove(userInfo.Email.IndexOf("@")).Trim(),
                        Role = 1,
                      
                    };
                    _context.AppUsers.Add(newUser);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
                return Ok("User Created");
            }
            return Ok();

        }
        //Edit user info
        //Edit user role**
        //CRUD PASAKUMS + Get pasakums list

    }
}
