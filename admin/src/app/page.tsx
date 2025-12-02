"use client";

import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const stats = [
  { title: '전체 사용자', value: '15,420', trend: '+12.5% 전월 대비', icon: Users, color: 'text-blue-600', trendColor: 'text-green-500' },
  { title: '총 거래 건수', value: '89,234', trend: '+8.2% 전월 대비', icon: ShoppingCart, color: 'text-blue-600', trendColor: 'text-green-500' },
  { title: '총 거래액', value: '₩12.5억', trend: '+15.3% 전월 대비', icon: DollarSign, color: 'text-blue-600', trendColor: 'text-green-500' },
  { title: '평균 거래액', value: '₩1.4만', trend: '▼ 3.1% 전월 대비', icon: TrendingUp, color: 'text-blue-600', trendColor: 'text-red-500' },
];

const lineData = [
  { name: '1', value: 4000 }, { name: '2', value: 3000 }, { name: '3', value: 2000 }, { name: '4', value: 2780 },
  { name: '5', value: 1890 }, { name: '6', value: 2390 }, { name: '7', value: 3490 }, { name: '8', value: 4000 },
  { name: '9', value: 3000 }, { name: '10', value: 2000 }, { name: '11', value: 2780 }, { name: '12', value: 1890 },
  { name: '13', value: 2390 }, { name: '14', value: 3490 }, { name: '15', value: 4200 }, { name: '16', value: 3800 },
  { name: '17', value: 3500 }, { name: '18', value: 3000 }, { name: '19', value: 2500 }, { name: '20', value: 2800 },
  { name: '21', value: 3200 }, { name: '22', value: 3600 }, { name: '23', value: 4000 }, { name: '24', value: 4500 },
  { name: '25', value: 4800 }, { name: '26', value: 4600 }, { name: '27', value: 4200 }, { name: '28', value: 3800 },
  { name: '29', value: 3500 }, { name: '30', value: 3200 },
];

const barData = [
  { name: '마트/편의점', value: 4000 },
  { name: '배달음식', value: 3000 },
  { name: '카페/디저트', value: 2000 },
  { name: '교육', value: 1800 },
  { name: '패션/뷰티', value: 1500 },
  { name: '주유', value: 1200 },
  { name: '기타', value: 800 },
];

const tableData = [
  { category: '마트/편의점', amount: '₩4.2억', count: '28,934', ratio: '34.0%' },
  { category: '배달음식', amount: '₩3억', count: '15,678', ratio: '23.9%' },
  { category: '카페/디저트', amount: '₩1.6억', count: '12,456', ratio: '12.6%' },
  { category: '교육', amount: '₩1.3억', count: '8,234', ratio: '10.3%' },
  { category: '패션/뷰티', amount: '₩9823.5만', count: '6,789', ratio: '7.9%' },
  { category: '주유', amount: '₩8923.5만', count: '5,234', ratio: '7.1%' },
  { category: '기타', amount: '₩4505만', count: '11,909', ratio: '3.6%' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>
        <p className="text-gray-500 mt-1">전체 서비스 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className={`text-sm font-medium ${stat.trendColor}`}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">일별 거래 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">카테고리별 소비</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">카테고리 상세</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">거래액</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">거래 건수</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">비율</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    {row.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{row.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{row.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {row.ratio}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
