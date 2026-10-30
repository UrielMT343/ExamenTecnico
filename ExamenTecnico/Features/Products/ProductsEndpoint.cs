using ExamenTecnico.Features.Products.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ExamernTecnico.Server.Features.Products
{
    public static class ProductsEndpoint
    {
        public static void MapProductsEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapGet("/api/products/top", GetTopProducts);
            app.MapGet("/api/products/{productId:int}/orders", GetOrdersByProduct);
            app.MapPatch("/api/orders/{orderId:int}/details/{orderDetailId:int}/tracking", UpdateTrackingNumber);
        }

        private static async Task<IResult> GetTopProducts(
            IProductsService productsService,
            CancellationToken ct)
        {
            var topProducts = await productsService.GetTopProductsAsync(ct);
            if (topProducts == null || !topProducts.Any())
            {
                return Results.NotFound("No se encontraron productos.");
            }

            return Results.Ok(topProducts);
        }

        private static async Task<IResult> GetOrdersByProduct(
            int productId,
            IProductsService productsService,
            CancellationToken ct)
        {
            var orders = await productsService.GetOrdersByProductIdAsync(productId, ct);

            if (!orders.Any())
            {
                return Results.NotFound($"No se encontraron órdenes para el producto con ID {productId}.");
            }

            return Results.Ok(orders);
        }

        private static async Task<IResult> UpdateTrackingNumber(
            int orderId,
            int orderDetailId,
            [FromBody] UpdateTrackingDto request,
            IProductsService productsService,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.CarrierTrackingNumber))
            {
                return Results.BadRequest("El número de rastreo no puede estar vacío.");
            }

            var success = await productsService.UpdateCarrierTrackingAsync(orderId, orderDetailId, request.CarrierTrackingNumber, ct);

            if (!success)
            {
                return Results.NotFound($"No se encontró el detalle {orderDetailId} para la orden {orderId}.");
            }

            return Results.NoContent();
        }
    }
}
