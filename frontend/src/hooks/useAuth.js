import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return { isAuthenticated: !!userInfo, user: userInfo };
};