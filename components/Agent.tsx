"use client";

// Hooks
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Components
import Image from 'next/image';

// Utils
import { vapi } from '@/lib/vapi.sdk';
import { cn } from '@/lib/utils';

// Constants
import { interviewer } from '@/constants/interview';

enum CallStatusEnum {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<CallStatusEnum>(CallStatusEnum.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatusEnum.INACTIVE || callStatus === CallStatusEnum.FINISHED;

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatusEnum.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatusEnum.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.error('Error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, []);

  useEffect(() => {
    if (callStatus === CallStatusEnum.FINISHED) {
      if (type === 'generate') {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatusEnum.CONNECTING);

    if (type === 'generate') {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          userName,
          userId
        }
      });
    } else {
      let formattedQuestions = '';

      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join('\n');
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        }
      });
    }
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatusEnum.FINISHED);
    vapi.stop()
  }

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log('Generate feedback here.');

    const { success, id } = {
      success: true,
      id: 'feedback-id'
    };

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log('Error saving feedback');
      router.push('/');
    }
  }

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image className="object-cover" src="/ai-avatar.png" alt="Vapi Avatar" height={54} width={65}/>
            {isSpeaking && <span className="animate-speak"></span>}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image className="rounded-full object-cover size-[120px]" src="/user-avatar.png" alt="User Avatar" height={540} width={504}/>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')} key={latestMessage}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatusEnum.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatusEnum.CONNECTING && 'hidden')}/>
            <span>{isCallInactiveOrFinished ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
}

export default Agent;
