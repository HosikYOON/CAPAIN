import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/currency'; // 돈 액수에 콤마(,) 찍어주는 도구
import { RISK_COLORS, EMPTY_MESSAGES } from '../constants'; // 미리 정해둔 색깔과 메시지들

/**
 * [가짜 데이터 (Mock Data)]
 * 아직 서버(백엔드)가 완성되지 않았기 때문에,
 * "마치 서버에서 받아온 것처럼" 미리 만들어둔 테스트용 데이터입니다.
 */
const MOCK_ANOMALIES = [
    { id: 1, merchant: '명품관', amount: 500000, date: '2024-11-09 03:30', reason: '비정상 시간대 + 큰 금액', risk: '높음', details: '비정상적인 시간대 (새벽 3시)\n평소 거래액보다 10배 높음\n처음 이용하는 가맹점' },
    { id: 2, merchant: '알 수 없음', amount: 300000, date: '2024-11-10 02:15', reason: '새벽 + 다른 지역 + 큰 금액', risk: '높음', details: '새벽 시간대 거래\n평소 활동 지역이 아님\n가맹점 정보 불명확' },
    { id: 3, merchant: '유흥업소', amount: 150000, date: '2024-11-11 23:45', reason: '늦은 시간 + 큰 금액', risk: '중간', details: '늦은 밤 시간대\n평소보다 높은 금액\n유흥 관련 업종' },
];

export default function AnomalyDetectionScreen() {
    const { colors } = useTheme(); // 다크모드/라이트모드 색상 가져오기

    /**
     * [상태(State) 관리]
     * 화면에서 변할 수 있는 값들을 선언합니다.
     * 1. anomalies: 현재 화면에 보여줄 '이상 거래 목록'
     * 2. selectedAnomaly: 사용자가 클릭해서 자세히 보고 있는 '그 거래' (없으면 null)
     * 3. modalVisible: 상세 정보 팝업창을 보여줄지 말지 결정 (true: 보임, false: 숨김)
     */
    const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
    const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // 위험도(높음/중간/낮음)에 따라 글자 색깔을 다르게 주는 함수
    const getRiskColor = (risk) => {
        return RISK_COLORS[risk] || colors.textSecondary;
    };

    // [이벤트] 리스트에서 항목을 클릭했을 때 -> 팝업을 띄운다.
    const handleAnomalyClick = (item) => {
        setSelectedAnomaly(item); // 1. 어떤 놈을 클릭했는지 기억하고
        setModalVisible(true);    // 2. 팝업창을 연다.
    };

    // [이벤트] "정상 거래로 표시" 버튼을 눌렀을 때
    const handleMarkAsNormal = () => {
        if (selectedAnomaly) {
            // 1. 리스트에서 방금 선택한 그 녀석(id가 같은 녀석)을 뺍니다(filter).
            setAnomalies(prev => prev.filter(a => a.id !== selectedAnomaly.id));

            // 2. 팝업창을 닫습니다.
            setModalVisible(false);

            // 3. 사용자에게 확인 메시지를 띄웁니다. (0.3초 뒤에 자연스럽게)
            setTimeout(() => {
                alert('✅ 정상 거래로 표시되었습니다.');
            }, 300);
        }
    };

    // [이벤트] "카드 정지" 버튼을 눌렀을 때
    const handleBlockCard = () => {
        setModalVisible(false); // 팝업 닫고
        setTimeout(() => {
            alert('⚠️ 카드 정지 요청이 접수되었습니다.\n고객센터에서 곧 연락드리겠습니다.');
        }, 300);
    };

    /**
     * [리스트 아이템 그리기]
     * FlatList가 "자, 1번 데이터 그려줘", "2번 데이터 그려줘" 할 때마다 실행되는 함수입니다.
     * item: 데이터 하나 (예: 명품관 50만원 건)
     */
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles(colors).anomalyCard}
            onPress={() => handleAnomalyClick(item)} // 누르면 팝업 열기 함수 실행
            activeOpacity={0.7} // 눌렀을 때 살짝 투명해지는 효과
        >
            {/* 카드 윗부분 (가맹점 이름 + 위험도 뱃지) */}
            <View style={styles(colors).cardHeader}>
                <Text style={styles(colors).merchant}>{item.merchant}</Text>
                {/* 뱃지 배경색은 투명하게(+'20'), 글자는 진하게 설정 */}
                <View style={[styles(colors).riskBadge, { backgroundColor: getRiskColor(item.risk) + '20' }]}>
                    <Text style={[styles(colors).riskText, { color: getRiskColor(item.risk) }]}>{item.risk}</Text>
                </View>
            </View>

            {/* 금액과 날짜 */}
            <Text style={styles(colors).amount}>{formatCurrency(item.amount)}</Text>
            <Text style={styles(colors).date}>{item.date}</Text>

            {/* 노란색 의심 이유 박스 */}
            <View style={styles(colors).reasonBox}>
                <Text style={styles(colors).reasonLabel}>의심 이유:</Text>
                <Text style={styles(colors).reason}>{item.reason}</Text>
            </View>

            <Text style={styles(colors).clickHint}>탭하여 상세 정보 보기</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles(colors).container}>
            {/* 상단 제목 영역 */}
            <View style={styles(colors).header}>
                <Text style={styles(colors).title}>🔍 이상 거래 탐지</Text>
                <Text style={styles(colors).subtitle}>총 {anomalies.length}건의 의심 거래</Text>
            </View>

            {/* [조건부 렌더링]
                데이터가 0개면 -> EmptyState(텅 비었어요) 컴포넌트 보여주기
                데이터가 있으면 -> FlatList(목록) 보여주기
            */}
            {anomalies.length === 0 ? (
                <EmptyState {...EMPTY_MESSAGES.NO_ANOMALIES} />
            ) : (
                /**
                 * [FlatList]
                 * 데이터가 많을 때 스크롤하면서 효율적으로 보여주는 리스트 컴포넌트입니다.
                 * data: 보여줄 데이터 원본 배열
                 * renderItem: 배열의 각 요소를 어떻게 그릴지 정의한 함수
                 * keyExtractor: 각 아이템의 고유 주민등록번호(ID)를 알려줌 (성능 최적화용)
                 */
                <FlatList
                    data={anomalies}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles(colors).list}
                />
            )}

            {/* [Modal (팝업창)]
                평소에는 숨겨져 있다가(visible={false}), 
                modalVisible 상태가 true가 되면 화면 맨 위에 덮어 씌워집니다.
                transparent={true}: 배경을 반투명 검은색으로 만들기 위해 사용
            */}
            <Modal
                animationType="fade"     // 스르륵 나타나는 효과
                transparent={true}       // 배경 투명하게
                visible={modalVisible}   // 이 값이 true일 때만 보임!
                onRequestClose={() => setModalVisible(false)}> {/* 안드로이드 뒤로가기 키 대응 */}

                {/* 검은 반투명 배경 (누르면 닫히지는 않음, 닫기 버튼 눌러야 함) */}
                <View style={styles(colors).modalOverlay}>
                    {/* 하얀색 실제 팝업 내용 박스 */}
                    <View style={styles(colors).modalContent}>
                        <Text style={styles(colors).modalTitle}>🔍 상세 정보</Text>

                        {/* selectedAnomaly가 있을 때만 내용을 보여줌 (에러 방지용 &&) */}
                        {selectedAnomaly && (
                            <>
                                {/* 1. 기본 정보 (어디서, 얼마, 언제) */}
                                <View style={styles(colors).modalInfo}>
                                    <Text style={styles(colors).modalMerchant}>{selectedAnomaly.merchant}</Text>
                                    <Text style={styles(colors).modalAmount}>{formatCurrency(selectedAnomaly.amount)}</Text>
                                    <Text style={styles(colors).modalDate}>{selectedAnomaly.date}</Text>
                                </View>

                                {/* 2. 상세 이유 */}
                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}>📍 의심 이유:</Text>
                                    <Text style={styles(colors).modalText}>{selectedAnomaly.details}</Text>
                                </View>

                                {/* 3. 안내 문구 */}
                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}>⚠️ 조치 방법:</Text>
                                    <Text style={styles(colors).modalText}>• 본인 거래라면 "정상 거래로 표시"{'\n'}• 의심스럽다면 "카드 정지" 요청</Text>
                                </View>
                            </>
                        )}

                        {/* 하단 버튼 3개 (취소 / 정상 / 정지) */}
                        <View style={styles(colors).modalButtons}>
                            <TouchableOpacity style={styles(colors).modalButtonCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles(colors).modalButtonTextCancel}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(colors).modalButtonNormal} onPress={handleMarkAsNormal}>
                                <Text style={styles(colors).modalButtonText}>정상 거래로 표시</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(colors).modalButtonBlock} onPress={handleBlockCard}>
                                <Text style={styles(colors).modalButtonText}>카드 정지</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/**
 * [스타일 정의]
 * 화면의 모든 생김새(크기, 색깔, 여백, 폰트 등)를 정의합니다.
 * colors 객체를 받아서 테마(다크/라이트)에 맞는 색상을 적용합니다.
 */
