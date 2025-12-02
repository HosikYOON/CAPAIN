import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/currency';
import { RISK_COLORS, EMPTY_MESSAGES } from '../constants';

// ============================================================
// TODO: 백엔드 연결 시 삭제 필요
// ============================================================
// 현재는 MOCK 이상거래 데이터를 사용하고 있습니다.
// 백엔드 API 연결 시 이 MOCK_ANOMALIES를 삭제하고
// useEffect에서 실제 API를 호출하여 ML 모델이 탐지한 
// 이상거래 목록을 가져오세요.
//
// 백엔드 API 엔드포인트 예시:
// - GET /api/anomalies - ML 모델이 탐지한 이상거래 목록
// - POST /api/anomalies/{id}/mark-normal - 정상 거래로 표시
// - POST /api/anomalies/{id}/block-card - 카드 정지 요청
//
// 응답 데이터 형식:
// {
//   anomalies: [
//     {
//       id: number,
//       merchant: string,
//       amount: number,
//       date: string (ISO 8601),
//       reason: string,  // 요약된 의심 이유
//       risk: '높음' | '중간' | '낮음',
//       details: string,  // 상세 설명
//       ml_confidence: number  // ML 모델 신뢰도 (0-1)
//     }
//   ]
// }
// ============================================================
const MOCK_ANOMALIES = [
    { id: 1, merchant: '명품관', amount: 500000, date: '2024-11-09 03:30', reason: '비정상 시간대 + 큰 금액', risk: '높음', details: '비정상적인 시간대 (새벽 3시)\n평소 거래액보다 10배 높음\n처음 이용하는 가맹점' },
    { id: 2, merchant: '알 수 없음', amount: 300000, date: '2024-11-10 02:15', reason: '새벽 + 다른 지역 + 큰 금액', risk: '높음', details: '새벽 시간대 거래\n평소 활동 지역이 아님\n가맹점 정보 불명확' },
    { id: 3, merchant: '유흥업소', amount: 150000, date: '2024-11-11 23:45', reason: '늦은 시간 + 큰 금액', risk: '중간', details: '늦은 밤 시간대\n평소보다 높은 금액\n유흥 관련 업종' },
];

