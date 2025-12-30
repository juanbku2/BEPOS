import { useState, useEffect } from 'react';
import { Form, Table, Button, InputGroup } from 'react-bootstrap';
import axios from '../api/axios';
import { Product } from '../types/Product';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface ProductSearchProps {
  onAddProduct: (product: Product) => void;
}

const ProductSearch = ({ onAddProduct }: ProductSearchProps) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch all products on component mount
    axios.get('/api/v1/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching all products:', error);
      });
  }, []); // Empty dependency array means this runs once on mount

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = searchTerm ? `/api/v1/products?name=${searchTerm}` : '/api/v1/products';
    axios.get(endpoint)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error(`Error fetching products:`, error);
      });
  };

  return (
    <div>
      <Form onSubmit={handleSearchSubmit}>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder={t('productSearch.searchPlaceholder')} // Translate placeholder
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" type="submit">
            {t('productSearch.searchButton')} {/* Translate Search button */}
          </Button>
        </InputGroup>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t('productSearch.nameHeader')}</th> {/* Translate Name */}
            <th>{t('productSearch.priceHeader')}</th> {/* Translate Price */}
            <th>{t('productSearch.stockHeader')}</th> {/* Translate Stock */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.salePrice}</td>
              <td>{product.stockQuantity}</td>
              <td>
                <Button variant="success" onClick={() => onAddProduct(product)}>
                  {t('productSearch.addButton')} {/* Translate Add button */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductSearch;