const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    list: { padding: 20 },

    // 카드 스타일: 빨간 테두리(error color)를 줘서 위험함을 강조
    anomalyCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: colors.error },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    merchant: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    riskText: { fontSize: 12, fontWeight: 'bold' },
    amount: { fontSize: 24, fontWeight: 'bold', color: colors.error, marginBottom: 4 },
    date: { fontSize: 12, color: colors.textSecondary, marginBottom: 12 },

    // 이유 박스: 노란색 배경으로 주의 환기
    reasonBox: { backgroundColor: colors.warningBackground, borderRadius: 8, padding: 12 },
    reasonLabel: { fontSize: 12, fontWeight: 'bold', color: colors.warning, marginBottom: 4 },
    reason: { fontSize: 14, color: colors.text },
    clickHint: { fontSize: 11, color: colors.primary, marginTop: 8, opacity: 0.8 },

    // 모달(팝업) 관련 스타일
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: colors.cardBackground, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, borderWidth: 1, borderColor: colors.border },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
    modalInfo: { alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
    modalMerchant: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    modalAmount: { fontSize: 28, fontWeight: 'bold', color: colors.error, marginBottom: 4 },
    modalDate: { fontSize: 14, color: colors.textSecondary },
    modalSection: { marginBottom: 16 },
    modalSectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    modalText: { fontSize: 14, color: colors.text, lineHeight: 20 },
    modalButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
    modalButtonCancel: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    modalButtonNormal: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.success },
    modalButtonBlock: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: colors.error },
    modalButtonTextCancel: { color: colors.text, textAlign: 'center', fontWeight: 'bold', fontSize: 13 },
    modalButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 13 },
});