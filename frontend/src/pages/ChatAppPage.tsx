import Logout from '@/components/auth/Logout'
import { useAuthStore } from '@/stores/useAuthStore'

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <>
      {user?.username}
      <div>
        <Logout />
      </div>
    </>
  )
}

export default ChatAppPage