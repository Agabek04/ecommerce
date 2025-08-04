import { ref } from "vue";
import api from './api'
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/authStore"

export function useAuth() {
  const error = ref(null);
  const router =useRouter()
  const auth = useAuthStore()
  const signUp = async ({ name, email, password }) => {
    error.value = null;
    try {
      await api.post("/auth/register", {
        name: name,
        email: email,
        password: password,
        role: 'admin'
      });
    } catch (err) {
      error.value = err.response?.data?.message ;
    }
  };

  const signIn = async ({email , password})=>{
    error.value = null;
    try {
      const responce=await api.post("/auth/login", {
        email: email,
        password: password
      });
      const token = responce.data.token
      auth.setToken(token)
      axios.defaults.headers.common['Authorization']=`Bearer ${token}`
      const role= responce.data.user.role
      localStorage.setItem('userRole', role)
      console.log(role)
      if(role==='admin'){
        router.push('/admin')
      }
      else{
        router.push('/')
      }
    } catch (err) {
      error.value = err.response?.data?.message ;
    }
  }

  const isLogin = (token)=>{
    if(token==='') return false
    return true
  }
  return {
    signUp,
    signIn,
    isLogin,
    error
  };
}
