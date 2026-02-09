using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace BackendApi.Configuration;

public class FormFileParameterFilter : IParameterFilter
{
    public void Apply(Microsoft.OpenApi.Models.OpenApiParameter parameter, ParameterFilterContext context)
    {
        // For IFormFile parameters from form data, set a simple schema to prevent Swagger errors
        // The FileUploadOperationFilter will later move this to the request body
        if (context.ApiParameterDescription.Source?.Id == "Form" && 
            context.ApiParameterDescription.Type == typeof(IFormFile))
        {
            parameter.Schema = new Microsoft.OpenApi.Models.OpenApiSchema
            {
                Type = "string",
                Format = "binary"
            };
        }
    }
}
