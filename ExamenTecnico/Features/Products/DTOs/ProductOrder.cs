namespace ExamernTecnico.Server.Features.Products.DTOs
{
    public record ProductOrderDto(
        int SalesOrderId,
        int SalesOrderDetailId,
        DateTime FechaOrden,
        short Cantidad,
        decimal PrecioUnitario
    );
}