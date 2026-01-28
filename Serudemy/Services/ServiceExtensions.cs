
using System.Configuration;

namespace Serudemy.Services
{
    public class ServiceExtensions : IConfigurationBuilder
    {
        public IDictionary<string, object> Properties => throw new NotImplementedException();

        public IList<IConfigurationSource> Sources => throw new NotImplementedException();

        public IConfigurationBuilder Add(IConfigurationSource source)
        {
            throw new NotImplementedException();
        }

        public IConfigurationRoot Build()
        {
            throw new NotImplementedException();
        }
        
    }
}
