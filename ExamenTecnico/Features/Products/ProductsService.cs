using Dapper;
using ExamernTecnico.Server.Features.Products.DTOs;
using ExamernTecnico.Server.Infrastructure;

namespace ExamernTecnico.Server.Features.Products
{
    public interface IProductsService
    {
        Task<IEnumerable<ProductTopDto>> GetTopProductsAsync(CancellationToken ct);
        Task<IEnumerable<ProductOrderDto>> GetOrdersByProductIdAsync(int productId, CancellationToken ct);
        Task<bool> UpdateCarrierTrackingAsync(int orderId, int orderDetailId, string trackingNumber, CancellationToken ct);
    }
    public class ProductsService : IProductsService
    {
        private readonly IAdventureWorksDataAccess _dataAccess;

        public ProductsService(IAdventureWorksDataAccess dataAccess)
        {
            _dataAccess = dataAccess ?? throw new ArgumentNullException(nameof(dataAccess));
        }

        public async Task<IEnumerable<ProductTopDto>> GetTopProductsAsync(CancellationToken ct)
        {
            const string sql = @"
            SELECT TOP 5 
                p.ProductID AS ProductoId,
                p.Name AS Nombre,
                SUM(sod.OrderQty) AS CantidadTotalVendida,
                SUM(sod.LineTotal) AS MontoTotalVendido
            FROM Sales.SalesOrderDetail sod
            INNER JOIN Production.Product p ON sod.ProductID = p.ProductID
            GROUP BY p.ProductID, p.Name
            ORDER BY CantidadTotalVendida DESC";

            using var conn = _dataAccess.CreateConnection();
            var command = new CommandDefinition(sql, cancellationToken: ct);

            return await conn.QueryAsync<ProductTopDto>(command);
        }

        public async Task<IEnumerable<ProductOrderDto>> GetOrdersByProductIdAsync(int productId, CancellationToken ct)
        {
            const string sql = @"
            SELECT 
                soh.SalesOrderID AS SalesOrderId,
                sod.SalesOrderDetailID AS SalesOrderDetailId,
                soh.OrderDate AS FechaOrden,
                sod.OrderQty AS Cantidad,
                sod.UnitPrice AS PrecioUnitario
            FROM Sales.SalesOrderDetail sod
            INNER JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
            WHERE sod.ProductID = @ProductId
            ORDER BY soh.OrderDate DESC";

            using var conn = _dataAccess.CreateConnection();

            var command = new CommandDefinition(
                sql,
                new { ProductId = productId },
                cancellationToken: ct
            );

            return await conn.QueryAsync<ProductOrderDto>(command);
        }

        public async Task<bool> UpdateCarrierTrackingAsync(
            int orderId,
            int orderDetailId,
            string trackingNumber,
            CancellationToken ct)
        {
            const string sql = @"
            UPDATE Sales.SalesOrderDetail 
            SET CarrierTrackingNumber = @TrackingNumber 
            WHERE SalesOrderID = @OrderId AND SalesOrderDetailID = @OrderDetailId";

            using var conn = _dataAccess.CreateConnection();

            var command = new CommandDefinition(
                sql,
                new
                {
                    TrackingNumber = trackingNumber,
                    OrderId = orderId,
                    OrderDetailId = orderDetailId
                },
                cancellationToken: ct
            );

            var rowsAffected = await conn.ExecuteAsync(command);

            return rowsAffected > 0;
        }
    }
}
