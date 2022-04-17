namespace API.Models
{
	public class FriendList
	{
		public int FriendListId { get; set; }
		public int FriendID { get; set; }

		public FriendList(int FriendListId_, int FriendID_)
		{
			this.FriendListId = FriendListId_;
			this.FriendID = FriendID_;
		}
	}
}
