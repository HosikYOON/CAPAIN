import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
// 📈 [외부 라이브러리] 예쁜 차트를 쉽게 그리기 위해 가져온 도구들입니다.
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useTheme } from '../contexts/ThemeContext';
// ✨ [직접 만든 컴포넌트들]
import CountUpNumber from '../components/CountUpNumber';   // 숫자가 0부터 주르륵 올라가는 효과
import FadeInView from '../components/FadeInView';         // 스르륵 나타나는 효과
import AnimatedButton from '../components/AnimatedButton'; // 눌렀을 때 뿅! 들어가는 버튼
import { SkeletonStats, SkeletonChart } from '../components/SkeletonCard'; // 로딩 중일 때 보여줄 회색 박스들
import { formatCurrency } from '../utils/currency';        // 1000 -> "1,000원" 으로 바꿔주는 함수
import { CHART_COLORS, ANIMATION_DELAY } from '../constants'; // 미리 정해둔 색상표와 애니메이션 시간

/**
 * [가짜 데이터 (Mock Data)]
 * 실제로는 서버에서 받아와야 하지만, 지금은 테스트를 위해 하드코딩된 데이터입니다.
 * 나중에 백엔드가 완성되면 이 부분을 API 호출로 바꾸면 됩니다.
 */
const MOCK_DATA = {
    summary: { total_spending: 1250000, total_transactions: 81, average_transaction: 15432, most_used_category: '쇼핑', monthly_trend: '증가', anomaly_count: 3 },
    monthlyData: [
        { month: '2024-06', total_amount: 577000 },
        { month: '2024-07', total_amount: 638000 },
        { month: '2024-08', total_amount: 705200 },
        { month: '2024-09', total_amount: 633800 },
        { month: '2024-10', total_amount: 761200 },
        { month: '2024-11', total_amount: 185000 },
    ],
    categoryData: [
        { category: '쇼핑', total_amount: 1140000, percentage: 37 },
        { category: '식비', total_amount: 890000, percentage: 29 },
        { category: '공과금', total_amount: 590000, percentage: 19 },
        { category: '여가', total_amount: 280000, percentage: 9 },
        { category: '교통', total_amount: 125000, percentage: 4 },
        { category: '기타', total_amount: 75000, percentage: 2 },
    ]
};

