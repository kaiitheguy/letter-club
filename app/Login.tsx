import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { useAuth } from '../hooks/useAuth';

// 创建动画组件
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Login() {
  const { signIn, signUp, sendMagicLink, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  // 按钮动画值
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // 按钮动画效果
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    await signIn(email, password);
  };

  const handleSignUp = async () => {
    await signUp(signUpEmail, signUpPassword);
  };

  const handleMagicLink = async () => {
    await sendMagicLink(email);
  };

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  // 自定义 Toast 配置
  const toastConfig = {
    success: ({ text1, text2 }: { text1: string, text2?: string }) => (
      <View style={styles.toastSuccess}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    ),
    error: ({ text1, text2 }: { text1: string, text2?: string }) => (
      <View style={styles.toastError}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    ),
    warning: ({ text1, text2 }: { text1: string, text2?: string }) => (
      <View style={styles.toastWarning}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    ),
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {showSignUp ? '创建新账号' : '欢迎回来'}
          </Text>
          <Text style={styles.subtitle}>
            {showSignUp ? '填写信息完成注册' : '请登录您的账号'}
          </Text>

          {!showSignUp ? (
            // 登录表单
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="邮箱地址"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              
              <TextInput
                style={styles.input}
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <AnimatedTouchable 
                style={[
                  styles.button, 
                  { transform: [{ scale: buttonScale }] }
                ]}
                onPress={handleLogin}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? '登录中...' : '登录'}
                </Text>
              </AnimatedTouchable>

              <TouchableOpacity 
                style={styles.linkButton}
                onPress={handleMagicLink}
                disabled={isLoading}
              >
                <Text style={styles.linkButtonText}>使用邮箱链接登录</Text>
              </TouchableOpacity>
              
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>或者</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <AnimatedTouchable
                style={[
                  styles.secondaryButton,
                  { transform: [{ scale: buttonScale }] }
                ]}
                onPress={toggleSignUp}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                <Text style={styles.secondaryButtonText}>注册新账号</Text>
              </AnimatedTouchable>
            </View>
          ) : (
            // 注册表单
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="邮箱地址"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              
              <TextInput
                style={styles.input}
                placeholder="密码 (至少6位字符)"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <AnimatedTouchable 
                style={[
                  styles.button,
                  { transform: [{ scale: buttonScale }] }
                ]}
                onPress={handleSignUp}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? '注册中...' : '注册账号'}
                </Text>
              </AnimatedTouchable>
              
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={toggleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.linkButtonText}>返回登录</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig as ToastConfig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4e9', // 米白色背景
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontFamily: Platform.select({
      ios: 'Avenir-Medium',
      android: 'sans-serif-medium',
      default: 'Segoe UI, sans-serif'
    }),
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    fontFamily: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'Segoe UI, sans-serif'
    }),
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0ddd5',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'Segoe UI, sans-serif'
    }),
  },
  button: {
    backgroundColor: '#6c7a89',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Avenir-Medium',
      android: 'sans-serif-medium',
      default: 'Segoe UI, sans-serif'
    }),
  },
  secondaryButton: {
    backgroundColor: '#68a690', // 柔和绿色
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Avenir-Medium',
      android: 'sans-serif-medium',
      default: 'Segoe UI, sans-serif'
    }),
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  linkButtonText: {
    color: '#6c7a89',
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'Segoe UI, sans-serif'
    }),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontFamily: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif-light',
      default: 'Segoe UI, sans-serif'
    }),
    paddingHorizontal: 10,
    color: '#a0aec0',
    fontSize: 14,
  },
  // 自定义 Toast 样式
  toastSuccess: {
    backgroundColor: '#e6f4ea',
    borderLeftColor: '#68a690',
    borderLeftWidth: 5,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastError: {
    backgroundColor: '#fbe8e8',
    borderLeftColor: '#e57373',
    borderLeftWidth: 5,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastWarning: {
    backgroundColor: '#fff8e1',
    borderLeftColor: '#ffca28',
    borderLeftWidth: 5,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toastTitle: {
    fontFamily: Platform.select({
      ios: 'Avenir-Medium',
      android: 'sans-serif-medium',
      default: 'Segoe UI, sans-serif'
    }),
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 4,
  },
  toastMessage: {
    fontFamily: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'Segoe UI, sans-serif'
    }),
    fontSize: 14,
    color: '#718096',
  },
});
