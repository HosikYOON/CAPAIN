import { ConsumptionItemData } from '@/types';

/**
 * 소비 항목 컴포넌트
 * 
 * 개별 소비 카테고리를 프로그레스 바와 함께 표시합니다.
 * 카테고리명, 금액, 비율(프로그레스 바)을 한 줄로 보여줍니다.
 * 
 * @example
 * <ConsumptionItem 
 *   name="식비" 
 *   amount="₩450,000" 
 *   percent="35%" 
 * />
 */
export function ConsumptionItem({ name, amount, percent }: ConsumptionItemData) {
    return (
        <div className="flex items-center justify-between">
            {/* 카테고리명 */}
            <span className="text-gray-600">{name}</span>

            {/* 프로그레스 바 + 금액 */}
            <div className="flex items-center gap-4">
                {/* 프로그레스 바 */}
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: percent }}></div>
                </div>
                {/* 금액 */}
                <span className="text-sm font-medium text-gray-800">{amount}</span>
            </div>
        </div>
    );
}
