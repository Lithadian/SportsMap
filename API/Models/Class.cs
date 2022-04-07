namespace API.Models
{
    public class Event
    {
        public DateTime Date { get; set; }
        public String Place { get; set; }
        public String Name { get; set; }
        public int Type { get; set; }
        public List<AppUser> UsersJoined { get; set; }
    }
}
