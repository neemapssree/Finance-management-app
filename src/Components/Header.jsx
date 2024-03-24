import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import IconPage from '../Pages/IconPage';
import { faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { NonUserAuthSections, UserAuthSections } from '../Authorization/Authorization';

const Header = () => {
  const navigate = useNavigate();

  const {userDetails} = useSelector(state=>state.user);  
  const [hasToken,setHasToken] = useState('');
  const [hasUser,setHasUser] = useState('');

  useEffect (() => {
    setHasToken(localStorage.getItem('token'));
    setHasUser(localStorage.getItem('user'));
  }, [])

  const logOutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); 
    toast.success("Logout successfully");
  }  

  return (    

    <div className='navbar navbar-expand-lg text-light py-3 px-md-0 px-3'>
      <div className='container px-0'>
        <a className="navbar-brand text-light d-flex" href="/"><span className='me-3'>Budget Buddy</span><IconPage icon={faChartSimple} /></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
          {/* for logged in users only */}
          <UserAuthSections authorized={true}>
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className='nav-item'><a href='/' className='text-white'>Home</a></li>
                <li className='nav-item'><a href='/transactions' className='text-white'>Manage Transactions</a></li>                
              </ul>
              <ul className='d-flex mb-0' style={{gap:"30px",listStyleType:'none'}}>
                <li className='d-flex nav-item' style={{gap:"15px"}}><IconPage icon={faUser} />{userDetails.name}</li>
                <li className='nav-item'><a className='text-light' onClick={logOutHandler}>Sign out</a></li>
              </ul>
            </div>
          </UserAuthSections>  

          {/* for NON logged users only */}
          <NonUserAuthSections authorized={false}>
            <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
              <ul className='d-flex mb-0 navbarMobile' style={{gap:"30px",listStyleType:'none'}}>
                <li className='nav-item'><a className='text-light' href='/login'>Sign In</a></li>                
              </ul>
            </div>
          </NonUserAuthSections>

          {/* <NavDropdown title={<span className='d-flex' style={{gap:"15px"}}><IconPage icon={faUser} />{userDetails.name}</span>} id ="userNav"> 
            <NavDropdown.Item link>Sign out</NavDropdown.Item>
          </NavDropdown> */}
          
        </div>
      </div>
  )
}

export default Header