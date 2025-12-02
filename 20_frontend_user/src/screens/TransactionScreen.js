import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/currency';
import { EMPTY_MESSAGES } from '../constants';

// ============================================================
// TODO: 백엔드 연결 시 삭제 필요
// ============================================================
// 현재는 MOCK 거래내역 데이터를 사용하고 있습니다.
// 백엔드 API 연결 시 이 MOCK_TRANSACTIONS를 삭제하고
// useEffect에서 실제 API를 호출하여 거래내역을 가져오세요.
//
// 백엔드 API 엔드포인트 예시:
// - GET /api/transactions - 전체 거래내역 조회
// - GET /api/transactions?category=식비 - 카테고리별 조회
// - POST /api/transactions/{id}/anomaly - 이상거래 신고
//
// 응답 데이터 형식:
// {
//   transactions: [
//     {
//       id: number,
//       merchant: string,
//       businessName: string,
//       amount: number,
//       category: string,
//       date: string (ISO 8601),
//       notes: string,
//       cardType: '신용' | '체크',
//       accumulated?: number,  // 신용카드인 경우
//       balance?: number        // 체크카드인 경우
//     }
//   ]
// }
//
//  중요: ID 타입 변환
// 백엔드가 숫자 ID를 반환하는 경우 문자열로 변환 필요:
// const transactionsData = response.data.map(t => ({
//     ...t,
//     id: String(t.id) // 숫자 → 문자열 변환
// }));
// setTransactions(transactionsData);
// ============================================================
const MOCK_TRANSACTIONS = [
    { id: 1, merchant: '스타벅스', businessName: '스타벅스커피코리아(주)', amount: 15000, category: '식비', date: '2024-11-29 10:00', notes: '아메리카노', cardType: '신용', accumulated: 215000 },
    { id: 2, merchant: 'GS25', businessName: 'GS리테일(주)', amount: 5000, category: '교통', date: '2024-11-28 08:30', notes: 'T-money 충전', cardType: '체크', balance: 1250000 },
    { id: 3, merchant: '올리브영', businessName: 'CJ올리브영(주)', amount: 45000, category: '쇼핑', date: '2024-11-27 14:20', notes: '화장품', cardType: '신용', accumulated: 200000 },
    { id: 4, merchant: '김밥천국', businessName: '김밥천국 강남점', amount: 8000, category: '식비', date: '2024-11-26 12:15', notes: '점심', cardType: '체크', balance: 1255000 },
    { id: 5, merchant: 'CGV', businessName: 'CJ CGV(주)', amount: 12000, category: '여가', date: '2024-11-25 19:00', notes: '영화 관람', cardType: '체크', balance: 1263000 },
    { id: 6, merchant: '맥도날드', businessName: '맥도날드(유)', amount: 7000, category: '식비', date: '2024-11-24 18:00', notes: '저녁', cardType: '신용', accumulated: 155000 },
    { id: 7, merchant: '다이소', businessName: '아성다이소(주)', amount: 35000, category: '쇼핑', date: '2024-11-23 15:30', notes: '생활용품', cardType: '체크', balance: 1270000 },
    { id: 8, merchant: '이마트', businessName: '신세계이마트(주)', amount: 120000, category: '쇼핑', date: '2024-11-22 17:00', notes: '식료품', cardType: '신용', accumulated: 148000 },
];

