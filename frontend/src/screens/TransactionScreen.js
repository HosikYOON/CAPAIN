import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import EmptyState from '../components/EmptyState'; // 검색 결과 없을 때 보여줄 화면
import { formatCurrency } from '../utils/currency';
import { EMPTY_MESSAGES } from '../constants';

/**
 * [가짜 데이터 (Mock Data)]
 * 실제 은행 서버랑 연결된 게 아니니까, 
 * 마치 내역이 있는 것처럼 가짜 데이터를 잔뜩 만들어둡니다.
 * * accumulated: 신용카드 누적 결제액
 * * balance: 체크카드 결제 후 통장 잔액
 */
const MOCK_TRANSACTIONS = [
    { id: 1, merchant: '스타벅스', businessName: '스타벅스커피코리아(주)', amount: 15000, category: '식비', date: '2024-11-29 10:00', notes: '아메리카노', cardType: '신용', accumulated: 215000 },
    { id: 2, merchant: 'GS25', businessName: 'GS리테일(주)', amount: 5000, category: '교통', date: '2024-11-28 08:30', notes: 'T-money 충전', cardType: '체크', balance: 1250000 },
    { id: 3, merchant: '올리브영', businessName: 'CJ올리브영(주)', amount: 45000, category: '쇼핑', date: '2024-11-27 14:20', notes: '화장품', cardType: '신용', accumulated: 200000 },
    // ... 데이터 생략
    { id: 8, merchant: '이마트', businessName: '신세계이마트(주)', amount: 120000, category: '쇼핑', date: '2024-11-22 17:00', notes: '식료품', cardType: '신용', accumulated: 148000 },
];

