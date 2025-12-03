import { ReactNode } from 'react';

/**
 * Card 컴포넌트 Props
 */
interface CardProps {
    /** 카드 내부 콘텐츠 */
    children: ReactNode;

    /** 추가 CSS 클래스 (선택사항) */
    className?: string;
}

/**
 * 기본 카드 컴포넌트
 * 
 * 흰색 배경, 둥근 모서리, 그림자가 있는 재사용 가능한 카드입니다.
 * 대시보드 전체에서 일관된 스타일을 유지하기 위해 사용합니다.
 * 
 * @example
 * <Card>
 *   <p>카드 내용</p>
 * </Card>
 * 
 * @example
 * <Card className="p-8">
 *   <p>패딩이 추가된 카드</p>
 * </Card>
 */
export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
            {children}
        </div>
    );
}

/**
 * CardHeader 컴포넌트 Props
 */
interface CardHeaderProps {
    /** 헤더 내부 콘텐츠 */
    children: ReactNode;

    /** 추가 CSS 클래스 (선택사항) */
    className?: string;
}

/**
 * 카드 헤더 컴포넌트
 * 
 * Card 컴포넌트 내부에서 사용하며, 하단에 구분선이 있습니다.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <h3>제목</h3>
 *   </CardHeader>
 *   <CardContent>내용</CardContent>
 * </Card>
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`p-6 border-b border-gray-100 ${className}`}>
            {children}
        </div>
    );
}

/**
 * CardContent 컴포넌트 Props
 */
interface CardContentProps {
    /** 콘텐츠 내부 내용 */
    children: ReactNode;

    /** 추가 CSS 클래스 (선택사항) */
    className?: string;
}

/**
 * 카드 콘텐츠 컴포넌트
 * 
 * Card 컴포넌트 내부에서 사용하며, 기본 패딩이 적용됩니다.
 * 
 * @example
 * <Card>
 *   <CardHeader>제목</CardHeader>
 *   <CardContent>
 *     <p>여기에 내용 작성</p>
 *   </CardContent>
 * </Card>
 */
export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
}