export default function AnomalyDetectionScreen() {
    const { colors } = useTheme();
    const [anomalies, setAnomalies] = useState(MOCK_ANOMALIES);
    const [selectedAnomaly, setSelectedAnomaly] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getRiskColor = (risk) => {
        return RISK_COLORS[risk] || colors.textSecondary;
    };

    const handleAnomalyClick = (item) => {
        setSelectedAnomaly(item);
        setModalVisible(true);
    };

    // ============================================================
    // TODO: 백엔드 API 연결 - 정상 거래 표시
    // ============================================================
    // const handleMarkAsNormal = async () => {
    //     if (!selectedAnomaly) return;
    //
    //     try {
    //         const token = await AsyncStorage.getItem('authToken');
    //         const response = await fetch(`${API_BASE_URL}/anomalies/${selectedAnomaly.id}/mark-normal`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //
    //         if (!response.ok) throw new Error('처리 실패');
    //
    //         setAnomalies(prev => prev.filter(a => a.id !== selectedAnomaly.id));
    //         setModalVisible(false);
    //         setTimeout(() => alert(' 정상 거래로 표시되었습니다.'), 300);
    //     } catch (error) {
    //         console.error('처리 실패:', error);
    //         alert('처리 중 오류가 발생했습니다.');
    //     }
    // };
    // ============================================================
    const handleMarkAsNormal = () => {
        if (selectedAnomaly) {
            // 현재는 로컬에서만 처리 (백엔드 연결 시 위의 예시 코드로 교체)
            setAnomalies(prev => prev.filter(a => a.id !== selectedAnomaly.id));
            setModalVisible(false);
            setTimeout(() => {
                alert(' 정상 거래로 표시되었습니다.');
            }, 300);
        }
    };

    // ============================================================
    // TODO: 백엔드 API 연결 - 카드 정지 요청
    // ============================================================
    // const handleBlockCard = async () => {
    //     if (!selectedAnomaly) return;
    //
    //     try {
    //         const token = await AsyncStorage.getItem('authToken');
    //         const response = await fetch(`${API_BASE_URL}/anomalies/${selectedAnomaly.id}/block-card`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
    //
    //         if (!response.ok) throw new Error('요청 실패');
    //
    //         setModalVisible(false);
    //         setTimeout(() => {
    //             alert(' 카드 정지 요청이 접수되었습니다.\n고객센터에서 곧 연락드리겠습니다.');
    //         }, 300);
    //     } catch (error) {
    //         console.error('요청 실패:', error);
    //         alert('요청 처리 중 오류가 발생했습니다.');
    //     }
    // };
    // ============================================================
    const handleBlockCard = () => {
        // 현재는 로컬에서만 처리 (백엔드 연결 시 위의 예시 코드로 교체)
        setModalVisible(false);
        setTimeout(() => {
            alert(' 카드 정지 요청이 접수되었습니다.\n고객센터에서 곧 연락드리겠습니다.');
        }, 300);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles(colors).anomalyCard} onPress={() => handleAnomalyClick(item)} activeOpacity={0.7}>
            <View style={styles(colors).cardHeader}>
                <Text style={styles(colors).merchant}>{item.merchant}</Text>
                <View style={[styles(colors).riskBadge, { backgroundColor: getRiskColor(item.risk) + '20' }]}>
                    <Text style={[styles(colors).riskText, { color: getRiskColor(item.risk) }]}>{item.risk}</Text>
                </View>
            </View>
            <Text style={styles(colors).amount}>{formatCurrency(item.amount)}</Text>
            <Text style={styles(colors).date}>{item.date}</Text>
            <View style={styles(colors).reasonBox}>
                <Text style={styles(colors).reasonLabel}>의심 이유:</Text>
                <Text style={styles(colors).reason}>{item.reason}</Text>
            </View>
            <Text style={styles(colors).clickHint}>탭하여 상세 정보 보기</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).header}>
                <Text style={styles(colors).title}> 이상 거래 탐지</Text>
                <Text style={styles(colors).subtitle}>총 {anomalies.length}건의 의심 거래</Text>
            </View>
            {anomalies.length === 0 ? (
                <EmptyState {...EMPTY_MESSAGES.NO_ANOMALIES} />
            ) : (
                <FlatList
                    data={anomalies}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles(colors).list}
                />
            )}

            {/* Custom Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).modalContent}>
                        <Text style={styles(colors).modalTitle}> 상세 정보</Text>

                        {selectedAnomaly && (
                            <>
                                <View style={styles(colors).modalInfo}>
                                    <Text style={styles(colors).modalMerchant}>{selectedAnomaly.merchant}</Text>
                                    <Text style={styles(colors).modalAmount}>{formatCurrency(selectedAnomaly.amount)}</Text>
                                    <Text style={styles(colors).modalDate}>{selectedAnomaly.date}</Text>
                                </View>

                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}>📍 의심 이유:</Text>
                                    <Text style={styles(colors).modalText}>{selectedAnomaly.details}</Text>
                                </View>

                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}> 조치 방법:</Text>
                                    <Text style={styles(colors).modalText}>• 본인 거래라면 "정상 거래로 표시"{'\n'}• 의심스럽다면 "카드 정지" 요청</Text>
                                </View>
                            </>
                        )}

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

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    list: { padding: 20 },
    anomalyCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: colors.error },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    merchant: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    riskBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    riskText: { fontSize: 12, fontWeight: 'bold' },
    amount: { fontSize: 24, fontWeight: 'bold', color: colors.error, marginBottom: 4 },
    date: { fontSize: 12, color: colors.textSecondary, marginBottom: 12 },
    reasonBox: { backgroundColor: colors.warningBackground, borderRadius: 8, padding: 12 },
    reasonLabel: { fontSize: 12, fontWeight: 'bold', color: colors.warning, marginBottom: 4 },
    reason: { fontSize: 14, color: colors.text },
    clickHint: { fontSize: 11, color: colors.primary, marginTop: 8, opacity: 0.8 },

    // Modal styles
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