export default function DashboardScreen({ navigation }) {
    const { colors } = useTheme(); // 테마 색상(다크/라이트)

    /**
     * [State 관리] - 화면을 변화시키는 변수들
     * 1. loading: 데이터를 불러오는 중인가? (true면 로딩화면, false면 본문)
     * 2. refreshing: 사용자가 화면을 당겨서 새로고침 중인가?
     * 3. summary, monthlyData, categoryData: 화면에 뿌려줄 실제 데이터들
     * 4. tooltip: 그래프를 터치했을 때 띄워줄 말풍선 정보
     */
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [summary, setSummary] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [tooltip, setTooltip] = useState(null);

    /**
     * [useRef] - 화면의 특정 위치를 기억하는 '책갈피'
     * 버튼을 누르면 해당 위치로 스크롤을 이동시키기 위해 사용합니다.
     */
    const scrollViewRef = useRef(null); // 전체 스크롤 뷰
    const categoryRef = useRef(null);   // 카테고리 섹션 위치
    const insightRef = useRef(null);    // 인사이트 섹션 위치

    /**
     * [데이터 불러오기 함수]
     * 지금은 가짜 데이터(MOCK_DATA)를 바로 넣지만,
     * 실제로는 여기서 await axios.get(...) 같은 통신 코드가 들어갑니다.
     */
    const loadData = async () => {
        try {
            // 데이터를 State에 집어넣습니다.
            setSummary(MOCK_DATA.summary);
            setMonthlyData(MOCK_DATA.monthlyData);
            setCategoryData(MOCK_DATA.categoryData);
        } finally {
            // 성공하든 실패하든 로딩 상태를 끕니다.
            setLoading(false);
            setRefreshing(false);
        }
    };

    // [useEffect] 화면이 처음 켜지면 loadData()를 한 번 실행해라!
    useEffect(() => { loadData(); }, []);

    // [새로고침] 사용자가 화면을 위에서 아래로 당겼을 때 실행
    const onRefresh = () => {
        setRefreshing(true); // "새로고침 아이콘 뱅글뱅글 돌려!"
        loadData();          // "데이터 다시 가져와!"
    };

    // [스크롤 이동 함수] '총 지출' 카드를 누르면 -> 카테고리 차트 위치로 이동
    const handleTotalSpendingClick = () => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
    };

    // '거래 건수' 카드를 누르면 -> 거래내역 화면으로 이동 (네비게이션)
    const handleTransactionCountClick = () => {
        navigation?.navigate('거래내역');
    };

    // '평균 거래액' 카드를 누르면 -> 맨 아래 인사이트로 이동
    const handleAverageTransactionClick = () => {
        scrollViewRef.current?.scrollTo({ y: 950, animated: true });
    };

    /**
     * [로딩 화면 처리]
     * loading이 true일 때는 실제 화면 대신 '스켈레톤(회색 박스)'을 보여줍니다.
     * 이렇게 해야 사용자가 "아, 뭔가 불러오고 있구나" 하고 안심합니다.
     */
    if (loading) {
        return (
            <ScrollView style={styles(colors).container}>
                <View style={styles(colors).summarySection}>
                    <Text style={styles(colors).sectionTitle}>💰 이번 달 소비 요약</Text>
                    <SkeletonStats /> {/* 통계 카드 모양 스켈레톤 3개 */}
                    <SkeletonStats />
                    <SkeletonStats />
                </View>
                <View style={styles(colors).chartSection}>
                    <Text style={styles(colors).sectionTitle}>📊 월별 지출 추이</Text>
                    <SkeletonChart /> {/* 차트 모양 스켈레톤 */}
                </View>
                <View style={styles(colors).chartSection}>
                    <Text style={styles(colors).sectionTitle}>🥧 카테고리별 소비</Text>
                    <SkeletonChart />
                </View>
            </ScrollView>
        );
    }

    // 화면 너비 계산 (차트 크기를 화면에 꽉 차게 맞추기 위해)
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 40; // 양옆 여백 20씩 뺌

    // [차트 데이터 가공] 라이브러리가 이해할 수 있는 포맷으로 변환
    const lineChartData = {
        labels: monthlyData.map(item => item.month.split('-')[1] + '월'), // "2024-06" -> "06월"
        datasets: [{
            data: monthlyData.map(item => item.total_amount / 1000000),   // 500,000 -> 0.5 (백만 단위)
            color: (opacity = 1) => colors.primary.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
            strokeWidth: 2
        }]
    };

    return (
        <ScrollView
            ref={scrollViewRef} // 나중에 이 스크롤뷰를 조종하려고 이름표(ref)를 붙임
            style={styles(colors).container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // 당겨서 새로고침 기능 연결
        >
            {/* 1. 상단 요약 섹션 */}
            <FadeInView style={styles(colors).summarySection} delay={ANIMATION_DELAY.NONE}>
                <Text style={styles(colors).sectionTitle}>💰 이번 달 소비 요약</Text>

                <View style={styles(colors).summaryGrid}>
                    {/* 총 지출 카드 (가장 크게 강조됨) */}
                    <AnimatedButton style={[styles(colors).summaryCard, styles(colors).mainCard]}
                        onPress={handleTotalSpendingClick}>
                        <Text style={styles(colors).summaryLabel}>총 지출</Text>

                        {/* 숫자가 0부터 목표값까지 드르륵 올라가는 애니메이션 컴포넌트 */}
                        <CountUpNumber
                            value={summary?.total_spending || 0}
                            formatter={(num) => formatCurrency(num)}
                            style={styles(colors).summaryValueLarge}
                            duration={1200}
                        />
                        <Text style={styles(colors).summaryTrend}>
                            {summary?.monthly_trend === '증가' ? '📈 지난달 대비 증가' : '📉 지난달 대비 감소'}
                        </Text>
                        <Text style={styles(colors).clickHint}>탭하여 카테고리 보기</Text>
                    </AnimatedButton>

                    {/* 나머지 작은 카드들 (거래 건수, 평균 거래액) */}
                    <AnimatedButton style={styles(colors).summaryCard} onPress={handleTransactionCountClick}>
                        <Text style={styles(colors).summaryLabel}>거래 건수</Text>
                        <CountUpNumber value={summary?.total_transactions || 0} formatter={(num) => num + '건'} style={styles(colors).summaryValue} duration={1000} />
                        <Text style={styles(colors).clickHint}>탭하여 거래내역 보기</Text>
                    </AnimatedButton>

                    <AnimatedButton style={styles(colors).summaryCard} onPress={handleAverageTransactionClick}>
                        <Text style={styles(colors).summaryLabel}>평균 거래액</Text>
                        <CountUpNumber value={summary?.average_transaction || 0} formatter={(num) => formatCurrency(num)} style={styles(colors).summaryValue} duration={1000} />
                        <Text style={styles(colors).clickHint}>탭하여 인사이트 보기</Text>
                    </AnimatedButton>
                </View>

                {/* 이상 거래 경고창 (데이터가 있을 때만 뜸) */}
                {summary?.anomaly_count > 0 && (
                    <TouchableOpacity style={styles(colors).alertCard}>
                        <Text style={styles(colors).alertIcon}>⚠️</Text>
                        <View style={styles(colors).alertContent}>
                            <Text style={styles(colors).alertTitle}>의심 거래 발견</Text>
                            <Text style={styles(colors).alertText}>{summary.anomaly_count}건의 이상 거래가 감지되었습니다.</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </FadeInView>

            {/* 2. 꺾은선 그래프 섹션 (월별 추이) */}
            <FadeInView style={styles(colors).chartSection} delay={ANIMATION_DELAY.MEDIUM}>
                <Text style={styles(colors).sectionTitle}>📊 월별 지출 추이</Text>
                <View>
                    <LineChart
                        data={lineChartData}
                        width={chartWidth}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.cardBackground,
                            backgroundGradientFrom: colors.cardBackground, // 그라데이션 시작색
                            backgroundGradientTo: colors.cardBackground,   // 그라데이션 끝색
                            decimalPlaces: 1, // 소수점 첫째 자리까지 표시
                            color: (opacity = 1) => colors.primary.replace('rgb', 'rgba').replace(')', `, ${opacity})`), // 선 색상 계산식
                            labelColor: (opacity = 1) => colors.text.replace('rgb', 'rgba').replace(')', `, ${opacity})`), // 글자 색상 계산식
                            style: { borderRadius: 16 },
                            propsForDots: { r: '6', strokeWidth: '2', stroke: colors.primary } // 데이터 점 스타일
                        }}
                        bezier // 선을 곡선으로 부드럽게 만들기
                        style={styles(colors).chart}
                        // 그래프의 점을 클릭했을 때 말풍선(Tooltip) 띄우기
                        onDataPointClick={(data) => {
                            const amount = (data.value * 1000000).toFixed(0);
                            setTooltip({
                                x: data.x, // 클릭한 x 좌표
                                y: data.y, // 클릭한 y 좌표
                                value: formatCurrency(parseInt(amount)),
                                month: monthlyData[data.index]?.month.split('-')[1] + '월'
                            });
                            // 3초 뒤에 말풍선 사라지게 하기
                            setTimeout(() => setTooltip(null), 3000);
                        }}
                    />
                    {/* Tooltip이 존재할 때만 화면에 그리기 (절대 위치 position: absolute 사용) */}
                    {tooltip && (
                        <View style={[styles(colors).tooltip, { left: tooltip.x - 40, top: tooltip.y - 50 }]}>
                            <Text style={styles(colors).tooltipMonth}>{tooltip.month}</Text>
                            <Text style={styles(colors).tooltipValue}>{tooltip.value}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles(colors).chartCaption}>단위: 백만원</Text>
            </FadeInView>

            {/* 3. 카테고리별 소비 (막대그래프 직접 구현) */}
            <FadeInView ref={categoryRef} style={styles(colors).chartSection} delay={ANIMATION_DELAY.LONG}>
                <Text style={styles(colors).sectionTitle}>📊 카테고리별 소비</Text>

                <View style={styles(colors).progressCardContainer}>
                    {/* map함수로 카테고리 데이터 개수만큼 카드를 반복해서 생성 */}
                    {categoryData.map((item, index) => (
                        <FadeInView
                            key={index}
                            style={styles(colors).progressCard}
                            delay={ANIMATION_DELAY.LONG + (index * 100)} // 하나씩 차례대로 나타나게 딜레이 조절
                        >
                            {/* 카드 윗부분 (아이콘, 이름, 금액, 퍼센트) */}
                            <View style={styles(colors).progressCardHeader}>
                                <View style={styles(colors).progressCardLeft}>
                                    <View style={[styles(colors).categoryIcon, { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }]}>
                                        <Text style={styles(colors).categoryEmoji}>
                                            {/* 순서(index)에 따라 이모지 다르게 보여주기 */}
                                            {index === 0 ? '🛍️' : index === 1 ? '🍔' : index === 2 ? '💡' : index === 3 ? '🎮' : index === 4 ? '🚗' : '📦'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles(colors).progressCardTitle}>{item.category}</Text>
                                        <Text style={styles(colors).progressCardAmount}>{formatCurrency(item.total_amount)}</Text>
                                    </View>
                                </View>
                                <View style={styles(colors).progressCardRight}>
                                    <Text style={styles(colors).progressCardPercentage}>{item.percentage}%</Text>
                                </View>
                            </View>

                            {/* 카드 아랫부분 (게이지 바) */}
                            <View style={styles(colors).progressBarContainer}>
                                <View style={styles(colors).progressBarBackground}>
                                    <View
                                        style={[
                                            styles(colors).progressBarFill,
                                            {
                                                width: `${item.percentage}%`, // 퍼센트만큼 너비 채우기
                                                backgroundColor: CHART_COLORS[index % CHART_COLORS.length] // 색상 순환
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        </FadeInView>
                    ))}
                </View>
            </FadeInView>

            {/* 4. AI 인사이트 섹션 (맨 아래) */}
            <FadeInView ref={insightRef} style={styles(colors).insightSection} delay={ANIMATION_DELAY.VERY_LONG}>
                <Text style={styles(colors).sectionTitle}>💡 AI 인사이트</Text>

                <View style={styles(colors).insightCard}>
                    <Text style={styles(colors).insightIcon}>🍔</Text>
                    <Text style={styles(colors).insightText}>
                        이번 달 <Text style={styles(colors).insightHighlight}>{summary?.most_used_category}</Text>에 가장 많이 지출했어요
                    </Text>
                </View>

                <View style={styles(colors).insightCard}>
                    <Text style={styles(colors).insightIcon}>💸</Text>
                    <Text style={styles(colors).insightText}>
                        평균 거래액은 <Text style={styles(colors).insightHighlight}>{summary?.average_transaction.toLocaleString()}원</Text>으로,
                        지난 6개월 평균 대비 <Text style={styles(colors).insightHighlight}>12%</Text> 증가했어요
                    </Text>
                </View>
            </FadeInView>

            {/* 맨 아래 여백 (스크롤 끝까지 잘 보이게) */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

// [스타일 정의] 테마 색상을 받아서 디자인 적용
const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    // ... (나머지 스타일은 디자인 영역이라 상세 설명 생략, 이름만 봐도 유추 가능합니다)
    summarySection: { padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
    summaryGrid: { gap: 12 },
    summaryCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border },
    mainCard: { borderColor: colors.primary, borderWidth: 2 },
    summaryLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
    summaryValue: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    summaryValueLarge: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
    summaryTrend: { fontSize: 12, color: colors.textSecondary },
    clickHint: { fontSize: 11, color: colors.primary, marginTop: 8, opacity: 0.8 },
    alertCard: { marginTop: 16, backgroundColor: colors.warningBackground, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' },
    alertIcon: { fontSize: 32, marginRight: 12 },
    alertContent: { flex: 1 },
    alertTitle: { fontSize: 16, fontWeight: 'bold', color: colors.warning, marginBottom: 4 },
    alertText: { fontSize: 14, color: colors.text },
    chartSection: { padding: 20, backgroundColor: colors.cardBackground, marginBottom: 12 },
    chart: { marginVertical: 8, borderRadius: 16 },
    chartCaption: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 8 },
    categoryList: { marginTop: 16 },
    categoryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    categoryInfo: { flexDirection: 'row', alignItems: 'center' },
    categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
    categoryName: { fontSize: 14, color: colors.text },
    categoryAmount: { alignItems: 'flex-end' },
    categoryValue: { fontSize: 14, fontWeight: 'bold', color: colors.text },
    categoryPercent: { fontSize: 12, color: colors.textSecondary },
    insightSection: { padding: 20 },
    insightCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
    insightIcon: { fontSize: 32, marginRight: 16 },
    insightText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
    insightHighlight: { fontWeight: 'bold', color: colors.primary },

    // Progress Card styles
    progressCardContainer: { gap: 12 },
    progressCard: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    progressCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryEmoji: {
        fontSize: 20,
    },
    progressCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    progressCardAmount: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    progressCardRight: {
        marginLeft: 12,
    },
    progressCardPercentage: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    progressBarContainer: {
        marginTop: 4,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },

    // Tooltip styles
    tooltip: {
        position: 'absolute', // 절대 위치 (다른 요소 위에 둥둥 떠있음)
        backgroundColor: colors.primary,
        borderRadius: 6,
        padding: 8,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000 // 다른 요소보다 무조건 위에 보이게 설정
    },
    tooltipMonth: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 2
    },
    tooltipValue: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold'
    },
    tooltipPercent: {
        fontSize: 10,
        color: '#fff',
        opacity: 0.9,
        marginTop: 2
    },
});