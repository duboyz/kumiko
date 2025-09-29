using BackendApi.Features.MenuImport.ParseMenuImage;

namespace BackendApi.Services;

public interface IOpenAiService
{
    Task<ParseMenuImageResult> ParseMenuImageAsync(
        byte[] imageData,
        string mimeType,
        List<MenuAnnotation> annotations,
        CancellationToken cancellationToken = default);
}
