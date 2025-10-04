using BackendApi.Data;
using BackendApi.Shared.Contracts;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Features.Allergen.GetAllergens;

public class GetAllergensHandler(ApplicationDbContext context) : IQueryHandler<GetAllergensQuery, GetAllergensResult>
{
    public async Task<GetAllergensResult> Handle(GetAllergensQuery request, CancellationToken cancellationToken)
    {
        // Seed allergens if none exist
        if (!await context.Allergens.AnyAsync(cancellationToken))
        {
            var allergens = new[]
            {
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Gluten", Description = "Contains gluten from wheat, barley, rye, or oats", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Crustaceans", Description = "Contains crustaceans such as prawns, crabs, lobster, and crayfish", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Eggs", Description = "Contains eggs or egg products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Fish", Description = "Contains fish or fish products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Peanuts", Description = "Contains peanuts or peanut products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Soy", Description = "Contains soy or soy products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Milk", Description = "Contains milk or dairy products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Tree Nuts", Description = "Contains tree nuts such as almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia nuts", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Celery", Description = "Contains celery or celery products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Mustard", Description = "Contains mustard or mustard products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Sesame", Description = "Contains sesame seeds or sesame products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Sulphites", Description = "Contains sulphites at levels above 10mg/kg or 10mg/litre", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Lupin", Description = "Contains lupin or lupin products", CreatedAt = DateTime.UtcNow },
                new Entities.Allergen { Id = Guid.NewGuid(), Name = "Molluscs", Description = "Contains molluscs such as mussels, oysters, snails, and squid", CreatedAt = DateTime.UtcNow }
            };

            context.Allergens.AddRange(allergens);
            await context.SaveChangesAsync(cancellationToken);
        }

        var allergenList = await context.Allergens
            .OrderBy(a => a.Name)
            .Select(a => new AllergenDto(a.Id, a.Name, a.Description))
            .ToListAsync(cancellationToken);

        return new GetAllergensResult(allergenList);
    }
}

