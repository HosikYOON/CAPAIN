import { CategoryData } from '@/types';

/**
 * CategoryTable 컴포넌트 Props
 */
interface CategoryTableProps {
    /** 표시할 카테고리 데이터 배열 */
    data: CategoryData[];
}

/**
 * 카테고리 상세 테이블 컴포넌트
 * 
 * 카테고리별 거래액, 거래 건수, 비율을 표 형식으로 표시합니다.
 * hover 효과가 있어 각 행을 쉽게 구분할 수 있습니다.
 * 
 * @example
 * <CategoryTable data={[
 *   { category: "마트/편의점", amount: "₩4.2억", count: "28,934", ratio: "34.0%" }
 * ]} />
 */
export function CategoryTable({ data }: CategoryTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">카테고리 상세</h3>
            </div>

            {/* 테이블 본문 */}
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
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                {/* 카테고리명 (점 아이콘 포함) */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                    {row.category}
                                </td>
                                {/* 거래액 */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{row.amount}</td>
                                {/* 거래 건수 */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{row.count}</td>
                                {/* 비율 (배지 형태) */}
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
    );
}
