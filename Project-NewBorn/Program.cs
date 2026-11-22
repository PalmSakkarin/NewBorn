using NewBorn.Application.Helpers;
using NewBorn.Application.Interfaces.Repositories;
using NewBorn.Application.Interfaces.Services;
using NewBorn.Application.Services;
using NewBorn.Infrastructure.Data;
using NewBorn.Infrastructure.Migrations;
using NewBorn.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
string defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is not configured.");
string masterConnection = builder.Configuration.GetConnectionString("MasterConnection")
    ?? throw new InvalidOperationException("ConnectionStrings:MasterConnection is not configured.");

builder.Services.AddSingleton(new SqlConnectionFactory(defaultConnection));
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ILoginRepository, LoginRepository>();
builder.Services.AddScoped<ILoginService, LoginService>();

var app = builder.Build();

await DatabaseMigrator.ApplyAsync(masterConnection);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Login/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
