import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
// 🛠 [유효성 검사 도구들]
// 이름, 이메일, 비밀번호가 규칙에 맞는지 검사해주는 함수들을 따로 파일로 만들어두고 가져옵니다.
// 이렇게 하면 코드가 훨씬 깔끔해집니다.
import { isValidEmail, isValidName, validatePassword, isEmpty } from '../utils/validation';

export default function SignupScreen({ navigation }) {
    const { colors } = useTheme();
    const { signup } = useAuth(); // 회원가입 기능 가져오기

    /**
     * [State 관리]
     * 입력받아야 할 정보가 많아서 변수도 많습니다.
     * 1. name, email, password: 서버로 보낼 핵심 정보
     * 2. confirmPassword: 비밀번호 오타 방지용 확인란
     * 3. loading: 가입 처리 중인지 여부
     * 4. show...: 비밀번호를 눈으로 볼지 말지 결정하는 토글
     */
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /**
     * [회원가입 버튼 클릭 시 실행]
     * 여기가 제일 중요합니다! "문지기" 역할을 하는 곳이죠.
     * 이상한 데이터를 들고 서버로 가려고 하면 "멈춰!" 하고 돌려보냅니다.
     */
    const handleSignup = async () => {
        // 1. [빈칸 검사] 하나라도 안 채운 게 있는지 확인
        if (isEmpty(name) || isEmpty(email) || isEmpty(password) || isEmpty(confirmPassword)) {
            alert('⚠️ 모든 필드를 입력해주세요.');
            return; // 여기서 함수 강제 종료 (서버로 요청 안 보냄)
        }

        // 2. [이름 검사] 너무 짧거나 특수문자가 있는지 확인
        if (!isValidName(name)) {
            alert('⚠️ 올바른 이름을 입력해주세요. (한글 또는 영문 2자 이상)');
            return;
        }

        // 3. [이메일 검사] @가 있는지, .com으로 끝나는지 등 확인
        if (!isValidEmail(email)) {
            alert('⚠️ 올바른 이메일 형식을 입력해주세요.');
            return;
        }

        // 4. [비밀번호 일치 검사] 비밀번호와 비밀번호 확인란이 똑같은지 확인
        if (password !== confirmPassword) {
            alert('⚠️ 비밀번호가 일치하지 않습니다.');
            return;
        }

        // 5. [비밀번호 강력함 검사]
        // validatePassword 함수는 단순히 true/false만 주는 게 아니라,
        // 왜 틀렸는지(errors)도 알려주는 똑똑한 함수입니다.
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            // 에러 목록을 줄바꿈(\n)으로 합쳐서 보여줍니다.
            alert('⚠️ 비밀번호 요구사항:\n' + passwordValidation.errors.join('\n'));
            return;
        }

        // --- 🚧 여기까지 통과했으면 모든 검사 합격! ---

        // 6. 로딩 시작 (사용자가 버튼 두 번 못 누르게)
        setLoading(true);

        // 7. 서버에 회원가입 요청 보내기 (비동기)
        const result = await signup(name, email, password);

        // 8. 로딩 끝
        setLoading(false);

        // 9. 결과 처리
        if (!result.success) {
            // "이미 가입된 이메일입니다" 같은 서버 에러 메시지를 띄워줍니다.
            alert('❌ ' + result.error);
        }
        // 성공하면 AuthContext가 알아서 메인 화면으로 보내주니 여기선 할 게 없습니다.
    };

    return (
        // 키보드가 화면 가리지 않게 해주는 보호막
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles(colors).container}>

            <ScrollView contentContainerStyle={styles(colors).scrollContent}>
                <View style={styles(colors).content}>

                    {/* 로고 섹션 */}
                    <View style={styles(colors).logoSection}>
                        <Text style={styles(colors).logo}>☕</Text>
                        <Text style={styles(colors).appName}>Caffeine</Text>
                        <Text style={styles(colors).tagline}>새로운 계정 만들기</Text>
                    </View>

                    {/* 입력 폼 섹션 */}
                    <View style={styles(colors).formSection}>
                        <Text style={styles(colors).welcomeText}>회원가입</Text>
                        <Text style={styles(colors).subText}>정보를 입력하여 계정을 만드세요</Text>

                        {/* 1. 이름 입력 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>이름</Text>
                            <TextInput
                                style={styles(colors).input}
                                placeholder="홍길동"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words" // 이름이니까 첫 글자는 대문자로 (영어일 경우)
                            />
                        </View>

                        {/* 2. 이메일 입력 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>이메일</Text>
                            <TextInput
                                style={styles(colors).input}
                                placeholder="example@caffeine.com"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address" // 키보드에 '@' 키 나오게 하기
                                autoCapitalize="none" // 이메일은 대문자 자동변환 끄기 (중요!)
                                autoCorrect={false}   // 자동완성 끄기
                            />
                        </View>

                        {/* 3. 비밀번호 입력 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>비밀번호</Text>
                            <View style={styles(colors).passwordContainer}>
                                <TextInput
                                    style={styles(colors).passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword} // 비밀번호 가리기
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles(colors).eyeButton}>
                                    <Text style={styles(colors).eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>
                            {/* 사용자에게 비밀번호 규칙 알려주는 힌트 텍스트 */}
                            <Text style={styles(colors).hint}>최소 8자, 대소문자 및 숫자 포함</Text>
                        </View>

                        {/* 4. 비밀번호 확인 입력 */}
                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>비밀번호 확인</Text>
                            <View style={styles(colors).passwordContainer}>
                                <TextInput
                                    style={styles(colors).passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textSecondary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword} // 여기도 가리기 기능 필요
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles(colors).eyeButton}>
                                    <Text style={styles(colors).eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 가입 버튼 */}
                        <TouchableOpacity
                            style={styles(colors).signupButton}
                            onPress={handleSignup}
                            disabled={loading}> {/* 로딩 중엔 버튼 비활성화 */}
                            <Text style={styles(colors).signupButtonText}>
                                {loading ? '가입 중...' : '회원가입'}
                            </Text>
                        </TouchableOpacity>

                        {/* 로그인 화면으로 돌아가기 링크 */}
                        <View style={styles(colors).loginSection}>
                            <Text style={styles(colors).loginText}>이미 계정이 있으신가요? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles(colors).loginLink}>로그인</Text>
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
    scrollContent: { flexGrow: 1 },
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
    hint: { fontSize: 12, color: colors.textSecondary, marginTop: 4 }, // 비밀번호 힌트 스타일
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
        flex: 1,
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

    signupButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24
    },
    signupButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },

    loginSection: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    loginText: { fontSize: 14, color: colors.text },
    loginLink: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
});