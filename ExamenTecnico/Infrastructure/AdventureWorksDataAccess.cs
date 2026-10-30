using System.Data;
using Microsoft.Data.SqlClient;

namespace ExamernTecnico.Server.Infrastructure
{
    public interface IAdventureWorksDataAccess
    {
        IDbConnection CreateConnection();
    }
    public class AdventureWorksDataAccess : IAdventureWorksDataAccess
    {
        private readonly string _connectionString;

        public AdventureWorksDataAccess(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("AdventureWorksConnection")
                ?? throw new ArgumentNullException(nameof(configuration), "La cadena de conexión es nula.");
        }
        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
