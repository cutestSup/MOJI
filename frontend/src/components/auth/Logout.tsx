
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';

const Logout = () => {

  const {signOut} = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
        await signOut();
        navigate("/signin");
    } catch (error) {
        console.error('Error during logout:', error);
    }
  };


  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  )
}

export default Logout