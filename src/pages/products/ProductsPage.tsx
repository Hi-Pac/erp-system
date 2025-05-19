import React from 'react';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Package } from 'lucide-react';

const ProductsPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>
          <Button>Add Product</Button>
        </div>

        <Card>
          <div className="p-6">
            <Table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Loading products...</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductsPage;