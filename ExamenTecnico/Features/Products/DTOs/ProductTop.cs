namespace ExamernTecnico.Server.Features.Products.DTOs
{
    public record ProductTopDto(
        int ProductoId,
        string Nombre,
        int CantidadTotalVendida,
        decimal MontoTotalVendido
    );
}
