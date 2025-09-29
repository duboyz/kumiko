using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.ParseMenuImage;

public class ParseMenuImageCommand : ICommand<ParseMenuImageResult>
{
    public Guid RestaurantId { get; set; }
    public IFormFile Image { get; set; } = null!;
    public string? Annotations { get; set; } // JSON string of annotations
}

public class AnnotationDto
{
    public string Type { get; set; } = string.Empty; // "category", "item", "price"
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Text { get; set; } = string.Empty;
}

public class ParseMenuImageResult
{
    public Guid MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public string MenuDescription { get; set; } = string.Empty;
    public List<ParsedCategoryDto> Categories { get; set; } = [];
}

public class ParsedCategoryDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public List<ParsedMenuItemDto> Items { get; set; } = [];
}

public class ParsedMenuItemDto
{
    public Guid ItemId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int OrderIndex { get; set; }
}
