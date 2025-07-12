"use client"; // Required for client-side components in Next.js App Router

import React from 'react';
import { Card, AreaChart, Title, Text, Metric } from '@tremor/react';

// Sample data (often fetched from an API in a real application)
const salesData = [
    { date: 'Jan 23', "Sales": 2890 },
    { date: 'Feb 23', "Sales": 2756 },
    { date: 'Mar 23', "Sales": 3322 },
    { date: 'Apr 23', "Sales": 3470 },
    { date: 'May 23', "Sales": 2900 },
    { date: 'Jun 23', "Sales": 3500 },
    { date: 'Jul 23', "Sales": 3200 },
    { date: 'Aug 23', "Sales": 3000 },
    { date: 'Sep 23', "Sales": 3150 },
    { date: 'Oct 23', "Sales": 3600 },
    { date: 'Nov 23', "Sales": 3800 },
    { date: 'Dec 23', "Sales": 4000 },
];

export default function MySalesDashboard() {
    return (
        <div className="p-8 bg-gray-900 min-h-screen text-gray-100"> {/* Added basic dark theme background */}
            <Title className="text-3xl font-bold mb-8 text-white">Sales Dashboard Overview</Title>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-800 text-white rounded-xl shadow-lg">
                    <Text className="text-gray-400">Total Sales</Text>
                    <Metric>$40,250</Metric>
                    <Text className="text-sm text-green-400 mt-2">+15.2% from last month</Text>
                </Card>

                <Card className="bg-gray-800 text-white rounded-xl shadow-lg">
                    <Text className="text-gray-400">Customers</Text>
                    <Metric>1,234</Metric>
                    <Text className="text-sm text-yellow-400 mt-2">5 new this week</Text>
                </Card>

                <Card className="bg-gray-800 text-white rounded-xl shadow-lg">
                    <Text className="text-gray-400">Conversion Rate</Text>
                    <Metric>4.8%</Metric>
                    <Text className="text-sm text-blue-400 mt-2">Target: 5.0%</Text>
                </Card>
            </div>

            <Card className="bg-gray-800 text-white rounded-xl shadow-lg p-6">
                <Title className="text-xl font-semibold text-white mb-4">Sales Performance Over Time</Title>
                <Text className="text-gray-400 mb-6">Monthly sales trend for the past year.</Text>
                <AreaChart
                    className="h-80"
                    data={salesData}
                    index="date"
                    categories={["Sales"]}
                    colors={["blue"]}
                    valueFormatter={(number) => `$${Intl.NumberFormat('us').format(number).toString()}`}
                    yAxisWidth={60}
                    curveType="natural" // Makes the line smooth
                    showAnimation={true}
                />
            </Card>
        </div>
    );
}