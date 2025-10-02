using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.ReorderSections;

public class ReorderSectionsHandler(
    IWebsiteSectionRepository websiteSectionRepository)
    : ICommandHandler<ReorderSectionsCommand, ReorderSectionsResult>
{
    public async Task<ReorderSectionsResult> Handle(
        ReorderSectionsCommand request,
        CancellationToken cancellationToken)
    {
        // Get all sections
        var sectionIds = request.SectionOrders.Select(so => so.SectionId).ToList();
        var sections = await websiteSectionRepository.FindAsync(s => sectionIds.Contains(s.Id));
        var sectionsList = sections.ToList();

        if (sectionsList.Count != request.SectionOrders.Count)
        {
            throw new InvalidOperationException("Some sections were not found");
        }

        // Update sort orders
        foreach (var sectionOrder in request.SectionOrders)
        {
            var section = sectionsList.FirstOrDefault(s => s.Id == sectionOrder.SectionId);
            if (section != null)
            {
                section.SortOrder = sectionOrder.SortOrder;
                await websiteSectionRepository.UpdateAsync(section);
            }
        }

        return new ReorderSectionsResult(true);
    }
}
