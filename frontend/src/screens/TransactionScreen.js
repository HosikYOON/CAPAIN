import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/currency';
import { EMPTY_MESSAGES } from '../constants';

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
        if (selectedTransaction) {
            setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
            setModalVisible(false);
            setTimeout(() => {
                alert('⚠️ 이상거래로 표시되었습니다.\n이상탐지 탭에서 확인할 수 있습니다.');
                navigation?.navigate('이상탐지');
            }, 300);
        }
    };

    const handleSaveNote = () => {
        if (selectedTransaction) {
            setTransactions(prev => prev.map(t =>
                t.id === selectedTransaction.id ? { ...t, notes: editedNote } : t
            ));
            setSelectedTransaction({ ...selectedTransaction, notes: editedNote });
            setIsEditingNote(false);
            alert('✅ 메모가 저장되었습니다.');
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
                <Text style={styles(colors).searchIcon}>🔍</Text>
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
                                                <Text style={styles(colors).noteEditHint}>✏️</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}>⚠️ 의심되는 거래인가요?</Text>
                                    <Text style={styles(colors).modalText}>이 거래가 의심스럽다면 "이상거래로 표시"를 눌러주세요.</Text>
                                </View>
                            </>
                        )}

                        <View style={styles(colors).modalButtons}>
                            <TouchableOpacity style={styles(colors).modalButtonCancel} onPress={() => setModalVisible(false)}>
                                <Text style={styles(colors).modalButtonTextCancel}>닫기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(colors).modalButtonAnomaly} onPress={handleMarkAsAnomaly}>
                                <Text style={styles(colors).modalButtonText}>⚠️ 이상거래로 표시</Text>
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
});
