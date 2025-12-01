import React, { useState } from 'react';
// KeyboardAvoidingView: 키보드가 올라왔을 때 화면이 가려지지 않게 도와주는 중요한 컴포넌트입니다.
// Platform: 지금 실행 중인 폰이 아이폰(iOS)인지 안드로이드인지 구별할 때 씁니다.
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail, isEmpty } from '../utils/validation';

export default function LoginScreen({ navigation }) {
    const { colors } = useTheme(); // 테마 색상 가져오기

    /**
     * [useAuth 훅]
     * 로그인 로직은 이 화면에서 직접 다 짜는 게 아니라,
     * AuthContext라는 '로그인 관리 본부'에서 기능을 빌려다 씁니다.
     * 이렇게 하면 로그인 화면뿐만 아니라 앱 어디서든 로그인 상태를 알 수 있습니다.
     */
    const { login } = useAuth();

    /**
     * [State 관리]
     * 사용자가 입력창에 글자를 칠 때마다 그 값을 실시간으로 저장해두는 변수들입니다.
     * 1. email, password: 사용자가 입력한 값
     * 2. loading: 로그인 버튼 누르고 서버 응답 기다리는 동안(로딩 중)인지 여부
     * 3. showPassword: 비밀번호를 '••••'로 보여줄지, '1234'로 보여줄지 결정
     */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /**
     * [로그인 버튼 클릭 시 실행되는 함수]
     * 여기가 이 화면의 핵심 로직입니다.
     * 순서: 유효성 검사 -> 로딩 시작 -> 로그인 요청 -> (성공 시 이동 / 실패 시 에러 표시)
     */
    const handleLogin = async () => {
        // 1. 유효성 검사 (Validation)
        // 서버에 보내기 전에, 입력값이 멀쩡한지 먼저 확인합니다. 
        // 빈 값을 서버에 보내면 서버가 싫어하니까요.
        if (isEmpty(email) || isEmpty(password)) {
            alert('⚠️ 이메일과 비밀번호를 입력해주세요.');
            return; // 검사 탈락하면 여기서 함수 종료!
        }

        if (!isValidEmail(email)) {
            alert('⚠️ 올바른 이메일 형식을 입력해주세요.');
            return;
        }

        // 2. 로딩 시작
        setLoading(true);

        // 3. 실제 로그인 시도 (비동기 처리)
        // login 함수는 서버와 통신해야 하므로 시간이 걸립니다.
        // 그래서 await를 써서 "결과가 올 때까지 기다려!"라고 컴퓨터에게 말해줍니다.
        const result = await login(email, password);

        // 4. 로딩 종료 (결과가 왔으니까)
        setLoading(false);

        // 5. 결과 확인
        // 로그인이 성공하면 AuthContext가 알아서 화면을 메인으로 바꿔주므로,
        // 여기서는 '실패했을 때' 에러 메시지를 띄우는 것만 처리하면 됩니다.
        if (!result.success) {
            alert('❌ ' + result.error);
        }
    };

    return (
        /**
         * [KeyboardAvoidingView]
         * 모바일 앱의 고질적인 문제: "키보드가 입력창을 가려요!"
         * 이 컴포넌트가 키보드 높이만큼 화면을 위로 밀어올려줍니다.
         * * behavior: 아이폰('padding')과 안드로이드('height')의 처리 방식이 달라서 구분해줍니다.
         */
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles(colors).container}>

            {/* ScrollView: 화면이 작거나 키보드가 올라왔을 때 스크롤 할 수 있게 해줍니다. */}
            <ScrollView contentContainerStyle={styles(colors).scrollContent}>
                <View style={styles(colors).content}>

                    {/* 로고 영역 */}
                    <View style={styles(colors).logoSection}>
                        <Text style={styles(colors).logo}>☕</Text>
                        <Text style={styles(colors).appName}>Caffeine</Text>
                        <Text style={styles(colors).tagline}>스마트한 소비 관리</Text>
                    </View>

                    {/* 입력 폼 영역 */}
                    <View style={styles(colors).formSection}>
                        <Text style={styles(colors).welcomeText}>로그인</Text>
                        <Text style={styles(colors).subText}>계정에 로그인하여 시작하세요</Text>

                        {/* 이메일 입력창 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>이메일</Text>
                            <TextInput
                                style={styles(colors).input}
                                placeholder="example@caffeine.com"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail} // 글자 칠 때마다 email 변수 업데이트
                                keyboardType="email-address" // 키보드에 '@'가 잘 보이는 타입으로 설정
                                autoCapitalize="none" // 이메일은 대문자 자동변환 끄기
                                autoCorrect={false}   // 자동완성 끄기
                            />
                        </View>

                        {/* 비밀번호 입력창 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>비밀번호</Text>
                            <View style={styles(colors).passwordContainer}>
                                <TextInput
                                    style={styles(colors).passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword} // 비밀번호 가리기 기능 (true면 ••••로 보임)
                                    autoCapitalize="none"
                                />
                                {/* 눈 모양 아이콘 버튼: 누르면 비밀번호 보였다/안보였다 토글 */}
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles(colors).eyeButton}>
                                    <Text style={styles(colors).eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <Text style={styles(colors).forgotPassword}>비밀번호를 잊으셨나요?</Text>
                        </TouchableOpacity>

                        {/* 로그인 버튼 */}
                        <TouchableOpacity
                            style={styles(colors).loginButton}
                            onPress={handleLogin} // 버튼 누르면 handleLogin 함수 실행
                            disabled={loading}>   // 로딩 중일 땐 버튼 못 누르게 막기 (중복 클릭 방지)
                            <Text style={styles(colors).loginButtonText}>
                                {loading ? '로그인 중...' : '로그인'}
                            </Text>
                        </TouchableOpacity>

                        {/* 구분선 (또는) */}
                        <View style={styles(colors).divider}>
                            <View style={styles(colors).dividerLine} />
                            <Text style={styles(colors).dividerText}>또는</Text>
                            <View style={styles(colors).dividerLine} />
                        </View>

                        {/* 회원가입 페이지 이동 링크 */}
                        <View style={styles(colors).signupSection}>
                            <Text style={styles(colors).signupText}>계정이 없으신가요? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles(colors).signupLink}>회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1 }, // 내용이 적어도 화면을 꽉 채우게 설정
    content: { flex: 1, padding: 24, justifyContent: 'center', maxWidth: 500, width: '100%', alignSelf: 'center' },

    logoSection: { alignItems: 'center', marginBottom: 48 },
    logo: { fontSize: 72, marginBottom: 16 },
    appName: { fontSize: 36, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    tagline: { fontSize: 16, color: colors.textSecondary },

    formSection: { width: '100%' },
    welcomeText: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
    subText: { fontSize: 14, color: colors.textSecondary, marginBottom: 32 },

    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
    input: {
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.text
    },
    // 비밀번호 입력창은 아이콘과 같이 있어야 해서 레이아웃이 조금 다름 (flexDirection: 'row')
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingRight: 12,
    },
    passwordInput: {
        flex: 1, // 남은 공간을 입력창이 다 차지
        padding: 16,
        fontSize: 16,
        color: colors.text
    },
    eyeButton: {
        padding: 8,
    },
    eyeIcon: {
        fontSize: 20,
    },

    forgotPassword: { fontSize: 14, color: colors.primary, textAlign: 'right', marginBottom: 24 },

    loginButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24
    },
    loginButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

    divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { marginHorizontal: 16, fontSize: 14, color: colors.textSecondary },

    signupSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    signupText: { fontSize: 14, color: colors.text },
    signupLink: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
});