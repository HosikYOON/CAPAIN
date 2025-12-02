"use client";

import { BarChart3, Users, CreditCard, Tag } from 'lucide-react';

export default function DashboardPage() {
  // Mock 데이터 (나중에 API로 교체)
  const stats = [
    { title: '총 사용자', value: '15,420', trend: '+2.5%', icon: Users, color: 'bg-blue-500' },
    { title: '거래 건수', value: '89,234', trend: '+5.1%', icon: CreditCard, color: 'bg-green-500' },
    { title: '총 사용액', value: '₩1.2억', trend: '+3.2%', icon: BarChart3, color: 'bg-purple-500' },
    { title: '쿠폰 수', value: '₩1.4만', trend: '-1.5%', icon: Tag, color: 'bg-yellow-500' },
  ];

  const merchantData = [
    { category: '가맹점', merchant: '스타벅스', date: '2024-11-29', amount: 157600, trend: '+2.3%' },
    { category: '가맹점', merchant: 'GS25', date: '2024-11-28', amount: 145200, trend: '+1.8%' },
    { category: '카테고리', merchant: '식비', date: '2024-11-27', amount: 134500, trend: '+0.9%' },
    { category: '가맹점', merchant: 'CGV', date: '2024-11-26', amount: 127400, trend: '+1.2%' },
    { category: '기온 예측', merchant: '쇼핑몰', date: '2024-11-25', amount: 97300, trend: '-0.5%' },
    { category: '주문', merchant: '음식점', date: '2024-11-24', amount: 94200, trend: '+0.7%' },
    { category: '기타', merchant: '기타', date: '2024-11-23', amount: 71900, trend: '+0.3%' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">Caffeine 관리자</h1>
        </div>
        <nav className="mt-6">
          <a href="#" className="block px-6 py-3 text-white bg-blue-600 border-r-4 border-blue-500">
            📊 대시보드
          </a>
          <a href="#" className="block px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700">
            👥 사용자 관리
          </a>
          <a href="#" className="block px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700">
            💳 거래 내역
          </a>
          <a href="#" className="block px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700">
            🚨 이상 탐지
          </a>
          <a href="#" className="block px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700">
            📋 로그 관리
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">대시보드</h2>
          <p className="text-gray-400 mt-1">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Daily Trend Chart Placeholder */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">일별 거래 추이</h3>
            <div className="h-64 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-gray-500">차트가 곧 추가됩니다</p>
            </div>
          </div>

          {/* Category Chart Placeholder */}
          <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold text-white mb-4">카테고리별 소비</h3>
            <div className="h-64 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-gray-500">차트가 곧 추가됩니다</p>
            </div>
          </div>
        </div>

        {/* Merchant Table */}
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold text-white">가맹점별 상세</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">카테고리</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">가맹점</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-400">날짜</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">금액</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-400">증감</th>
                </tr>
              </thead>
              <tbody>
                {merchantData.map((row, index) => (
                  <tr key={index} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-6 py-4 text-sm text-gray-300">{row.category}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{row.merchant}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{row.date}</td>
                    <td className="px-6 py-4 text-sm text-white text-right">₩{row.amount.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-sm text-right ${row.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {row.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
