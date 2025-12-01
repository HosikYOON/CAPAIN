import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * [SkeletonCard]
 * 가장 기본적인 카드 형태의 로딩 스켈레톤입니다.
 * 회색 박스가 깜빡거리는 효과(Pulse)를 줍니다.
 */
export function SkeletonCard() {
    const { colors } = useTheme(); // 테마 색상 가져오기

    /**
     * [애니메이션 값 설정]
     * 투명도(opacity)를 조절할 변수입니다.
     * 0.3(흐림)에서 시작해서 0.7(진함)까지 왔다 갔다 할 예정입니다.
     * useRef를 써서 리렌더링과 상관없이 값을 유지합니다.
     */
    const opacity = useRef(new Animated.Value(0.3)).current;

    /**
     * [애니메이션 로직]
     * 컴포넌트가 화면에 뜨자마자(useEffect) 무한 반복(loop)을 시작합니다.
     */
    useEffect(() => {
        Animated.loop(
            // sequence: 배열 안에 있는 애니메이션을 '순서대로' 실행합니다.
            Animated.sequence([
                // 1단계: 0.3 -> 0.7로 밝아짐 (0.7초 동안)
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 700,
                    useNativeDriver: true, // 네이티브 드라이버를 켜서 성능 최적화 (버벅임 방지)
                }),
                // 2단계: 0.7 -> 0.3으로 다시 흐려짐 (0.7초 동안)
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ])
        ).start(); // 애니메이션 시작!
    }, []);

    return (
        // Animated.View: opacity 값이 계속 변하므로 일반 View 대신 사용
        <Animated.View style={[styles(colors).card, { opacity }]}>
            {/* 제목 부분인 척하는 회색 박스 */}
            <View style={styles(colors).header} />
            {/* 본문 줄글인 척하는 회색 박스들 */}
            <View style={styles(colors).line} />
            <View style={[styles(colors).line, { width: '60%' }]} />
        </Animated.View>
    );
}

/**
 * [SkeletonList]
 * SkeletonCard를 여러 개(count 개수만큼) 반복해서 보여주는 컴포넌트입니다.
 * 예: 리스트 데이터 로딩 중일 때 카드 3~5개를 띄워둠
 */
export function SkeletonList({ count = 3 }) {
    return (
        <View>
            {/* Array.from({ length: count }): 길이가 count인 빈 배열을 만듭니다.
               .map((_, index)): 배열을 돌면서 SkeletonCard를 개수만큼 생성합니다.
               React에서 리스트를 만들 땐 key prop이 필수입니다!
            */}
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </View>
    );
}

/**
 * [SkeletonChart]
 * 차트(그래프)가 들어갈 자리의 스켈레톤입니다.
 * 로직은 위와 똑같고, 스타일(높이, 모양)만 차트처럼 생겼습니다.
 */
export function SkeletonChart() {
    const { colors } = useTheme();
    // 애니메이션 값 (위와 동일한 로직)
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // "밝아졌다 흐려졌다" 무한 반복
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        // 차트 영역은 높이가 좀 더 높아야겠죠? (height: 220)
        <Animated.View style={[styles(colors).card, { opacity, height: 220 }]}>
            <View style={styles(colors).header} />
            {/* 그래프가 들어갈 큼지막한 박스 */}
            <View style={styles(colors).chartPlaceholder} />
        </Animated.View>
    );
}

/**
 * [SkeletonTransaction]
 * 거래 내역 리스트 한 줄에 대한 스켈레톤입니다.
 * "날짜 + 금액" 처럼 좌우로 나뉘어 있는 모양을 흉내 냅니다.
 */
export function SkeletonTransaction() {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    // 애니메이션 로직 복사 붙여넣기 (실무에선 이걸 커스텀 훅으로 빼기도 합니다)
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles(colors).card, { opacity }]}>
            {/* flex-direction: row -> 가로로 배치 (날짜와 금액이 양옆에 있는 것처럼) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={[styles(colors).header, { width: '40%' }]} />
                <View style={[styles(colors).header, { width: '30%' }]} />
            </View>
            <View style={[styles(colors).line, { width: '70%' }]} />
        </Animated.View>
    );
}

/**
 * [SkeletonStats]
 * 상단 통계 카드(예: 이번 달 총지출) 모양의 스켈레톤입니다.
 */
export function SkeletonStats() {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles(colors).statCard, { opacity }]}>
            {/* 작은 글씨(Label) 먼저 */}
            <View style={[styles(colors).line, { width: '40%', marginBottom: 12 }]} />
            {/* 큰 숫자(Value) 나중 */}
            <View style={[styles(colors).header, { width: '60%', height: 32 }]} />
        </Animated.View>
    );
}

/**
 * [스타일 정의]
 * 회색 박스들의 크기, 색깔, 여백 등을 정의합니다.
 * 실제 데이터가 들어올 공간과 비슷한 크기로 잡는 것이 포인트입니다.
 */
const styles = (colors) => StyleSheet.create({
    // 전체 컨테이너 (카드 모양)
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    // 제목 같은 굵은 박스
    header: {
        height: 20,
        backgroundColor: colors.border, // 보통 회색 계열
        borderRadius: 4,
        marginBottom: 12,
        width: '40%',
    },
    // 본문 같은 얇은 박스
    line: {
        height: 12,
        backgroundColor: colors.border,
        borderRadius: 4,
        marginBottom: 8,
    },
    // 차트 영역 박스
    chartPlaceholder: {
        height: 150,
        backgroundColor: colors.border,
        borderRadius: 8,
        marginTop: 8,
    },
    // 통계 카드 전용 스타일
    statCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 100,
    },
});