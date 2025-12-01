/**
 * 📦 [도구 상자 가져오기]
 * 레고 블록을 조립하려면 블록이 필요하죠? 
 * 다른 파일에서 미리 만들어둔 기능이나 화면들을 가져오는 곳이에요.
 */
import React from 'react';

// 화면 이동을 도와주는 '내비게이션(지도)' 도구들이에요.
import { NavigationContainer } from '@react-navigation/native'; // 전체 지도를 감싸는 큰 가방
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // 화면 아래에 탭 버튼(메뉴)을 만드는 도구
import { createStackNavigator } from '@react-navigation/stack'; // 화면을 카드처럼 차곡차곡 쌓아서 이동하는 도구

// 휴대폰 상단 상태바(배터리, 시간 표시되는 곳)를 꾸미는 도구
import { StatusBar } from 'expo-status-bar';

// 글자(Text), 로딩 뱅글뱅글(ActivityIndicator), 박스(View) 같은 기본 부품들
import { Text, ActivityIndicator, View } from 'react-native';

// 🎨 [분위기 메이커] 앱의 색상(다크모드/라이트모드)을 관리하는 친구
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// 🔐 [문지기] 로그인했는지 안 했는지 관리하는 친구
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// 📱 [화면들] 우리가 미리 만들어둔 실제 화면 페이지들을 가져와요
import DashboardScreen from './src/screens/DashboardScreen';      // 대시보드 화면
import AnomalyDetectionScreen from './src/screens/AnomalyDetectionScreen'; // 이상탐지 화면
import TransactionScreen from './src/screens/TransactionScreen';  // 거래내역 화면
import ProfileScreen from './src/screens/ProfileScreen';          // 프로필 화면
import LoginScreen from './src/screens/LoginScreen';              // 로그인 화면
import SignupScreen from './src/screens/SignupScreen';            // 회원가입 화면

// 🛠 [도구 준비]
// 탭 메뉴 만드는 기계(Tab)와 화면 쌓는 기계(Stack)를 준비해요.
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * 🖼 [아이콘 그리기]
 * 아래쪽 탭 메뉴에 들어갈 이모지 아이콘을 그려주는 함수예요.
 * focused: 지금 이 메뉴가 선택되었나요? (선택됐으면 진하게, 아니면 흐리게)
 */
const TabBarIcon = ({ name, focused }) => {
  const icons = {
    '대시보드': '📊',
    '이상탐지': '🔍',
    '거래내역': '💳',
    '프로필': '👤'
  };
  // 선택된 탭(focused)은 투명도(opacity) 1로 진하게, 선택 안 되면 0.5로 흐리게 보여줘요.
  return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icons[name] || '📱'}</Text>;
};

/**
 * 🏠 [메인 집 내부] - 로그인 성공한 사람들만 들어오는 곳
 * 대시보드, 이상탐지 등 주요 기능이 있는 방들을 연결해요.
 */
function MainTabs() {
  // 테마 관리자한테서 현재 색상표(colors)를 받아와요.
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="대시보드" // 앱 켜면 처음에 보여줄 방은 '대시보드'
      screenOptions={({ route }) => ({
        // 탭 버튼마다 아이콘을 뭘 넣을지 결정해요
        tabBarIcon: ({ focused }) => <TabBarIcon name={route.name} focused={focused} />,

        // 색상 꾸미기 (선택된 글자색, 배경색 등)
        tabBarActiveTintColor: colors.primary,       // 선택된 탭 글자색
        tabBarInactiveTintColor: colors.textSecondary, // 선택 안 된 탭 글자색
        tabBarStyle: {
          backgroundColor: colors.cardBackground,    // 탭 배경색
          borderTopColor: colors.border,             // 탭 위쪽 테두리 색
          borderTopWidth: 1,                         // 테두리 두께
        },
        headerStyle: {
          backgroundColor: colors.cardBackground,    // 화면 위쪽 제목줄 배경색
          borderBottomColor: colors.border,          // 제목줄 아래 테두리 색
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,                // 제목 글자색
        headerTitleStyle: { fontWeight: 'bold' },    // 제목 글자 굵게
      })}>

      {/* 이제 진짜 방(화면)들을 하나씩 연결해요 */}
      <Tab.Screen name="대시보드" component={DashboardScreen} />
      <Tab.Screen name="이상탐지" component={AnomalyDetectionScreen} />
      <Tab.Screen name="거래내역" component={TransactionScreen} />
      <Tab.Screen name="프로필" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/**
 * 🚪 [현관문 밖] - 로그인 안 한 사람들이 머무는 곳
 * 로그인 화면과 회원가입 화면만 보여줘요.
 */
function AuthStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // "로그인" 같은 제목줄을 숨겨요 (깔끔하게 보이려고)
        cardStyle: { backgroundColor: colors.background } // 배경색 설정
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

/**
 * 🧠 [교통정리 경찰관]
 * 앱의 내용을 결정하는 핵심 부분이에요.
 * 1. 로딩 중인가? -> 뱅글뱅글 로딩 화면 보여줌
 * 2. 로그인 했나? -> 집 내부(MainTabs) 보여줌
 * 3. 로그인 안 했나? -> 현관문 밖(AuthStack) 보여줌
 */
function AppContent() {
  const { colors, isDarkMode } = useTheme(); // 색상 정보 가져오기
  const { user, loading } = useAuth();       // 로그인 정보 가져오기

  // 1. 아직 로그인 확인 중이라면 (로딩 중)
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        {/* 뱅글뱅글 돌아가는 로딩 표시 */}
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: colors.text }}>로딩 중...</Text>
      </View>
    );
  }

  // 2. 로딩 끝남! 이제 화면을 보여주자
  return (
    <NavigationContainer>
      {/* 상태바(배터리, 시간) 색상을 다크모드에 맞춰서 자동으로 조절 */}
      <StatusBar style={isDarkMode ? 'light' : 'auto'} />

      {/* 여기가 제일 중요! 
         user가 있으면(참이면) -> <MainTabs /> (메인 화면)
         user가 없으면(거짓이면) -> <AuthStack /> (로그인 화면)
      */}
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

/**
 * 🚀 [앱의 시작점]
 * 여기가 진짜 앱이 시작되는 곳이에요!
 * * ThemeProvider: "자, 이제부터 이 앱의 모든 곳에서 '색상 테마'를 쓸 수 있어!"
 * AuthProvider: "자, 이제부터 이 앱의 모든 곳에서 '로그인 정보'를 쓸 수 있어!"
 * * 이렇게 감싸줘야(Provider) 그 안에 있는 AppContent가 정보를 가져다 쓸 수 있어요.
 */
export default function App() {
  return (
    <ThemeProvider>   {/* 1. 테마(색상) 기능 켜기 */}
      <AuthProvider>  {/* 2. 로그인 관리 기능 켜기 */}
        <AppContent /> {/* 3. 실제 앱 내용 보여주기 */}
      </AuthProvider>
    </ThemeProvider>
  );
}