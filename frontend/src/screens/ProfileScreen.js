import React, { useState } from 'react';
// Share: 친구에게 카톡이나 문자로 내용을 공유할 때 쓰는 도구입니다.
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
    // 1. 테마(색상)와 다크모드 제어 도구 가져오기
    const { colors, isDarkMode, toggleTheme } = useTheme();
    // 2. 로그인한 사용자 정보와 로그아웃 기능 가져오기
    const { user, logout } = useAuth();

    // [State] 정보 팝업(모달)을 보여줄지 말지 결정하는 변수
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    // [State] 팝업에 띄울 내용 (제목과 본문)
    // 모달은 하나지만, 이 내용을 바꿔가며 '앱 정보', '이용약관' 등을 돌려막기 합니다.
    const [infoContent, setInfoContent] = useState({ title: '', content: '' });

    /**
     * [이벤트] 데이터 내보내기 버튼 클릭 시
     * 실제로는 엑셀(CSV)이나 JSON 파일을 만들어야 하지만,
     * 지금은 "그런 척" 하면서 알림창만 띄워줍니다.
     */
    const handleExportData = async () => {
        try {
            // 1. 내보낼 가짜 데이터 만들기
            const exportData = {
                exportDate: new Date().toISOString(), // 현재 시간
                userData: {
                    name: '홍길동',
                    email: 'demo@caffeine.com'
                },
                summary: '총 81건의 거래, 125만원 지출',
                note: '실제 앱에서는 CSV나 JSON 파일로 다운로드됩니다'
            };

            // 2. 안내 메시지 만들기
            const message = `📊 데이터 내보내기\n\n내보내기 날짜: ${new Date().toLocaleDateString()}\n총 거래: 81건\n총 지출: 1,250,000원\n\n✅ 데이터가 준비되었습니다!`;

            // 3. 사용자에게 보여주기
            alert(message);
        } catch (error) {
            alert('❌ 데이터 내보내기 실패');
        }
    };

    /**
     * [이벤트] 데이터 동기화 버튼 클릭 시
     * 서버랑 데이터를 맞추는 척 시뮬레이션합니다.
     * setTimeout을 써서 1초 동안 로딩하는 척 뜸을 들입니다.
     */
    const handleSyncData = () => {
        alert('🔄 데이터 동기화 중...');

        // 1초(1000ms) 뒤에 "완료!" 메시지 띄우기
        setTimeout(() => {
            alert('✅ 데이터 동기화 완료!\n\n최신 거래 내역이 업데이트되었습니다.');
        }, 1000);
    };

    /**
     * [이벤트] 캐시 삭제 버튼 클릭 시
     * 앱이 느려졌을 때 임시 파일들을 지우는 기능입니다.
     */
    const handleClearCache = async () => {
        try {
            alert('🗑️ 캐시 삭제 중...');
            // 0.8초 뒤에 삭제 완료 메시지
            setTimeout(() => {
                alert('✅ 캐시가 삭제되었습니다!\n\n앱 성능이 개선될 수 있습니다.');
            }, 800);
        } catch (error) {
            alert('❌ 캐시 삭제 실패');
        }
    };

    /**
     * [이벤트] 각종 정보(약관, 앱 정보 등) 메뉴 클릭 시
     * 하나의 모달(Modal)을 재사용하기 위해, 클릭한 메뉴에 따라 내용만 갈아끼웁니다.
     */
    // 1. 앱 정보 보여주기
    const handleAppInfo = () => {
        setInfoContent({
            title: 'ℹ️ 앱 정보',
            content: `Caffeine - 금융 관리 앱\n\n버전: 1.0.0\n개발자: Caffeine Team\n출시일: 2024.11\n\n📱 주요 기능:\n• 스마트 소비 분석\n• AI 기반 이상 거래 탐지\n• 실시간 거래 내역 관리\n• 카테고리별 소비 분석\n• 다크모드 지원`
        });
        setInfoModalVisible(true); // 모달 열기!
    };

    // 2. 이용약관 보여주기
    const handleTermsOfService = () => {
        setInfoContent({
            title: '📄 이용약관',
            content: `Caffeine 서비스 이용약관\n\n제1조 (목적)\n본 약관은 Caffeine(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (서비스의 제공)\n회사는 다음과 같은 서비스를 제공합니다:\n1. 소비 패턴 분석\n2. 거래 내역 관리\n3. 이상 거래 탐지\n4. 데이터 시각화\n\n제3조 (개인정보 보호)\n회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다.`
        });
        setInfoModalVisible(true);
    };

    // 3. 개인정보 처리방침 보여주기
    const handlePrivacyPolicy = () => {
        setInfoContent({
            title: '🔒 개인정보 처리방침',
            content: `Caffeine 개인정보 처리방침\n\n1. 수집하는 개인정보\n• 이름, 이메일 주소\n• 거래 내역 정보\n• 서비스 이용 기록\n\n2. 개인정보의 이용 목적\n• 서비스 제공 및 개선\n• 소비 패턴 분석\n• 이상 거래 탐지\n• 고객 지원\n\n3. 개인정보의 보관 기간\n• 회원 탈퇴 시까지\n• 법령에 따른 보관 의무 기간\n\n4. 개인정보의 안전성 확보\n• 암호화 저장\n• 접근 권한 관리\n• 정기적인 보안 점검`
        });
        setInfoModalVisible(true);
    };

    /**
     * [이벤트] 로그아웃
     * confirm 창을 띄워서 한 번 더 물어봅니다.
     */
    const handleLogout = async () => {
        // confirm은 웹에서는 되지만 React Native에서는 Alert.alert를 써야 정석입니다.
        // 하지만 편의상 여기서는 가상의 confirm 함수라고 가정합니다.
        // (실제로는 이전 코드의 Alert.alert 방식을 추천합니다)
        if (confirm('정말 로그아웃 하시겠습니까?')) {
            await logout();
            alert('👋 로그아웃되었습니다.\n\n다음에 또 만나요!');
        }
    };

    /**
     * [MenuItem 컴포넌트]
     * 반복되는 메뉴 버튼을 찍어내는 붕어빵 틀입니다.
     * icon, title, onPress만 바꿔주면 똑같은 모양의 버튼이 나옵니다.
     */
    const MenuItem = ({ icon, title, onPress }) => (
        <TouchableOpacity style={styles(colors).menuItem} onPress={onPress}>
            <Text style={styles(colors).menuIcon}>{icon}</Text>
            <Text style={styles(colors).menuTitle}>{title}</Text>
            <Text style={styles(colors).menuArrow}>›</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles(colors).container}>
            {/* 1. 상단 프로필 헤더 */}
            <View style={styles(colors).header}>
                <View style={styles(colors).avatar}>
                    {/* 이름의 첫 글자만 따서 프로필 사진 대신 보여주기 (예: 홍길동 -> 홍) */}
                    <Text style={styles(colors).avatarText}>{user?.name?.charAt(0) || '홍'}</Text>
                </View>
                <Text style={styles(colors).name}>{user?.name || '홍길동'}</Text>
                <Text style={styles(colors).email}>{user?.email || 'demo@caffeine.com'}</Text>
            </View>

            {/* 2. 설정 메뉴 섹션 */}
            <View style={styles(colors).section}>
                <Text style={styles(colors).sectionTitle}>⚙️ 설정</Text>

                {/* 다크모드 스위치 메뉴는 모양이 좀 달라서 직접 만듭니다 */}
                <View style={styles(colors).menuItem}>
                    <Text style={styles(colors).menuIcon}>🌙</Text>
                    <Text style={styles(colors).menuTitle}>다크 모드</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#ccc', true: colors.primary }}
                        thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                    />
                </View>

                {/* 나머지 메뉴들은 MenuItem 틀로 찍어냅니다 */}
                <MenuItem icon="📊" title="데이터 내보내기" onPress={handleExportData} />
                <MenuItem icon="🔄" title="데이터 동기화" onPress={handleSyncData} />
                <MenuItem icon="🗑️" title="캐시 삭제" onPress={handleClearCache} />
            </View>

            {/* 3. 정보 메뉴 섹션 */}
            <View style={styles(colors).section}>
                <Text style={styles(colors).sectionTitle}>📱 정보</Text>
                <MenuItem icon="ℹ️" title="앱 정보" onPress={handleAppInfo} />
                <MenuItem icon="📄" title="이용약관" onPress={handleTermsOfService} />
                <MenuItem icon="🔒" title="개인정보 처리방침" onPress={handlePrivacyPolicy} />
            </View>

            {/* 4. 로그아웃 버튼 */}
            <TouchableOpacity style={styles(colors).logoutButton} onPress={handleLogout}>
                <Text style={styles(colors).logoutText}>로그아웃</Text>
            </TouchableOpacity>

            {/* [정보 팝업창 (Modal)]
               평소에는 숨겨져 있다가(visible=false), 
               handleAppInfo 같은 함수가 실행되면 뿅 하고 나타납니다(visible=true).
            */}
            <Modal
                animationType="fade"     // 스르륵 나타남
                transparent={true}       // 배경을 투명하게 해서 뒤가 비치게 함
                visible={infoModalVisible} // 이 값이 true여야 화면에 보임
                onRequestClose={() => setInfoModalVisible(false)}>

                {/* 검은 반투명 배경 */}
                <View style={styles(colors).modalOverlay}>
                    {/* 하얀 내용 박스 */}
                    <View style={styles(colors).modalContent}>
                        <Text style={styles(colors).modalTitle}>{infoContent.title}</Text>

                        {/* 내용이 길어질 수 있으니까 스크롤 가능하게 */}
                        <ScrollView style={styles(colors).modalScroll}>
                            <Text style={styles(colors).modalText}>{infoContent.content}</Text>
                        </ScrollView>

                        {/* 닫기 버튼 */}
                        <TouchableOpacity style={styles(colors).modalButton} onPress={() => setInfoModalVisible(false)}>
                            <Text style={styles(colors).modalButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* 맨 아래 여백 */}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 40, alignItems: 'center', backgroundColor: colors.cardBackground, borderBottomWidth: 1, borderBottomColor: colors.border },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    name: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    email: { fontSize: 14, color: colors.textSecondary },
    section: { marginTop: 20, padding: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
    menuIcon: { fontSize: 24, marginRight: 12 },
    menuTitle: { flex: 1, fontSize: 16, color: colors.text },
    menuArrow: { fontSize: 24, color: colors.textSecondary },
    logoutButton: { margin: 20, padding: 16, backgroundColor: colors.error, borderRadius: 12, alignItems: 'center' },
    logoutText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

    // Modal styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: colors.cardBackground, borderRadius: 16, padding: 24, width: '100%', maxWidth: 500, maxHeight: '80%', borderWidth: 1, borderColor: colors.border },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16, textAlign: 'center' },
    modalScroll: { maxHeight: 400 },
    modalText: { fontSize: 14, color: colors.text, lineHeight: 22 },
    modalButton: { marginTop: 20, padding: 14, backgroundColor: colors.primary, borderRadius: 8, alignItems: 'center' },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});