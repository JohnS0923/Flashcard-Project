using FlashcardAPI.Data;
using FlashcardAPI.IRepository;  // ADD THIS
using FlashcardAPI.Repository;   // ADD THIS
using Microsoft.EntityFrameworkCore;

namespace FlashcardAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Get Connection String
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // 2. Add services
            builder.Services.AddControllers();

            // Register Repository and Context
            builder.Services.AddScoped<IFlashcard, FlashcardDAL>();
            builder.Services.AddDbContext<FlashcardContext>(options =>
                options.UseSqlServer(connectionString));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // 3. Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policyBuilder =>
                {
                    policyBuilder
                        .AllowAnyOrigin() // For testing, allow everything
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // 4. Automated Database Setup
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<FlashcardContext>();
                    context.Database.EnsureCreated();
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "Database initialization failed.");
                }
            }

            // 5. Configure the HTTP request pipeline
            app.UseSwagger();
            app.UseSwaggerUI();

            if (app.Environment.IsDevelopment())
            {
                // Development-specific settings
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseCors("AllowSpecificOrigin");
            app.UseAuthorization();
            app.MapControllers();

            app.MapGet("/", () => Results.Redirect("/swagger"));

            app.Run();
        }
    }
}