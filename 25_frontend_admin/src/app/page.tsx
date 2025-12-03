"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DashboardStatCard } from '@/components/ui/DashboardStatCard';
import { CategoryTable } from '@/components/ui/CategoryTable';
import { getDashboardData } from '@/services/dashboard';
import { DashboardStats } from '@/types';

// [왕초보 백엔드 연동 가이드]
// 1. services/dashboard.ts 파일을 열어서 getDashboardData() 함수를 수정하세요
// 2. 현재는 mock 데이터를 반환하지만, 실제 API 호출로 변경하면 됩니다
// 3. 예시:
//    const response = await fetch('/api/v1/dashboard/stats');
//    const data = await response.json();
//    return data;

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('대시보드 데이터를 가져오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !dashboardData) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>;
  }

  const { stats, lineData, barData, tableData } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">대시보드</h2>
        <p className="text-gray-500 mt-1">전체 서비스 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardStatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
            trendColor={stat.trendColor}
          />
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
      <CategoryTable data={tableData} />
    </div>
  );
}
