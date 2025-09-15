namespace BackendApi.Entities;

public class HospitalityRoom : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int Capacity { get; set; }

    public Guid HospitalityId { get; set; }
    public Hospitality Hospitality { get; set; } = null!;
}