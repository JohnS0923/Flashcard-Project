using FlashcardAPI.Data;
using FlashcardAPI.IRepository;
using FlashcardAPI.Repository;
using Microsoft.EntityFrameworkCore;

namespace FlashcardAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Get the connection string template
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            // 2. Grab the secret password injected by ECS
            var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

            // 3. Inject the secret into the connection string
            if (!string.IsNullOrEmpty(dbPassword) && connectionString != null)
            {
                connectionString = connectionString.Replace("{DB_PASSWORD}", dbPassword);
            }

            // 4. Add services
            builder.Services.AddControllers();

            // Register Repository and Context (ONLY ONCE)
            builder.Services.AddScoped<IFlashcard, FlashcardDAL>();
            builder.Services.AddDbContext<FlashcardContext>(options =>
                options.UseSqlServer(connectionString));

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // 5. Configure CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin", policyBuilder =>
                {
                    policyBuilder
                        .AllowAnyOrigin() 
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            // 6. Automated Database Setup
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

            // 7. Configure the HTTP request pipeline
            app.UseSwagger();
            app.UseSwaggerUI();

            if (!app.Environment.IsDevelopment())
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