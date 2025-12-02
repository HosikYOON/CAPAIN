import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * 검색바 공통 컴포넌트
 * Transaction, Coupon 화면에서 재사용
 */
export default function SearchBar({
    value,
    onChangeText,
    placeholder = '검색...',
    icon = '🔍',
    onClear
}) {
    const { colors } = useTheme();

    const handleClear = () => {
        if (onClear) {
            onClear();
        } else {
            onChangeText('');
        }
    };

    return (
        <View style={styles(colors).container}>
            <Text style={styles(colors).icon}>{icon}</Text>
            <TextInput
                style={styles(colors).input}
                placeholder={placeholder}
                placeholderTextColor={colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
            />
            {value !== '' && (
                <TouchableOpacity
                    style={styles(colors).clearButton}
                    onPress={handleClear}>
                    <Text style={styles(colors).clearIcon}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = (colors) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBackground,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    icon: {
        fontSize: 18,
        marginRight: 10
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
        padding: 0
    },
    clearButton: {
        padding: 8
    },
    clearIcon: {
        fontSize: 18,
        color: colors.textSecondary
    }
});
