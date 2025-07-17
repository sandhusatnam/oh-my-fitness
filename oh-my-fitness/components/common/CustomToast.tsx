import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export interface CustomToastProps {
    text1: string;
    text2?: string;
    type: 'success' | 'error' | 'info';
}

export const CustomToast: React.FC<CustomToastProps> = ({ text1, text2, type }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: type === 'error' ? '#ff4d4f' : type === 'success' ? '#52c41a' : '#1890ff',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginHorizontal: 8,
        marginTop: 0,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        minHeight: 56,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
        {text2 ? (
          <Text style={{ color: '#fff', marginTop: 4 }}>{text2}</Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => Toast.hide()}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 22, marginLeft: 16 }}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CustomToast;