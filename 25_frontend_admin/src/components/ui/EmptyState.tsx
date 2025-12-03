/**
 * EmptyState 컴포넌트 Props
 */
interface EmptyStateProps {
    /** 표시할 제목 */
    title: string;

    /** 설명 텍스트 (선택사항) */
    description?: string;
}

/**
 * 빈 상태 표시 컴포넌트
 * 
 * 데이터가 없거나 페이지가 준비 중일 때 사용합니다.
 * 중앙 정렬된 제목과 설명을 표시합니다.
 * 
 * @example
 * <EmptyState 
 *   title="연령대별 소비 분석" 
 *   description="이 페이지는 준비 중입니다." 
 * />
 * 
 * @example
 * // 설명 없이 제목만
 * <EmptyState title="데이터가 없습니다" />
 */
export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                {description && <p className="text-gray-500">{description}</p>}
            </div>
        </div>
    );
}
