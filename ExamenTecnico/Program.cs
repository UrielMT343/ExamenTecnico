using ExamernTecnico.Server.Features.Products;
using ExamernTecnico.Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Frontend",
        policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
});

builder.Services.AddSingleton<IAdventureWorksDataAccess, AdventureWorksDataAccess>();
builder.Services.AddScoped<IProductsService, ProductsService>();

var app = builder.Build();

app.UseCors("Frontend");

app.UseDefaultFiles();
app.MapStaticAssets();

app.MapProductsEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
