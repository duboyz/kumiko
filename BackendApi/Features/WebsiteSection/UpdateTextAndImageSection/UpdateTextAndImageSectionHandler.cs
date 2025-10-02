using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.WebsiteSection.UpdateTextAndImageSection;

public class UpdateTextAndImageSectionHandler(
    ITextAndImageSectionRepository textAndImageSectionRepository,
    IUserRestaurantRepository userRestaurantRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : ICommandHandler<UpdateTextAndImageSectionCommand, UpdateTextAndImageSectionResult>
{
    public async Task<UpdateTextAndImageSectionResult> Handle(UpdateTextAndImageSectionCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        // Get the text and image section with related data
        var textAndImageSections = await textAndImageSectionRepository.FindWithWebsiteAsync(t => t.Id == request.TextAndImageSectionId);
        var textAndImageSection = textAndImageSections.FirstOrDefault();

        if (textAndImageSection == null)
        {
            throw new InvalidOperationException("Text and image section not found");
        }

        // Check user permissions for this website
        var hasAccess = false;
        if (textAndImageSection.WebsiteSection.WebsitePage.Website.RestaurantId.HasValue)
        {
            var userRestaurants = await userRestaurantRepository.FindAsync(ur => ur.UserId == userId && ur.RestaurantId == textAndImageSection.WebsiteSection.WebsitePage.Website.RestaurantId.Value);
            hasAccess = userRestaurants.Any();
        }
        else if (textAndImageSection.WebsiteSection.WebsitePage.Website.HospitalityId.HasValue)
        {
            var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId && uh.HospitalityId == textAndImageSection.WebsiteSection.WebsitePage.Website.HospitalityId.Value);
            hasAccess = userHospitalities.Any();
        }

        if (!hasAccess)
        {
            throw new InvalidOperationException("Access denied");
        }

        // Update the text and image section
        textAndImageSection.Title = request.Title;
        textAndImageSection.Content = request.Content;
        textAndImageSection.ButtonText = request.ButtonText;
        textAndImageSection.ButtonUrl = request.ButtonUrl;
        textAndImageSection.ImageUrl = request.ImageUrl;
        textAndImageSection.ImageAlt = request.ImageAlt;
        textAndImageSection.TextColor = request.TextColor;
        textAndImageSection.ButtonColor = request.ButtonColor;
        textAndImageSection.ButtonTextColor = request.ButtonTextColor;
        textAndImageSection.Alignment = request.Alignment;
        textAndImageSection.ImageOnLeft = request.ImageOnLeft;

        await textAndImageSectionRepository.UpdateAsync(textAndImageSection);

        return new UpdateTextAndImageSectionResult(textAndImageSection.Id);
    }
}
