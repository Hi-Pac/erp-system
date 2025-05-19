import React from 'react';
import Layout from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Users } from 'lucide-react';

const CustomersPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          </div>
          <Button>Add Customer</Button>
        </div>

        <Card>
          <div className="p-6">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-gray-900 font-medium">No customers found</td>
                  <td colSpan={4}></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomersPage;