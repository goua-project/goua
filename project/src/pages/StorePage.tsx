import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, Store, Product } from '../contexts/StoreContext';
import Button from '../components/common/Button';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Share2 
} from 'lucide-react';
import Container from '../components/common/Container';

const StorePage = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { stores, getStoreBySlug } = useStore();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<Store | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    if (storeId) {
      // Try to find store by id first
      let foundStore = stores.find(s => s.id === storeId);
      
      // If not found by id, try by slug
      if (!foundStore) {
        foundStore = getStoreBySlug(storeId);
      }
      
      if (foundStore) {
        setStore(foundStore);
        
        // Check if there's a product query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
          const product = foundStore.products.find(p => p.id === productId);
          if (product) {
            setSelectedProduct(product);
            setIsProductDetailOpen(true);
          }
        }
      }
    }
  }, [storeId, stores, getStoreBySlug]);
  
  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsProductDetailOpen(true);
    
    // Update URL without navigating
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    window.history.pushState({}, '', url);
  };
  
  const closeProductDetail = () => {
    setIsProductDetailOpen(false);
    
    // Remove product from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url);
  };
  
  const nextImage = () => {
    if (selectedProduct && currentImageIndex < selectedProduct.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Boutique introuvable</h2>
          <p className="text-gray-500 mb-6">Cette boutique n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div 
        className="bg-gray-900 text-white py-10"
        style={{ backgroundColor: store.accentColor }}
      >
        <Container>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white overflow-hidden flex items-center justify-center shadow-md">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag size={32} className="text-gray-300" />
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <p className="text-white/80 mb-4">"{store.slogan}"</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {store.type === 'physical' ? 'Produits Physiques' : 'Produits Digitaux'}
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {store.products.length} produits
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {store.visitCount} visites
                </div>
              </div>
            </div>
            
            <div className="ml-auto hidden md:block">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                icon={<Share2 size={16} />}
                iconPosition="left"
              >
                Partager
              </Button>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Store Description */}
      <div className="bg-white border-b">
        <Container className="py-6">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-3">À propos de cette boutique</h2>
            <p className="text-gray-600">{store.description}</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Phone size={20} className="text-gray-400 mr-2" />
                <span className="text-sm">+225 07 XX XX XX XX</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-gray-400 mr-2" />
                <span className="text-sm">contact@boutikplace.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="text-gray-400 mr-2" />
                <span className="text-sm">Abidjan, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
      
      {/* Products Section */}
      <Container className="py-8">
        <h2 className="text-2xl font-bold mb-6">Nos produits</h2>
        
        {store.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {store.products.filter(p => p.isVisible).map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                <div 
                  className="h-48 bg-gray-200 relative"
                  style={{
                    backgroundImage: `url(${product.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!product.isDigital && product.inStock <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Rupture de stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 h-10 overflow-hidden">{product.description.substring(0, 60)}...</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-gray-900">{product.price.toLocaleString()} FCFA</span>
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: store.accentColor }}
                    >
                      <ShoppingCart size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun produit disponible</h3>
            <p className="text-gray-500">Cette boutique n'a pas encore ajouté de produits.</p>
          </div>
        )}
      </Container>
      
      {/* Product Detail Modal */}
      {isProductDetailOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row h-full">
              {/* Product Images */}
              <div className="w-full md:w-1/2 bg-gray-100 relative">
                <div 
                  className="h-64 md:h-full bg-white flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${selectedProduct.images[currentImageIndex]})`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {selectedProduct.images.length > 1 && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }} 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:bg-gray-200"
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }} 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-gray-700 hover:bg-gray-200"
                        disabled={currentImageIndex === selectedProduct.images.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {selectedProduct.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(index);
                            }}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col max-h-[60vh] md:max-h-[90vh]">
                <button 
                  onClick={closeProductDetail}
                  className="self-end text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h2>
                <div className="text-xl font-bold mt-2" style={{ color: store.accentColor }}>
                  {selectedProduct.price.toLocaleString()} FCFA
                </div>
                
                {selectedProduct.category && (
                  <div className="mt-2">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {selectedProduct.category}
                    </span>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Description</h3>
                  <p className="mt-1 text-sm text-gray-600">{selectedProduct.description}</p>
                </div>
                
                {/* Product-specific details */}
                <div className="mt-4 space-y-3">
                  {!selectedProduct.isDigital && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Disponibilité</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {selectedProduct.inStock > 0 
                            ? `${selectedProduct.inStock} en stock` 
                            : 'Rupture de stock'}
                        </p>
                      </div>
                      
                      {selectedProduct.shippingFrom && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Expédié depuis</h3>
                          <p className="mt-1 text-sm text-gray-600">{selectedProduct.shippingFrom}</p>
                        </div>
                      )}
                      
                      {selectedProduct.deliveryTime && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Délai de livraison estimé</h3>
                          <p className="mt-1 text-sm text-gray-600">{selectedProduct.deliveryTime}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedProduct.isDigital && (
                    <>
                      {selectedProduct.serviceType && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Type de service</h3>
                          <p className="mt-1 text-sm text-gray-600">{selectedProduct.serviceType}</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {selectedProduct.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedProduct.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex-grow"></div>
                
                <div className="mt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    style={{ backgroundColor: store.accentColor }}
                    icon={<ShoppingCart size={16} />}
                    iconPosition="left"
                    disabled={!selectedProduct.isDigital && selectedProduct.inStock <= 0}
                  >
                    {selectedProduct.isDigital ? 'Acheter maintenant' : 'Ajouter au panier'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorePage;