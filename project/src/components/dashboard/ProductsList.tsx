import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore, Product } from '../../contexts/StoreContext';
import Button from '../common/Button';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ProductsList = () => {
  const { currentStore, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState<boolean | null>(null);
  const [sortField, setSortField] = useState<keyof Product>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    if (currentStore) {
      let filtered = [...currentStore.products];
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply visibility filter
      if (filterVisible !== null) {
        filtered = filtered.filter((product) => product.isVisible === filterVisible);
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        // Handle numeric values
        if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
          return sortDirection === 'asc'
            ? (a[sortField] as number) - (b[sortField] as number)
            : (b[sortField] as number) - (a[sortField] as number);
        }
        
        // Handle string values
        const aValue = String(a[sortField] || '');
        const bValue = String(b[sortField] || '');
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
      
      setProducts(filtered);
    }
  }, [currentStore, searchTerm, filterVisible, sortField, sortDirection]);
  
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    if (!currentStore) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(currentStore.id, productId);
      setSelectedProduct(null);
    }
  };
  
  const toggleDropdown = (productId: string) => {
    setSelectedProduct(selectedProduct === productId ? null : productId);
  };
  
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
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-lg font-medium text-gray-900">Produits ({products.length})</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="relative">
              <button
                onClick={() => setFilterVisible(filterVisible === null ? true : filterVisible ? false : null)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 text-gray-500" />
                <span>{filterVisible === null ? 'Tous' : filterVisible ? 'Publiés' : 'Non publiés'}</span>
              </button>
            </div>
            
            <Link to="/add-product">
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={16} />}
                iconPosition="left"
              >
                Ajouter
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Produit
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Prix
                    {sortField === 'price' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('isVisible')}
                >
                  <div className="flex items-center">
                    Statut
                    {sortField === 'isVisible' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    Ajouté le
                    {sortField === 'createdAt' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category || 'Non catégorisé'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.price.toLocaleString()} FCFA</div>
                    <div className="text-xs text-gray-500">
                      {product.isDigital ? 'Produit digital' : `Stock: ${product.inStock}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isVisible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.isVisible ? 'Publié' : 'Non publié'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(product.id)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {selectedProduct === product.id && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <Link
                              to={`/edit-product/${product.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setSelectedProduct(null)}
                            >
                              <Edit size={16} className="mr-2 text-gray-400" />
                              Modifier
                            </Link>
                            <a
                              href={`/store/${currentStore.slug}?product=${product.id}`}
                              target="_blank"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setSelectedProduct(null)}
                            >
                              <Eye size={16} className="mr-2 text-gray-400" />
                              Voir
                            </a>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 size={16} className="mr-2 text-red-400" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center">
          <Package size={40} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun produit trouvé</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterVisible !== null
              ? 'Essayez de modifier vos filtres de recherche.'
              : 'Vous n\'avez pas encore ajouté de produits.'}
          </p>
          <Link to="/add-product">
            <Button variant="primary" icon={<Plus size={16} />} iconPosition="left">
              Ajouter un produit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsList;