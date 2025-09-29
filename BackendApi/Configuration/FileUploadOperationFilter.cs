using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace BackendApi.Configuration;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasFormFileParameter = context.ApiDescription.ParameterDescriptions
            .Any(p => p.Source?.Id == "Form" &&
                     (p.Type == typeof(IFormFile) ||
                      (p.Type?.IsGenericType == true &&
                       p.Type.GetGenericTypeDefinition() == typeof(IEnumerable<>) &&
                       p.Type.GetGenericArguments().FirstOrDefault() == typeof(IFormFile))));

        if (!hasFormFileParameter) return;

        // Clear existing parameters for form data
        var parametersToRemove = operation.Parameters
            .Where(p => context.ApiDescription.ParameterDescriptions
                .Any(pd => pd.Name == p.Name && pd.Source?.Id == "Form"))
            .ToList();

        foreach (var param in parametersToRemove)
        {
            operation.Parameters.Remove(param);
        }

        // Create request body for multipart/form-data
        operation.RequestBody = new OpenApiRequestBody
        {
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["multipart/form-data"] = new OpenApiMediaType
                {
                    Schema = new OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, OpenApiSchema>(),
                        Required = new HashSet<string>()
                    }
                }
            }
        };

        var formSchema = operation.RequestBody.Content["multipart/form-data"].Schema;

        // Add all form parameters to the schema
        foreach (var parameter in context.ApiDescription.ParameterDescriptions
            .Where(p => p.Source?.Id == "Form"))
        {
            OpenApiSchema propertySchema;

            if (parameter.Type == typeof(IFormFile))
            {
                propertySchema = new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
            }
            else if (parameter.Type?.IsGenericType == true &&
                     parameter.Type.GetGenericTypeDefinition() == typeof(IEnumerable<>) &&
                     parameter.Type.GetGenericArguments().FirstOrDefault() == typeof(IFormFile))
            {
                propertySchema = new OpenApiSchema
                {
                    Type = "array",
                    Items = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    }
                };
            }
            else
            {
                // Handle other form parameters
                try
                {
                    propertySchema = context.SchemaGenerator.GenerateSchema(parameter.Type, context.SchemaRepository);
                }
                catch
                {
                    // Fallback for unknown types
                    propertySchema = new OpenApiSchema { Type = "string" };
                }
            }

            formSchema.Properties[parameter.Name] = propertySchema;

            if (parameter.IsRequired)
            {
                formSchema.Required.Add(parameter.Name);
            }
        }
    }
}