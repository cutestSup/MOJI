import { useChatStore } from '@/stores/useChatStore.ts';
import DirrectMessageCard from './DirrectMessageCard';

const DirrectMessageList = () => {
    const { conversations } = useChatStore();

    if (!conversations) {
        return <div>Loading...</div>;
    }

    const dirrectConversations = conversations.filter(conv => conv.type === 'direct');

    return (
        <div className='flex-1 overflow-y-auto p-2 space-y-2'>
            {
                dirrectConversations.map((conv) => (
                    <DirrectMessageCard
                        key={conv._id}
                        conv = {conv}
                        />
                ))}
        </div>
    )
}

export default DirrectMessageList