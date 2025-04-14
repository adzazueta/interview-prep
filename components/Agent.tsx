// Components
import Image from 'next/image';

// Utils
import { cn } from '@/lib/utils';

enum CallStatusEnum {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatusEnum.FINISHED;
  const isSpeaking = true;
  const messages = [
    'Whats your name?',
    'My name is Jhon Doe, nice to meet you!'
  ];
  const lastMessage = messages[messages.length - 1];

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
            <p className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')} key={lastMessage}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatusEnum.ACTIVE ? (
          <button className="relative btn-call">
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatusEnum.CONNECTING && 'hidden')}/>
            <span>{callStatus === CallStatusEnum.INACTIVE || callStatus === CallStatusEnum.FINISHED ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect">
            End
          </button>
        )}
      </div>
    </>
  );
}

export default Agent;
