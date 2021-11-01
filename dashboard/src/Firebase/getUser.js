import { getAuth, onAuthStateChanged } from 'firebase/auth';

const getUser = async () => {
  const User = await new Promise((resolve, reject) => {
    try {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
  return User;
};
export default getUser;
