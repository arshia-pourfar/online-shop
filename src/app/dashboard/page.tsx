"use client";
// import { useEffect, useState } from 'react';
// import { User } from '../../types/user';
// import { Order } from '../../types/order';
// import { Product } from '../../types/product';
// import { getUsers } from '@/lib/api/users';
// import { getOrders } from '@/lib/api/orders';
// import { getProducts } from '@/lib/api/products';

// const [users, setUsers] = useState<User[]>([]);
// const [orders, setOrders] = useState<Order[]>([]);
// const [products, setProducts] = useState<Product[]>([]);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   Promise.all([
//     getUsers().then(setUsers),
//     getOrders().then(setOrders),
//     getProducts().then(setProducts),
//   ]).finally(() => setLoading(false));
// }, []);

// if (loading) return <p>Loading...</p>;

import React from 'react';
import { LineChart, BarChart, AreaChart, Card, Title, Text } from '@tremor/react'; // Ensure @tremor/react is installed: npm install @tremor/react
// import { ChevronDown, User, ShoppingBag, PieChart, BarChart2, Settings, Mail, Bell } from 'lucide-react'; // Ensure lucide-react is installed: npm install lucide-react

// Mock Data for Charts (simplified for demonstration)
const salesData = [
  { date: 'Jan', Sales: 500, Clicks: 500, Photo: 400 },
  { date: 'Feb', Sales: 550, Clicks: 550, Photo: 450 },
  { date: 'Mar', Sales: 520, Clicks: 600, Photo: 500 },
  { date: 'Apr', Sales: 600, Clicks: 650, Photo: 550 },
  { date: 'May', Sales: 580, Clicks: 700, Photo: 600 },
  { date: 'Jun', Sales: 650, Clicks: 750, Photo: 650 },
];

// const analyticsData = [
//   { date: '160', Sales: 300, Clicks: 450, Photo: 350 },
//   { date: '180', Sales: 350, Clicks: 500, Photo: 400 },
//   { date: '200', Sales: 400, Clicks: 550, Photo: 450 },
//   { date: '220', Sales: 450, Clicks: 600, Photo: 500 },
//   { date: '240', Sales: 500, Clicks: 650, Photo: 550 },
//   { date: '260', Sales: 550, Clicks: 700, Photo: 600 },
//   { date: '280', Sales: 600, Clicks: 750, Photo: 650 },
//   { date: '300', Sales: 650, Clicks: 800, Photo: 700 },
// ];

const ordersData = [
  { date: '180', value: 200 },
  { date: '190', value: 250 },
  { date: '200', value: 220 },
  { date: '210', value: 280 },
  { date: '220', value: 260 },
  { date: '230', value: 300 },
  { date: '240', value: 290 },
  { date: '250', value: 320 },
];

const customicsData = [
  { date: '160', value: 100 },
  { date: '180', value: 120 },
  { date: '190', value: 110 },
  { date: '200', value: 130 },
  { date: '210', value: 125 },
  { date: '220', value: 140 },
  { date: '230', value: 135 },
  { date: '240', value: 150 },
];


export default function DashboardPage() {
  return (
    <div className="flex h-full w-full bg-primary-bg text-primary-text font-inter">
      {/* Sidebar Component */}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header Component */}


        {/* Dashboard Content */}
        <main className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Sales Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Sales</h3>
                <span className="text-sm text-accent cursor-pointer">Detail</span>
              </div>
              <div className="text-4xl font-bold text-primary-text mb-2">$578%</div>
              <div className="flex-grow">
                <LineChart
                  data={salesData}
                  index="date"
                  categories={['Sales']}
                  colors={['accent']}
                  showXAxis={true}
                  showYAxis={true}
                  showLegend={false}
                  className="h-24"
                />
              </div>
            </div>

            {/* Orofit Profit Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Orofit Profit</h3>
                <span className="text-sm text-accent cursor-pointer">Detail</span>
              </div>
              <div className="text-4xl font-bold text-primary-text mb-2">$224%</div>
              <div className="flex flex-row gap-4">
                <div className="text-lg text-status-positive font-semibold">$28%</div>
                <div className="text-lg text-status-positive font-semibold">68%</div>
              </div>
            </div>

            {/* Customer Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Customer</h3>
                <span className="text-sm text-accent cursor-pointer">Posts</span>
              </div>
              <div className="text-4xl font-bold text-primary-text mb-2">$254%</div>
              <div className="flex items-center space-x-4">
                <div className="w-1/2 bg-primary-bg rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full w-3/4"></div> {/* 75% fill */}
                </div>
                <span className="text-secondary-text text-sm">$125%</span>
                <span className="text-secondary-text text-sm">75%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Analytics Card */}

            <Card className="text-white bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col text-left">
              <div className='flex-grow'>
                <Title className="text-lg font-semibold text-primary-text">Analytics</Title>
                <Text className="text-gray-400 mb-6">Monthly sales trend for the past year.</Text>
                <AreaChart
                  className="h-80 justify-start text-left"
                  data={salesData}
                  index="date"
                  categories={["Sales", "Clicks", "Photo"]}
                  colors={["status-neutral", "accent", "status-positive"]}
                  valueFormatter={(number) => `$${Intl.NumberFormat('us').format(number).toString()}`}
                  yAxisWidth={55}
                  curveType="natural" // Makes the line smooth or natural
                  showAnimation={true}
                />
              </div>
            </Card>


            {/* Orders Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Orders</h3>
                <span className="text-sm text-accent cursor-pointer">Detail</span>
              </div>
              <div className="text-4xl font-bold text-primary-text mb-2">$275%</div>
              <div className="flex-grow">
                <BarChart
                  data={ordersData}
                  index="date"
                  categories={['value',]}
                  colors={['status-neutral', 'accent', 'status-positive']}
                  showXAxis={true}
                  showYAxis={false}
                  showLegend={false}
                  className="h-48"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Customics Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Customics</h3>
                <span className="text-sm text-accent cursor-pointer">Smear</span>
              </div>
              <div className="flex-grow">
                <BarChart
                  data={customicsData}
                  index="date"
                  categories={['value']}
                  colors={['accent']}
                  showXAxis={true}
                  showYAxis={true}
                  showLegend={false}
                  className="h-32"
                />
              </div>
            </div>

            {/* Masteicontod & Mawelo Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col justify-center">
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 rounded-full bg-accent mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Masteicontod</span>
                <span className="ml-auto text-primary-text text-lg font-bold">$35%</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 rounded-full bg-accent mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Mawelo</span>
                <span className="ml-auto text-primary-text text-lg font-bold">435%</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 rounded-full bg-accent mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Masteicontod</span>
                <span className="ml-auto text-primary-text text-lg font-bold">$22%</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-accent mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Mawelo</span>
                <span className="ml-auto text-primary-text text-lg font-bold">$450%</span>
              </div>
            </div>

            {/* Doskage Card */}
            <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-text">Doskage</h3>
                <span className="text-sm text-accent cursor-pointer">Dotaaa</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 rounded-full bg-status-positive mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Powelore</span>
                <span className="ml-auto text-primary-text text-lg font-bold">$88%</span>
              </div>
              <div className="flex items-center mb-3">
                <span className="w-3 h-3 rounded-full bg-status-positive mr-3"></span>
                <span className="text-primary-text text-lg font-semibold">Glonstant</span>
                <span className="ml-auto text-primary-text text-lg font-bold">1.98</span>
              </div>
            </div>
          </div>
        </main>
      </div >
    </div >
  );
}
