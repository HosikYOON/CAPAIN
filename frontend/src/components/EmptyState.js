import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * [EmptyState 컴포넌트]
 * 데이터가 없거나(예: 검색 결과 없음, 거래 내역 없음) 빈 화면일 때 보여주는 UI입니다.
 * * @param {Object} props - 부모 컴포넌트에서 전달받은 데이터들
 * @param {string} icon - 화면 중앙에 띄울 이모티콘이나 아이콘 (기본값: '📭')
 * @param {string} title - 굵게 표시될 제목 텍스트
 * @param {string} description - 제목 아래에 표시될 상세 설명
 * @param {string} actionText - 버튼에 들어갈 텍스트 (없으면 버튼 안 보임)
 * @param {Function} onAction - 버튼을 눌렀을 때 실행될 함수
 */
export default function EmptyState({ icon = '📭', title, description, actionText, onAction }) {
    // 테마(다크모드/라이트모드) 색상 정보를 가져옵니다.
    const { colors } = useTheme();

    /**
     * [애니메이션 값 초기화 - useRef 사용 이유]
     * 일반 변수(let)는 컴포넌트가 리렌더링되면 초기화되고, 
     * useState는 값이 바뀌면 리렌더링을 유발합니다.
     * * 애니메이션 값은 리렌더링 없이 계속 유지되어야 하고, 값이 변한다고 해서
     * 화면 전체를 다시 그릴 필요는 없기 때문에 useRef를 사용합니다.
     * * fadeAnim: 투명도 조절용 (0: 안 보임 -> 1: 다 보임)
     * scaleAnim: 크기 조절용 (0.9: 약간 작음 -> 1: 원래 크기)
     */
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    /**
     * [useEffect - 컴포넌트가 처음 나타날 때 실행]
     * 의존성 배열 []이 비어있으므로, 이 코드는 컴포넌트가 화면에 처음 '마운트' 될 때 딱 한 번 실행됩니다.
     */
    useEffect(() => {
        // Animated.parallel: 여러 애니메이션을 동시에 실행합니다.
        Animated.parallel([
            // 1. 투명도 애니메이션 (서서히 나타나기)
            Animated.timing(fadeAnim, {
                toValue: 1,             // 목표값: 1 (불투명)
                duration: 500,          // 시간: 0.5초 동안
                useNativeDriver: true,  // 성능 최적화 (JS 스레드 대신 네이티브 UI 스레드 사용)
            }),
            // 2. 크기 애니메이션 (통통 튀는 효과)
            Animated.spring(scaleAnim, {
                toValue: 1,             // 목표값: 1 (원래 크기)
                friction: 8,            // 마찰력: 낮을수록 많이 튕김
                tension: 40,            // 장력: 높을수록 빠르게 튕김
                useNativeDriver: true,
            }),
        ]).start(); // .start()를 호출해야 애니메이션이 실제로 시작됩니다.
    }, []);

    return (
        /**
         * [Animated.View]
         * 일반 <View>는 애니메이션 값을 이해하지 못합니다.
         * 애니메이션이 적용된 스타일을 쓰려면 반드시 <Animated.View>를 써야 합니다.
         */
        <Animated.View
            style={[
                styles(colors).container,
                {
                    // 위에서 만든 애니메이션 값을 스타일에 연결(바인딩)합니다.
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <Text style={styles(colors).icon}>{icon}</Text>
            <Text style={styles(colors).title}>{title}</Text>
            <Text style={styles(colors).description}>{description}</Text>

            {/* [조건부 렌더링]
              actionText와 onAction이 둘 다 존재할 때만(&&) 버튼을 화면에 그립니다.
              하나라도 없으면 버튼은 아예 렌더링되지 않습니다.
            */}
            {actionText && onAction && (
                <TouchableOpacity style={styles(colors).button} onPress={onAction}>
                    <Text style={styles(colors).buttonText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

/**
 * [스타일 시트]
 * colors를 인자로 받아서, 테마(다크/라이트)에 따라 동적으로 스타일을 생성하는 함수 형태입니다.
 */
const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,                    // 부모 컨테이너의 남은 공간을 꽉 채움
        justifyContent: 'center',   // 세로(수직) 축 중앙 정렬
        alignItems: 'center',       // 가로(수평) 축 중앙 정렬
        padding: 40,
    },
    icon: {
        fontSize: 72,
        marginBottom: 24,           // 아래 요소와의 간격
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,             // 줄 간격 (가독성을 위해 설정)
        marginBottom: 24,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 24,      // 좌우 패딩
        paddingVertical: 12,        // 상하 패딩
        borderRadius: 8,            // 모서리 둥글게
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});