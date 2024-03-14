import React, { useState } from 'react'
import bannerBg from '../assets/img/economy-bg.webp';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome styles
import './Login.css';
import LoginBox from '../Components/LoginBox';
import Register from '../Components/Register';
import IconPage from './IconPage';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';


function Login() {

  const [boxName,setBoxName] = useState('login');

  return (
    <div className='container-fluid mainBanner' style={{backgroundImage:`URL(${bannerBg})`,minHeight:'100vh'}}>
      <div className='row justify-content-center align-items-center h-100' style={{backgroundColor:"#00000080",minHeight:'100vh'}}>        
        <div className='col-5 d-flex flex-column justify-content-center py-4'>
            <div className='formSec p-5 text-center text-light'>              
              <h1 className='mb-4'>Welcome</h1>
                {boxName === 'login' && <LoginBox setBoxName={setBoxName} /> }
                {boxName === 'register' && <Register setBoxName={setBoxName} /> }
                <span className='mt-5 fw-bold'><a href='/' style={{color:'#fff', fontSize:"19px",gap:"10px"}} className='d-flex justify-content-center'>Go to Home <IconPage icon={faArrowUpRightFromSquare} /></a></span>
            </div>            
        </div>
      </div>
    </div>
  )
}

export default Login