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

import React, { useEffect, useState } from 'react';
import { LineChart, BarChart, AreaChart, Card, Title, Text, Button } from '@tremor/react'; // Ensure @tremor/react is installed: npm install @tremor/react
// import { ChevronDown, User, ShoppingBag, PieChart, BarChart2, Settings, Mail, Bell } from 'lucide-react'; // Ensure lucide-react is installed: npm install lucide-react
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import Header from '@/components/Header';
import { SaleStats } from 'types/salestats';
import { getSaleStats } from '@/lib/api/salestats';
// Mock Data for Charts (simplified for demonstration)
const salesData = [
  { date: 'Jan', Sales: 500, Clicks: 500, Photo: 400 },
  { date: 'Feb', Sales: 550, Clicks: 550, Photo: 450 },
  { date: 'Mar', Sales: 520, Clicks: 600, Photo: 500 },
  { date: 'Apr', Sales: 600, Clicks: 650, Photo: 550 },
  { date: 'May', Sales: 580, Clicks: 700, Photo: 600 },
  { date: 'Jun', Sales: 650, Clicks: 750, Photo: 650 },
];

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


export default function DashboardPage() {
  const [saleStats, setSaleStats] = useState<SaleStats[]>([]);

  useEffect(() => {
    Promise.all([
      getSaleStats().then(setSaleStats),
    ]).finally();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-primary-bg text-primary-text font-inter">
      <Header />

      <div className="flex-1 flex flex-col">

        <main className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

          <div className="flex my-6 space-x-6">
            {/* Analytics Card */}

            <Card className="text-white bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col text-left basis-2/3">
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
            <Card className="flex flex-col justify-between basis-1/3 p-0">
              <div className='bg-secondary-bg p-6 py-8 rounded-xl shadow-lg flex flex-col'>
                <div className="flex justify-between items-center mb-4">
                  <Title className="text-lg font-semibold text-primary-text">Orders</Title>
                  <Text className="text-sm text-accent cursor-pointer">Detail</Text>
                </div>
                <Title className="text-4xl font-bold text-primary-text mb-2">$275%</Title>
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
              <div className='bg-secondary-bg p-6 rounded-xl shadow-lg flex justify-between'>
                <Title className="text-lg font-semibold text-primary-text">Orders</Title>
                <Button />
              </div>
            </Card>
          </div>

          <div className="flex my-6 space-x-6">
            {/* Customics Card */}
            <Card className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col basis-4/6">
              <Title className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
                Monthly Sales
              </Title>
              <Text className="text-sm text-accent cursor-pointer ml-2">Smear</Text>

              {/* Chart Area */}
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart
                  data={saleStats}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e0e0e0"
                    className="dark:stroke-gray-600"
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: '#9ca3af' }}
                    className="text-sm font-medium text-white dark:text-white"
                    interval={10} // نمایش تمام برچسب‌ها
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={{ stroke: '#9ca3af' }}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400"
                  />

                  <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: '12px',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#333' }}
                    itemStyle={{ color: '#555' }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ paddingTop: '10px', paddingBottom: '10px' }}
                    iconType="circle"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  />

                  <Bar
                    dataKey="sales"
                    barSize={40}
                    fill="#3b82f6" // رنگ آبی (معادل blue-500 در Tailwind)
                    name="Sales Count"
                    radius={[5, 5, 0, 0]} // گوشه‌های گرد در بالا
                  />

                  <Line
                    type="natural"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Revenue"
                    dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            <div className='flex flex-col basis-2/6 justify-center space-y-6'>
              {/* Masteicontod & Mawelo Card */}
              <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col basis-2/6 justify-center">
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
              <div className="bg-secondary-bg p-6 rounded-xl shadow-lg flex flex-col basis-1/6">
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
            </div >
          </div>
        </main >
      </div >
    </div >
  );
}
