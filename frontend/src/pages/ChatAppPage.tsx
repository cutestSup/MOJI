import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from 'sonner'

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user)

  const handleOnClick = async () => {
    try {
      const response = await api.get("/users/test", {withCredentials: true})
      console.log('Test request successful:', response)
      toast.success('Test request successful')
    } catch (error) {
      toast.error('Error during test request')
      console.error('Error during test request:', error)
    }
  }
  return (
    <>
      <div>
        {user?.username}
        <Logout />
        <Button onClick={handleOnClick}>Test Button</Button>
      </div>
    </>
  )
}

export default ChatAppPage