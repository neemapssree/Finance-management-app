import React, { useState } from 'react'
import AxiosInstance from '../Config/AxiosInstance';
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails, setUserRole } from '../ToolKit/UserSlice';
import Spinner from './Spinner';


function LoginBox({setBoxName}) {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading,setLoading] = useState(false);

  const [loginData,setLoginData] = useState(
    {
    email:'',
    password:'',
    }
  );

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      if(loginData.email && loginData.password){
        AxiosInstance.post('/users/logIn', loginData).then((response)=>{
          if(response.data.message === 'valid credentials'){
            toast.success("Logged in successfully");
            localStorage.setItem('token',response.data.token);
            const parsedToken = parseJwt(response.data.token);
            localStorage.setItem('user',JSON.stringify(parsedToken));
            dispatch(setUserDetails(parsedToken));  //passing the user details  from parsed token to dispatch
            console.log('parsed token', parsedToken);
            navigate('/');
            setLoading(false);
          }
          if(response.data.message === 'user not found'){
            toast.warning("User not registered");
            setLoading(false);
          }
          if(response.data.message === 'invalid credentials'){
            toast.error("Incorrect password");
            setLoading(false);
          }
        })
        console.log(loginData,"LOgin Data");
      }
      else{
        toast.error("Credentials are not filled");
        setLoading(false);
      }

    }catch(err){
      console.log(err);
      setLoading(false);
    }
  }

  const gotoRegister = () => {
    setBoxName('register');
  }

  return (
    <div className='loginBox text-start'>
      {loading && <Spinner />}
      <form className='mt-3'>
          <div className="form-group my-3">          
          <input type="email" className="form-control customInput" id="email" name="email" placeholder="Enter Email" value={loginData.email} onChange={e=>{setLoginData({...loginData,email:e.target.value})}} />                    
          </div>
          <div className="form-group my-3">          
          <input type="password" className="form-control customInput" id="password" name="password" placeholder="Password" value={loginData.password} onChange={e=>{setLoginData({...loginData,password:e.target.value})}} />
          </div>            
          <button type="submit" className="btn loginBtn my-3 text-uppercase" onClick={handleLogin}>Submit</button>
          <p className='text-center my-4' style={{fontSize:"17px"}}>Don't have an account? <span className='link text-light' onClick={gotoRegister}>Register here.</span></p>
      </form>        
    </div>
  )
}

export default LoginBox