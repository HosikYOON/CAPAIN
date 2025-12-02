import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail, isEmpty } from '../utils/validation';

export default function LoginScreen({ navigation }) {
    const { colors } = useTheme();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        // Validation
        if (isEmpty(email) || isEmpty(password)) {
            alert(' 이메일과 비밀번호를 입력해주세요.');
            return;
        }

        if (!isValidEmail(email)) {
            alert(' 올바른 이메일 형식을 입력해주세요.');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            alert(' ' + result.error);
        }
        // 성공 시 자동으로 메인 화면으로 이동 (AuthContext에서 처리)
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles(colors).container}>
            <ScrollView contentContainerStyle={styles(colors).scrollContent}>
                <View style={styles(colors).content}>
                    {/* Logo Section */}
                    <View style={styles(colors).logoSection}>
                        <Text style={styles(colors).logo}></Text>
                        <Text style={styles(colors).appName}>Caffeine</Text>
                        <Text style={styles(colors).tagline}>스마트한 소비 관리</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles(colors).formSection}>
                        <Text style={styles(colors).welcomeText}>로그인</Text>
                        <Text style={styles(colors).subText}>계정에 로그인하여 시작하세요</Text>

                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>이메일</Text>
                            <TextInput
                                style={styles(colors).input}
                                placeholder="example@caffeine.com"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles(colors).inputContainer}>
                            <Text style={styles(colors).label}>비밀번호</Text>
                            <View style={styles(colors).passwordContainer}>
                                <TextInput
                                    style={styles(colors).passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor={colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles(colors).eyeButton}>
                                    <Text style={styles(colors).eyeIcon}>{showPassword ? '' : ''}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <Text style={styles(colors).forgotPassword}>비밀번호를 잊으셨나요?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles(colors).loginButton}
                            onPress={handleLogin}
                            disabled={loading}>
                            <Text style={styles(colors).loginButtonText}>
                                {loading ? '로그인 중...' : '로그인'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles(colors).divider}>
                            <View style={styles(colors).dividerLine} />
                            <Text style={styles(colors).dividerText}>또는</Text>
                            <View style={styles(colors).dividerLine} />
                        </View>

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
