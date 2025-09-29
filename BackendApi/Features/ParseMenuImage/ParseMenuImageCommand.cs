using BackendApi.Shared.Contracts;


public class ParseMenuImageCommand : ICommand<ParseMenuImageResult>
{
    public Guid RestaurantId { get; set; }
    public byte[] ImageData { get; set; } = [];
    public string ImageMimeType { get; set; } = string.Empty;
    public List<MenuAnnotation> Annotations { get; set; } = [];
}

public class MenuAnnotation
{
    public string Type { get; set; } = string.Empty; // "category", "item", "price", "description"
    public int X { get; set; }
    public int Y { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public string Color { get; set; } = string.Empty;
}

public record ParseMenuImageResult(
    List<ParsedCategory> Categories,
    string SuggestedMenuName,
    string SuggestedMenuDescription
);

public record ParsedCategory(
    string Name,
    string Description,
    int OrderIndex,
    List<ParsedMenuItem> Items
);

public record ParsedMenuItem(
    string Name,
    string Description,
    decimal Price,
    int OrderIndex
);
