using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateTextSection;

public class UpdateTextSectionHandler(
    ITextSectionRepository textSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<UpdateTextSectionCommand, UpdateTextSectionResult>
{
    public async Task<UpdateTextSectionResult> Handle(UpdateTextSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the text section with related data
        var textSections = await textSectionRepository.FindWithWebsiteAsync(t => t.Id == request.TextSectionId);
        var textSection = textSections.FirstOrDefault();

        if (textSection == null)
        {
            throw new InvalidOperationException("Text section not found");
        }

        // Check user permissions for this website
        var hasAccess = false;
        if (textSection.WebsiteSection.WebsitePage.Website.RestaurantId.HasValue)
        {
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == textSection.WebsiteSection.WebsitePage.Website.RestaurantId.Value);
            hasAccess = userRestaurants.Any();
        }
        else if (textSection.WebsiteSection.WebsitePage.Website.HospitalityId.HasValue)
        {
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == textSection.WebsiteSection.WebsitePage.Website.HospitalityId.Value);
            hasAccess = userHospitalities.Any();
        }

        if (!hasAccess)
        {
            throw new InvalidOperationException("Access denied");
        }

        // Update the text section
        textSection.Title = request.Title;
        textSection.Text = request.Text;
        textSection.AlignText = request.AlignText;
        textSection.TextColor = request.TextColor;

        await textSectionRepository.UpdateAsync(textSection);

        return new UpdateTextSectionResult(textSection.Id);
    }
}