namespace API.Models
{
	public class AppUser
	{
		public int UserId { get; set; }
		public string Name { get; set; }
		public string Surname { get; set; }
		public string Email { get; set; }
		public int Role { get; set; }
		public int FriendListId { get; set; }
		public string UserDescription { get; set; }


	}
}
