namespace BackendApi.Entities;

public class UserHospitality : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid HospitalityId { get; set; }
    public UserRole Role { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Hospitality Hospitality { get; set; } = null!;
}