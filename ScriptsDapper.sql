-- Obtener los 5 productos con mayor cantidad vendida.
SELECT TOP 5 
    p.ProductID AS ProductoId,
    p.Name AS Nombre,
    SUM(sod.OrderQty) AS CantidadTotalVendida,
    SUM(sod.LineTotal) AS MontoTotalVendido
FROM Sales.SalesOrderDetail sod
INNER JOIN Production.Product p ON sod.ProductID = p.ProductID
GROUP BY p.ProductID, p.Name
ORDER BY CantidadTotalVendida DESC

-- Obtener por producto: nombre, cantidad total vendida y monto total vendido.
SELECT 
    soh.SalesOrderID AS SalesOrderId,
    soh.OrderDate,
    sod.OrderQty AS Cantidad,
    sod.UnitPrice AS PrecioUnitario
FROM Sales.SalesOrderDetail sod
INNER JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
WHERE sod.ProductID = @ProductId
ORDER BY soh.OrderDate DESC

-- Actualizar CarrierTrackingNumber de detalle
UPDATE Sales.SalesOrderDetail 
SET CarrierTrackingNumber = @TrackingNumber 
WHERE SalesOrderID = @OrderId AND SalesOrderDetailID = @OrderDetailId