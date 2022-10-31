using System;

namespace API.Controllers
{
    public class Eventinfo
    {
        public string Name { get; set; }
        public DateTime? Date { get; set; }
        public string Type { get; set; }
        public short EventStatus { get; set; }
        public short? UsersMaxCount { get; set; }
        public double? PlaceCoordX { get; set; }
        public double? PlaceCoordY { get; set; }
        public string Description { get; set; }
        public string? EventAuthor { get; set; }
    }
}