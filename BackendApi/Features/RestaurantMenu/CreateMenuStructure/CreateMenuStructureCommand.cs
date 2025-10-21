using BackendApi.Shared.Contracts;

namespace BackendApi.Features.RestaurantMenu.CreateMenuStructure;

public class CreateMenuStructureCommand : ICommand<CreateMenuStructureResult>
{
    public string RestaurantId { get; set; } = string.Empty;
    public string MenuName { get; set; } = string.Empty;
    public string MenuDescription { get; set; } = string.Empty;
    public List<CreateCategoryCommand> Categories { get; set; } = [];
}

public class CreateCategoryCommand
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int OrderIndex { get; set; }
    public List<CreateStructureMenuItemCommand> Items { get; set; } = [];
}

public class CreateStructureMenuItemCommand
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int OrderIndex { get; set; }
    public bool IsAvailable { get; set; } = true;
}