export default function TransactionScreen({ navigation }) {
    const { colors } = useTheme();

    /**
     * [State 관리]
     * 1. transactions: 전체 거래 내역 원본 데이터
     * 2. selectedTransaction: 리스트에서 클릭한 '그 거래' (상세보기용)
     * 3. modalVisible: 상세 정보 팝업창을 열지 말지 결정
     * 4. isEditingNote: 메모를 '수정 중'인지 '그냥 보는 중'인지 (true/false)
     * 5. editedNote: 수정 중인 메모 내용을 임시로 저장하는 변수
     * 6. searchQuery: 검색창에 입력한 검색어
     */
    const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [editedNote, setEditedNote] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * [검색 필터링 로직]
     * 사용자가 검색어를 입력할 때마다 리스트를 실시간으로 걸러냅니다.
     * 원본(transactions)은 건드리지 않고, 보여줄 목록(filteredTransactions)만 새로 만듭니다.
     */
    const filteredTransactions = transactions.filter(t => {
        // 검색어가 없으면? -> 전부 다 보여줘!
        if (!searchQuery) return true;

        // 대소문자 구분 없이 검색하기 위해 전부 소문자로 변환 (LowerCase)
        const query = searchQuery.toLowerCase();

        // 가맹점 이름, 카테고리, 메모, 사업자명 중에 하나라도 검색어가 포함되면 합격!
        return (
            t.merchant.toLowerCase().includes(query) ||
            t.category.toLowerCase().includes(query) ||
            t.notes?.toLowerCase().includes(query) || // 메모가 없을 수도 있으니 ?. 사용
            t.businessName.toLowerCase().includes(query)
        );
    });

    /**
     * [리스트 아이템 클릭 시]
     * 선택한 거래의 정보를 상세 팝업(Modal)으로 띄웁니다.
     */
    const handleTransactionClick = (item) => {
        setSelectedTransaction(item);    // 선택된 녀석 기억하기
        setEditedNote(item.notes || ''); // 기존 메모 내용을 수정창으로 가져오기
        setIsEditingNote(false);         // 처음엔 '보기 모드'로 시작
        setModalVisible(true);           // 팝업 열기
    };

    /**
     * [이상거래 신고 버튼 클릭 시]
     * 이 거래를 리스트에서 지우고, '이상탐지' 화면으로 보냈다고 가정합니다.
     */
    const handleMarkAsAnomaly = () => {
        if (selectedTransaction) {
            // 1. 현재 리스트에서 해당 거래 삭제 (id가 다른 것만 남기기)
            setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));

            // 2. 팝업 닫기
            setModalVisible(false);

            // 3. 안내 메시지 띄우고 화면 이동
            setTimeout(() => {
                alert('⚠️ 이상거래로 표시되었습니다.\n이상탐지 탭에서 확인할 수 있습니다.');
                navigation?.navigate('이상탐지');
            }, 300);
        }
    };

    /**
     * [메모 저장 버튼 클릭 시]
     * 수정한 메모 내용을 원본 데이터에 반영합니다 (Update).
     */
    const handleSaveNote = () => {
        if (selectedTransaction) {
            // 1. 전체 리스트(transactions)를 돌면서 수정된 녀석만 갈아끼우기 (map 함수 사용)
            setTransactions(prev => prev.map(t =>
                t.id === selectedTransaction.id ? { ...t, notes: editedNote } : t
            ));

            // 2. 현재 보고 있는 상세 정보도 업데이트
            setSelectedTransaction({ ...selectedTransaction, notes: editedNote });

            // 3. '수정 모드' 끝내고 '보기 모드'로 복귀
            setIsEditingNote(false);
            alert('✅ 메모가 저장되었습니다.');
        }
    };

    /**
     * [리스트 아이템 렌더링]
     * 거래 내역 한 줄 한 줄을 어떻게 그릴지 정의합니다.
     */
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles(colors).transactionCard} onPress={() => handleTransactionClick(item)} activeOpacity={0.7}>
            {/* 윗줄: 가맹점 이름 + 카드 종류 뱃지 + 금액 */}
            <View style={styles(colors).transactionHeader}>
                <View style={styles(colors).merchantInfo}>
                    <Text style={styles(colors).merchant}>{item.merchant}</Text>
                    {/* 카드 타입(신용/체크)에 따라 뱃지 색깔 다르게 함수로 처리 */}
                    <Text style={styles(colors).cardTypeBadge(item.cardType)}>{item.cardType}</Text>
                </View>
                <Text style={styles(colors).amount}>{formatCurrency(item.amount)}</Text>
            </View>

            {/* 아랫줄: 카테고리 + 날짜 */}
            <View style={styles(colors).transactionDetails}>
                <Text style={styles(colors).category}>{item.category}</Text>
                <Text style={styles(colors).date}>{item.date}</Text>
            </View>

            {/* 메모가 있으면 보여주고 없으면 숨김 */}
            {item.notes && <Text style={styles(colors).notes}>{item.notes}</Text>}

            <Text style={styles(colors).clickHint}>탭하여 상세 정보 보기</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles(colors).container}>
            {/* 상단 헤더 */}
            <View style={styles(colors).header}>
                <Text style={styles(colors).title}>💳 거래내역</Text>
                <Text style={styles(colors).subtitle}>
                    {/* 검색 중이면 '검색 결과 00건', 아니면 '총 00건' 표시 */}
                    {searchQuery ? `검색 결과 ${filteredTransactions.length}건` : `총 ${transactions.length}건`}
                </Text>
            </View>

            {/* [검색창 영역] */}
            <View style={styles(colors).searchContainer}>
                <Text style={styles(colors).searchIcon}>🔍</Text>
                <TextInput
                    style={styles(colors).searchInput}
                    placeholder="가맹점, 카테고리, 메모로 검색..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery} // 글자 칠 때마다 searchQuery 변수 업데이트 -> 필터링 자동 실행
                />
                {/* 검색어가 있을 때만 'X' 버튼(지우기) 보여주기 */}
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles(colors).clearButton}>
                        <Text style={styles(colors).clearIcon}>✕</Text>
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* [리스트 영역] */}
            {filteredTransactions.length === 0 ? (
                // 검색 결과가 없으면 '텅 비었어요' 화면 보여주기
                <EmptyState
                    {...(searchQuery ? EMPTY_MESSAGES.NO_SEARCH_RESULTS : EMPTY_MESSAGES.NO_TRANSACTIONS)}
                    actionText={searchQuery ? "검색 초기화" : undefined}
                    onAction={searchQuery ? () => setSearchQuery('') : undefined}
                />
            ) : (
                // 결과가 있으면 리스트 보여주기
                <FlatList
                    data={filteredTransactions} // 여기서 원본이 아니라 '필터링된 목록'을 넣는 게 핵심!
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles(colors).list}
                />
            )}

            {/* [상세 정보 팝업 (Modal)] */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>

                <View style={styles(colors).modalOverlay}>
                    <View style={styles(colors).modalContent}>
                        <Text style={styles(colors).modalTitle}>💳 거래 상세</Text>

                        {/* 선택된 거래가 있을 때만 내용 표시 */}
                        {selectedTransaction && (
                            <>
                                {/* 1. 영수증 헤더 (가맹점명) */}
                                <View style={styles(colors).modalHeader}>
                                    <Text style={styles(colors).modalMerchant}>{selectedTransaction.merchant}</Text>
                                    <Text style={styles(colors).modalBusinessName}>({selectedTransaction.businessName})</Text>
                                </View>

                                {/* 2. 상세 정보 테이블 */}
                                <View style={styles(colors).detailSection}>
                                    {/* ... 날짜, 구분, 카테고리 등 단순 정보 표시 생략 ... */}
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>거래일시</Text>
                                        <Text style={styles(colors).detailValue}>{selectedTransaction.date}</Text>
                                    </View>
                                    {/* ... */}

                                    {/* [메모 수정 기능] 여기가 중요해요! */}
                                    <View style={styles(colors).detailRow}>
                                        <Text style={styles(colors).detailLabel}>추가메모</Text>

                                        {/* isEditingNote 값에 따라 화면을 다르게 보여줍니다 (조건부 렌더링) */}
                                        {isEditingNote ? (
                                            // [수정 모드] 입력창 + 저장 버튼 보여주기
                                            <View style={styles(colors).noteEditContainer}>
                                                <TextInput
                                                    style={styles(colors).noteInput}
                                                    value={editedNote}
                                                    onChangeText={setEditedNote}
                                                    placeholder="메모를 입력하세요"
                                                    placeholderTextColor={colors.textSecondary}
                                                    autoFocus // 수정 모드 켜지자마자 키보드 올라오게
                                                />
                                                <TouchableOpacity style={styles(colors).noteSaveButton} onPress={handleSaveNote}>
                                                    <Text style={styles(colors).noteSaveText}>저장</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            // [보기 모드] 그냥 글씨 + 연필 아이콘 보여주기
                                            <TouchableOpacity onPress={() => setIsEditingNote(true)} style={styles(colors).noteClickable}>
                                                <Text style={styles(colors).detailValue}>
                                                    {selectedTransaction.notes || '(메모 없음)'}
                                                </Text>
                                                <Text style={styles(colors).noteEditHint}>✏️</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                {/* 3. 이상거래 신고 섹션 */}
                                <View style={styles(colors).modalSection}>
                                    <Text style={styles(colors).modalSectionTitle}>⚠️ 의심되는 거래인가요?</Text>
                                    <Text style={styles(colors).modalText}>이 거래가 의심스럽다면 "이상거래로 표시"를 눌러주세요.</Text>
                                </View>
                            </>
                        )}

                        {/* 4. 하단 버튼 (닫기 / 신고) */}
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
    // ... 스타일 정의는 디자인 영역이므로 생략하지만, 
    // cardTypeBadge 함수처럼 색깔을 동적으로 바꾸는 부분은 참고하세요!
    cardTypeBadge: (type) => ({
        fontSize: 11,
        // 신용이면 노란색(warning), 체크면 초록색(success)
        color: type === '신용' ? colors.warning : colors.success,
        backgroundColor: (type === '신용' ? colors.warning : colors.success) + '20', // 배경은 투명하게(+ '20')
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontWeight: 'bold',
    }),
    // ... 나머지 스타일들
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 20, backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    list: { padding: 20 },
    transactionCard: { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
    transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    merchantInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    merchant: { fontSize: 16, fontWeight: 'bold', color: colors.text },

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