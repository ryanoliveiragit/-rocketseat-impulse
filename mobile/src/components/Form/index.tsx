import React, {useState} from 'react';
import { View, TextInput,Image, Text, TouchableOpacity } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import { ArrowLeft } from 'phosphor-react-native';
import { styles } from './styles';
import { theme } from '../../theme';
import { FeedbackType } from '../../components/Widget';
import { ScreenshotButton } from '../../components/ScreenshotButton';
import { Button } from '../../components/Button';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { api } from '../../libs/api';
import * as FileSystem from 'expo-file-system';

interface Props {
    feedbackType: FeedbackType;
    onFeedbackCanceled: () => void;
    onFeedbackSend: () => void;
}

export function Form({ feedbackType, onFeedbackCanceled, onFeedbackSend }: Props) {
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const feedbackTypeInfo = feedbackTypes[feedbackType];

    const [comment, setComment ] = useState('');

    function handleScreenshot(){
        captureScreen({
            format: 'jpg',
            quality: 0.8,
        })
        .then(uri => setScreenshot(uri))
        .catch(error => console.log(error));
    }

    function handleScreenshotRemove(){
      setScreenshot(null);  
    }

    async function handleSendFeedback(){
        if(isSendingFeedback){
        return;
        }

        setIsSendingFeedback(true);
        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {encoding: 'base64'});

        try{
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: `data:image/png;base64, ${screenshotBase64}`,
                comment
            });

            onFeedbackSend();

        } catch (error) {
            console.log(error);
            setIsSendingFeedback(false);
        }
    }


  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onFeedbackCanceled}>

                <ArrowLeft
                size={24}
                weight="bold"
                color={theme.colors.text_secondary}
                />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Image
                source={feedbackTypeInfo.image}
                style={styles.image}
                />
                <Text style={styles.titleText}>
                {feedbackTypeInfo.title}
                </Text>
            </View>
        </View>

        <TextInput
        onChangeText={setComment}
        multiline
        style={styles.input}
        placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...'
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        />
        <View style={styles.footer}>
            <ScreenshotButton 
            onTakeShot={handleScreenshot}
            onRemoveShot = {handleScreenshotRemove}
            screenshot= {screenshot}
            />
            <Button 
            onPress={handleSendFeedback}
            isLoading={isSendingFeedback}
            />
        </View>

    </View>
  );
}