using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Models
{
    public class TodoItem
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; }= string.Empty;

        [Required]
        public string Priority { get; set; } = "Low";

        [Required]
        public string Category { get; set; } = "Work"; 

        internal static object Find(Func<object, bool> value)
        {
            throw new NotImplementedException();
        }
    }
}

