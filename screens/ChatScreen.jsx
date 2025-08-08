import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { View,Image, StyleSheet } from 'react-native';
import { auth } from '../firebase';
import { WebView } from 'react-native-webview';
import { onAuthStateChanged } from 'firebase/auth';
const GEMINI_API_KEY = 'AIzaSyA29rmo77UMZzbtZh6KFax2GmSYcpCNi-8';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [show, setshow] = useState(true);
useEffect(() => {
  const loadername=async()=>
  {

  
   const name = await AsyncStorage.getItem('userName');
         const username = name || 'User'; // fallback if name is null

    setMessages([
      {
        _id: 1,
        text: `Hi ${username}! I am an AI robot. How can I help you today?`,
        createdAt: new Date(),
        user: { _id: 2 },
      },
    ]);
  };

  loadername();
  },[]);




  const stripMarkdown = (text) => {
    return text.replace(/[*_~`>#-]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1');
  };

  const onSend = useCallback(async (newMessages = []) => {
    setshow(false);
    const userMessage = newMessages[0].text;
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    setIsTyping(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${userMessage}. Keep your answer very short and brief. Reply in 3 to 4 lines only.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const botTextRaw =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I didn’t understand that.';
      const botText = stripMarkdown(botTextRaw);

      const botMessage = {
        _id: Math.random(),
        text: botText,
        createdAt: new Date(),
        user: { _id: 2 },
      };

      setMessages((prev) => GiftedChat.append(prev, [botMessage]));
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: Math.random(),
            text: 'Something went wrong with AI Robot. Please try again.',
            createdAt: new Date(),
            user: { _id: 2 },
          },
        ])
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  return (
    <View style={styles.container}>
{show && <View style={styles.gif}>
<Image
  source={require('../assets/robot.gif')}
  style={{ width: 300, height: 300 }}
/>
</View>
}


      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        isTyping={isTyping}
        placeholder="Type your message..."
        alwaysShowSend
        scrollToBottom
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
   
  },
  gif:{
    display:"flex",

    alignItems:"center",
    marginTop:"20%",
    flex:1
  }
});

export default ChatScreen;
