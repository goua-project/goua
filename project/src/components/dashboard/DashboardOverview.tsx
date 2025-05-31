import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import Button from '../common/Button';
import { 
  ShoppingBag, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Package, 
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const DashboardOverview = () => {
  const { currentStore } = useStore();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  
  if (!currentStore) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune boutique</h3>
        <p className="text-gray-500 mb-6">Vous n'avez pas encore créé de boutique.</p>
        <Link to="/create-store">
          <Button variant="primary">Créer ma boutique</Button>
        </Link>
      </div>
    );
  }
  
  const stats = [
    {
      name: 'Ventes',
      value: '158 500 FCFA',
      change: '+12.5%',
      positive: true,
      icon: <DollarSign size={24} className="text-green-500" />,
    },
    {
      name: 'Commandes',
      value: '24',
      change: '+18.2%',
      positive: true,
      icon: <ShoppingBag size={24} className="text-blue-500" />,
    },
    {
      name: 'Visites',
      value: '1 245',
      change: '+32.8%',
      positive: true,
      icon: <Users size={24} className="text-purple-500" />,
    },
    {
      name: 'Taux de conversion',
      value: '1.92%',
      change: '-0.4%',
      positive: false,
      icon: <TrendingUp size={24} className="text-orange-500" />,
    },
  ];
  
  const recentProducts = currentStore.products.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-black text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Bienvenue dans votre boutique</h2>
              <p className="mt-1 text-gray-300">Suivez les performances de {currentStore.name}</p>
            </div>
            <Link to={`/store/${currentStore.slug}`} target="_blank">
              <Button variant="outline" className="text-white border-white hover:bg-white/10" icon={<ExternalLink size={16} />} iconPosition="right">
                Voir ma boutique
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-2 bg-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Aperçu des performances</h3>
          <div className="flex bg-white border border-gray-200 rounded-md">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 text-xs font-medium ${
                  timeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === 'today' ? "Aujourd'hui" : 
                 range === 'week' ? '7 jours' : 
                 range === 'month' ? '30 jours' : '12 mois'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                {stat.icon}
              </div>
              <div className="mt-2">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  {stat.change}
                  <span className="text-xs ml-1">vs période précédente</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Produits récents</h3>
          <Link 
            to="/dashboard/products" 
            className="text-sm text-orange-500 hover:text-orange-600 flex items-center"
          >
            Voir tous
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentProducts.length > 0 ? (
            recentProducts.map((product) => (
              <div key={product.id} className="px-6 py-4 flex items-center">
                <div 
                  className="h-10 w-10 rounded bg-gray-200 flex-shrink-0"
                  style={{
                    backgroundImage: `url(${product.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.isDigital ? 'Produit digital' : `Stock: ${product.inStock}`}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {product.price.toLocaleString()} FCFA
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <Package size={40} className="mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun produit</h3>
              <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de produits.</p>
              <Link to="/add-product">
                <Button variant="primary" icon={<ArrowRight size={16} />} iconPosition="right">
                  Ajouter un produit
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Actions rapides</h3>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/add-product" className="group">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center text-center">
              <Package size={32} className="text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Ajouter un produit</h4>
              <p className="text-sm text-gray-500">Enrichir votre catalogue</p>
            </div>
          </Link>
          
          <Link to="/dashboard/settings" className="group">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center text-center">
              <Users size={32} className="text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Personnaliser</h4>
              <p className="text-sm text-gray-500">Modifier l'apparence</p>
            </div>
          </Link>
          
          <Link to="/dashboard/payments" className="group">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors flex flex-col items-center text-center">
              <DollarSign size={32} className="text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">Configurer paiements</h4>
              <p className="text-sm text-gray-500">Accepter des paiements</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;