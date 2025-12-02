import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * 상태 배지 공통 컴포넌트
 * Coupon, Transaction, Anomaly 화면에서 재사용
 */
export default function StatusBadge({
    status,
    text,
    type = 'default'
}) {
    const { colors } = useTheme();

    const getStatusStyle = () => {
        switch (type) {
            case 'success':
            case 'available':
                return styles(colors).success;
            case 'warning':
            case 'expiring':
                return styles(colors).warning;
            case 'danger':
            case 'expired':
            case 'flagged':
                return styles(colors).danger;
            case 'info':
            case 'used':
                return styles(colors).info;
            default:
                return styles(colors).default;
        }
    };

    const getTextStyle = () => {
        switch (type) {
            case 'warning':
            case 'expiring':
                return styles(colors).textWarning;
            default:
                return styles(colors).text;
        }
    };

    return (
        <View style={[styles(colors).badge, getStatusStyle()]}>
            <Text style={[styles(colors).text, getTextStyle()]}>
                {text}
            </Text>
        </View>
    );
}

const styles = (colors) => StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    success: {
        backgroundColor: '#28a745'
    },
    warning: {
        backgroundColor: '#ffc107'
    },
    danger: {
        backgroundColor: '#dc3545'
    },
    info: {
        backgroundColor: '#6c757d'
    },
    default: {
        backgroundColor: colors.primary
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    textWarning: {
        color: '#000'
    }
});