export default function TransactionScreen({ navigation }) {
    const { colors } = useTheme();
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [anomalyCategoryModalVisible, setAnomalyCategoryModalVisible] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [editedNote, setEditedNote] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = transactions.filter(t => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            t.merchant.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.notes?.toLowerCase().includes(query) ||
            t.businessName.toLowerCase().includes(query)
        );
    });

    const handleTransactionClick = (item) => {
        setSelectedTransaction(item);
        setEditedNote(item.notes || '');
        setIsEditingNote(false);
        setModalVisible(true);
    };

    const handleMarkAsAnomaly = () => {
        setModalVisible(false);
        setTimeout(() => {
            setAnomalyCategoryModalVisible(true);
        }, 300);
    };

    // ============================================================
    // TODO: 백엔드 API 연결 - 이상거래 신고
    // ============================================================
    // 백엔드 연결 시 아래 함수를 수정하여 서버에 이상거래 정보를 전송하세요.
    //
    // 예시 코드:
    // const handleCategorySelect = async (category) => {
    //     if (!selectedTransaction) return;
    //
    //     try {
    //         const token = await AsyncStorage.getItem('authToken');
    //         
    //         // 이상거래 신고 API 호출
    //         const response = await fetch(`${API_BASE_URL}/transactions/${selectedTransaction.id}/anomaly`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 category: category,  // 'safe', 'suspicious', 'dangerous'
    //                 merchant: selectedTransaction.merchant,
    //                 amount: selectedTransaction.amount,
    //                 timestamp: new Date().toISOString()
    //             })
    //         });
    //
    //         if (!response.ok) throw new Error('신고 실패');
    //
    //         const result = await response.json();
    //         
    //         setAnomalyCategoryModalVisible(false);
    //         setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
    //
    //         const messages = {
    //             safe: ' 안전한 거래로 표시되었습니다.',
    //             suspicious: ' 의심 거래로 표시되었습니다.\n이상탐지 탭에서 확인할 수 있습니다.',
    //             dangerous: ' 위험 거래로 표시되었습니다.\n고객센터로 자동 신고되었습니다.'
    //         };
    //
    //         setTimeout(() => {
    //             alert(messages[category]);
    //             if (category === 'suspicious' || category === 'dangerous') {
    //                 navigation?.navigate('이상탐지');
    //             }
    //         }, 300);
    //
    //     } catch (error) {
    //         console.error('신고 실패:', error);
    //         alert('신고 처리 중 오류가 발생했습니다.');
    //     }
    // };
    // ============================================================
    const handleCategorySelect = (category) => {
        if (!selectedTransaction) return;

        // 현재는 로컬에서만 처리 (백엔드 연결 시 위의 예시 코드로 교체)
        setAnomalyCategoryModalVisible(false);
        setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));

        const messages = {
            safe: ' 안전한 거래로 표시되었습니다.',
            suspicious: ' 의심 거래로 표시되었습니다.\n이상탐지 탭에서 확인할 수 있습니다.',
            dangerous: ' 위험 거래로 표시되었습니다.\n고객센터로 자동 신고되었습니다.'
        };

        setTimeout(() => {
            alert(messages[category]);
            if (category === 'suspicious' || category === 'dangerous') {
                navigation?.navigate('이상탐지');
            }
        }, 300);
    };

    const handleSaveNote = () => {
        if (selectedTransaction) {
            setTransactions(prev => prev.map(t =>
                t.id === selectedTransaction.id ? { ...t, notes: editedNote } : t
            ));
            setSelectedTransaction({ ...selectedTransaction, notes: editedNote });
            setIsEditingNote(false);
            alert(' 메모가 저장되었습니다.');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles(colors).transactionCard} onPress={() => handleTransactionClick(item)} activeOpacity={0.7}>
            <View style={styles(colors).transactionHeader}>
                <View style={styles(colors).merchantInfo}>
                    <Text style={styles(colors).merchant}>{item.merchant}</Text>
                    <Text style={styles(colors).cardTypeBadge(item.cardType)}>{item.cardType}</Text>
                </View>
                <Text style={styles(colors).amount}>{formatCurrency(item.amount)}</Text>
            </View>
            <View style={styles(colors).transactionDetails}>
                <Text style={styles(colors).category}>{item.category}</Text>
                <Text style={styles(colors).date}>{item.date}</Text>
            </View>
            {item.notes && <Text style={styles(colors).notes}>{item.notes}</Text>}
            <Text style={styles(colors).clickHint}>탭하여 상세 정보 보기</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).header}>
                <Text style={styles(colors).title}>💳 거래내역</Text>
                <Text style={styles(colors).subtitle}>
                    {searchQuery ? `검색 결과 ${filteredTransactions.length}건` : `총 ${transactions.length}건`}
                </Text>
            </View>

            {/* Search Bar */}
            <View style={styles(colors).searchContainer}>
                <Text style={styles(colors).searchIcon}></Text>
                <TextInput
                    style={styles(colors).searchInput}
                    placeholder="가맹점, 카테고리, 메모로 검색..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles(colors).clearButton}>
                        <Text style={styles(colors).clearIcon}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {filteredTransactions.length === 0 ? (
                <EmptyState
                    {...(searchQuery ? EMPTY_MESSAGES.NO_SEARCH_RESULTS : EMPTY_MESSAGES.NO_TRANSACTIONS)}
                    actionText={searchQuery ? "검색 초기화" : undefined}
                    onAction={searchQuery ? () => setSearchQuery('') : undefined}
                />
            ) : (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles(colors).list}
                />
            )}

            {/* Transaction Detail Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).modalContent}>
                        <Text style={styles(colors).modalTitle}>💳 거래 상세</Text>

                        {selectedTransaction && (
                            <>
                                <View style={styles(colors).modalHeader}>
                                    <Text style={styles(colors).modalMerchant}>{selectedTransaction.merchant}</Text>
                                    <Text style={styles(colors).modalBusinessName}>({selectedTransaction.businessName})</Text>
                                </View>

                                <View style={styles(colors).detailSection}>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>거래일시</Text>
                                        <Text style={styles(colors).detailValue}>{selectedTransaction.date}</Text>
                                    </View>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>거래구분</Text>
                                        <Text style={styles(colors).detailValue}>{selectedTransaction.cardType}카드</Text>
                                    </View>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>카테고리</Text>
                                        <Text style={styles(colors).detailValue}>{selectedTransaction.category}</Text>
                                    </View>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>거래금액</Text>
                                        <Text style={styles(colors).detailValueAmount}>-{formatCurrency(selectedTransaction.amount, false)} 원</Text>
                                    </View>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>
                                            {selectedTransaction.cardType === '체크' ? '거래후잔액' : '결제액누계'}
                                        </Text>
                                        <Text style={styles(colors).detailValueBalance}>
                                            {selectedTransaction.cardType === '체크'
                                                ? formatCurrency(selectedTransaction.balance, false)
                                                : formatCurrency(selectedTransaction.accumulated, false)} 원
                                        </Text>
                                    </View>
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>추가메모</Text>
                                        {isEditingNote ? (
                                            <View style={styles(colors).noteEditContainer}>
                                                <TextInput
                                                    style={styles(colors).noteInput}
                                                    value={editedNote}
                                                    onChangeText={setEditedNote}
                                                    placeholder="메모를 입력하세요"
                                                    placeholderTextColor={colors.textSecondary}
                                                    autoFocus
                                                />
                                                <TouchableOpacity style={styles(colors).noteSaveButton} onPress={handleSaveNote}>
                                                    <Text style={styles(colors).noteSaveText}>저장</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity onPress={() => setIsEditingNote(true)} style={styles(colors).noteClickable}>
                                                <Text style={styles(colors).detailValue}>
                                                    {selectedTransaction.notes || '(메모 없음)'}
                                                </Text>
                                                <Text style={styles(colors).noteEditHint}></Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}> 의심되는 거래인가요?</Text>
                                    <Text style={styles(colors).modalText}>이 거래가 의심스럽다면 "이상거래로 표시"를 눌러주세요.</Text>
                                </View>
                            </>
                        )}

                        <View style={styles(colors).modalButtons}>
                            <TouchableOpacity style={styles(colors).modalButtonCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles(colors).modalButtonTextCancel}>닫기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(colors).modalButtonAnomaly} onPress={handleMarkAsAnomaly}>
                                <Text style={styles(colors).modalButtonText}> 이상거래 신고</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Anomaly Category Selection Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={anomalyCategoryModalVisible}
                onRequestClose={() => setAnomalyCategoryModalVisible(false)}>
                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).categoryModalContent}>
                        <Text style={styles(colors).modalTitle}> 이상거래 분류</Text>

                        {selectedTransaction && (
                            <View style={styles(colors).categoryTransactionInfo}>
                                <Text style={styles(colors).categoryTransactionName}>
                                    {selectedTransaction.merchant}
                                </Text>
                                <Text style={styles(colors).categoryTransactionAmount}>
                                    {formatCurrency(selectedTransaction.amount)}
                                </Text>
                            </View>
                        )}

                        <View style={styles(colors).categoryOptions}>
                            <TouchableOpacity
                                style={[styles(colors).categoryOption, styles(colors).categoryOptionSafe]}
                                onPress={() => handleCategorySelect('safe')}>
                                <Text style={styles(colors).categoryOptionIcon}></Text>
                                <View style={styles(colors).categoryOptionContent}>
                                    <Text style={styles(colors).categoryOptionTitle}>안전</Text>
                                    <Text style={styles(colors).categoryOptionDesc}>
                                        본인이 직접 사용한 거래입니다
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles(colors).categoryOption, styles(colors).categoryOptionSuspicious]}
                                onPress={() => handleCategorySelect('suspicious')}>
                                <Text style={styles(colors).categoryOptionIcon}></Text>
                                <View style={styles(colors).categoryOptionContent}>
                                    <Text style={styles(colors).categoryOptionTitle}>의심</Text>
                                    <Text style={styles(colors).categoryOptionDesc}>
                                        확실하지 않지만 의심스러운 거래입니다
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles(colors).categoryOption, styles(colors).categoryOptionDangerous]}
                                onPress={() => handleCategorySelect('dangerous')}>
                                <Text style={styles(colors).categoryOptionIcon}></Text>
                                <View style={styles(colors).categoryOptionContent}>
                                    <Text style={styles(colors).categoryOptionTitle}>위험</Text>
                                    <Text style={styles(colors).categoryOptionDesc}>
                                        명백한 사기 또는 도용 거래입니다
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles(colors).reportButton}
                            onPress={() => {
                                setAnomalyCategoryModalVisible(false);
                                setTimeout(() => {
                                    alert('🚨 신고 접수 완료\n\n고객센터에서 24시간 내 연락드리겠습니다.\n필요시 카드 정지 조치가 진행됩니다.');
                                }, 300);
                            }}>
                            <Text style={styles(colors).reportButtonText}>🚨 고객센터에 신고하기</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles(colors).categoryModalCancel}
                            onPress={() => setAnomalyCategoryModalVisible(false)}>
                            <Text style={styles(colors).categoryModalCancelText}>취소</Text>
                        </TouchableOpacity>
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
    transactionCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    merchantInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    merchant: { fontSize: 16, fontWeight: 'bold', color: colors.text },
    cardTypeBadge: (type) => ({
        fontSize: 11,
        color: type === '신용' ? colors.warning : colors.success,
        backgroundColor: (type === '신용' ? colors.warning : colors.success) + '20',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontWeight: 'bold',
    }),
    amount: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
    transactionDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    category: { fontSize: 14, color: colors.textSecondary },
    date: { fontSize: 12, color: colors.textSecondary },
    notes: { fontSize: 12, color: colors.text, marginTop: 4, fontStyle: 'italic' },
    clickHint: { fontSize: 11, color: colors.primary, marginTop: 8, opacity: 0.8 },

    // Search styles
    searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    searchIcon: { fontSize: 20, marginRight: 12 },
    searchInput: { flex: 1, fontSize: 16, color: colors.text, padding: 0 },
    clearButton: { padding: 8 },
    clearIcon: { fontSize: 18, color: colors.textSecondary },

    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: colors.cardBackground, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, borderWidth: 1, borderColor: colors.border },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' },
    modalHeader: { alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    modalMerchant: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    modalBusinessName: { fontSize: 13, color: colors.textSecondary },

    detailSection: { marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border + '40' },
    detailLabel: { fontSize: 14, color: colors.textSecondary, flex: 0.4 },
    detailValue: { fontSize: 14, color: colors.text, flex: 0.6, textAlign: 'right' },
    detailValueAmount: { fontSize: 16, fontWeight: 'bold', color: colors.error, flex: 0.6, textAlign: 'right' },
    detailValueBalance: { fontSize: 16, fontWeight: 'bold', color: colors.text, flex: 0.6, textAlign: 'right' },

    noteClickable: { flex: 0.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
    noteEditHint: { fontSize: 14, opacity: 0.5 },
    noteEditContainer: { flex: 0.6, flexDirection: 'row', gap: 8, alignItems: 'center' },
    noteInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 8, fontSize: 14, color: colors.text, backgroundColor: colors.background },
    noteSaveButton: { backgroundColor: colors.success, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    noteSaveText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

    modalSection: { marginBottom: 16 },
    modalSectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.warning, marginBottom: 8 },
    modalText: { fontSize: 14, color: colors.text, lineHeight: 20 },
    modalButtons: { flexDirection: 'row', gap: 8, marginTop: 8 },
    modalButtonCancel: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    modalButtonAnomaly: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: colors.warning },
    modalButtonTextCancel: { color: colors.text, textAlign: 'center', fontWeight: 'bold', fontSize: 14 },
    modalButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 14 },

    // Category Modal styles
    categoryModalContent: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 500,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryModalSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    categoryTransactionInfo: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 12,
        marginBottom: 20,
    },
    categoryTransactionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    categoryTransactionAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.error,
    },
    categoryOptions: {
        gap: 12,
        marginBottom: 20,
    },
    categoryOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
    },
    categoryOptionSafe: {
        borderColor: colors.success,
        backgroundColor: colors.success + '10',
    },
    categoryOptionSuspicious: {
        borderColor: colors.warning,
        backgroundColor: colors.warning + '10',
    },
    categoryOptionDangerous: {
        borderColor: colors.error,
        backgroundColor: colors.error + '10',
    },
    categoryOptionIcon: {
        fontSize: 32,
        marginRight: 16,
    },
    categoryOptionContent: {
        flex: 1,
    },
    categoryOptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    categoryOptionDesc: {
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 18,
    },
    reportButton: {
        backgroundColor: colors.error,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    reportButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryModalCancel: {
        padding: 14,
        borderRadius: 12,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    categoryModalCancelText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
