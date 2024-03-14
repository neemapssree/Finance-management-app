import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import AxiosInstance from '../Config/AxiosInstance';
import Spinner from './Spinner';
import Select from "react-select";
import countryList from 'react-select-country-list';


function Register({setBoxName}) {

    const [country, setCountry] = useState('');  
    const options = useMemo(() => countryList().getData(), [])     
    
    const changeHandler = (country) => {
        setCountry(country);        
    }

    const [loading,setLoading] = useState(false);

    const [signUpData, setSignUpData] = useState(
        {
            name:'',
            email:'',
            phone:'',
            country:'',
            password:'',
            confirmpassword:'',
        }
    );
    const [errors, setErrors] = useState({});

    const handleRegister = (e) => {
        e.preventDefault();
        const validationErrors ={}

        function validatePhoneNumber(phoneNumber, minPhoneLength, maxPhoneLength) {
            const phoneRegex = new RegExp(`^[0-9]{${minPhoneLength},${maxPhoneLength}}$`);
            return phoneRegex.test(phoneNumber);
        }

        if(!signUpData.name.trim()){
            validationErrors.name = "Name is required";
        }
        if(!signUpData.email.trim()){
            validationErrors.email = "Email is required";
        }else if (!/\S+@\S+\.\S+/.test(signUpData.email)){
            validationErrors.email = "Enter valid email id";
        }
        
        if(signUpData.phone.trim() === ''){
            validationErrors.phone = "Phone number is required";
        }else if (signUpData.phone.trim() !== '') {
            const isValidPhone = validatePhoneNumber(signUpData.phone,4,15); //4 and 15 are min and max length of phone.
            if(!isValidPhone){
                validationErrors.phone = "Enter a valid Phone number";
            }
        }
        if(!signUpData.country.trim()){
            validationErrors.country = "Country is required";
        }

        if(!signUpData.password.trim()){
            validationErrors.password = "Password is required";
        }else if (signUpData.password.length < 5) {
            validationErrors.password = "Password must be at least 5 characters";
        }

        if(!signUpData.confirmpassword.trim()){
            validationErrors.confirmpassword = "Confirm Password is required";
        } else if ( signUpData.confirmpassword !== signUpData.password ) {
            validationErrors.confirmpassword = "Passwords are not matching";
        }

        setErrors(validationErrors);

        if(Object.keys(validationErrors).length === 0) {
            try{
                setLoading(true);
                //console.log(signUpData,'register details');
                AxiosInstance.post('/users/userRegister',signUpData).then((res)=>{                                       
                    console.log(res);
                    if(res.data.message ==="signup successfull") {
                        toast.success("signup successfull");
                        setBoxName('login');
                        setLoading(false);
                    }
                    if(res.data.message ==="user already registered") {
                        toast.warning("User already registered");  
                        setLoading(false);                      
                    }
                })

            }catch(err){
                console.log(err);
                setLoading(false);
            }
        }
        
    }

    const gotoLogin = () => {
        setBoxName('login');
    }

  return (
    <div className='loginBox text-start'>
        {loading && <Spinner />}
      <form className='mt-3'>
      <div className="form-group my-3">          
            <input type="text" className="form-control customInput" id="name" name="name" placeholder="Enter Name" value={signUpData.name} 
            onChange={e=>{setSignUpData({...signUpData,name:e.target.value})}} />
            {errors.name && <span className='errors'>{errors.name}</span>}                    
          </div>
          <div className="form-group my-3">            
            <input type="email" className="form-control customInput" id="email" name="email" placeholder="Enter Email" value={signUpData.email} 
            onChange={e=>{setSignUpData({...signUpData,email:e.target.value})}}/>
            {errors.email && <span className='errors'>{errors.email}</span>}                     
          </div>
          <div className="form-group my-3">        
          <Select styles={{
                control: (styles) => ({
                ...styles,
                color: 'black',
                }),
                option: (styles) => ({
                ...styles,
                color: 'black',
                }),
            }} isSearchable={true}
                options={options}
                value={country}
                id="country" name="country" placeholder="Select Country" 
                onChange={(selectedOption)=>{setSignUpData({...signUpData,country: selectedOption.value});changeHandler(); }} />
            {errors.country && <span className='errors'>{errors.country}</span>}                     
          </div>
          <div className="form-group my-3">            
            <input type="phone" className="form-control customInput" id="phone" name="phone" placeholder="Enter Phone Number" value={signUpData.phone}
            onChange={e=>{setSignUpData({...signUpData,phone:e.target.value})}} />  
            {errors.phone && <span className='errors'>{errors.phone}</span>}                   
          </div>
          <div className="form-group my-3">            
            <input type="password" className="form-control customInput" id="password" name="password" placeholder="Password" value={signUpData.password} 
            onChange={e=>{setSignUpData({...signUpData,password:e.target.value})}} />
            {errors.password && <span className='errors'>{errors.password}</span>} 
          </div>
          <div className="form-group my-3">            
            <input type="password" className="form-control customInput" id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" value={signUpData.confirmpassword} 
            onChange={e=>{setSignUpData({...signUpData,confirmpassword:e.target.value})}} />
            {errors.confirmpassword && <span className='errors'>{errors.confirmpassword}</span>} 
          </div>            
          <button type="submit" className="btn loginBtn my-3 text-uppercase" onClick={handleRegister}>Register</button>
          <p className='text-center my-4' style={{fontSize:"17px"}}>Already have an account? <span className='link text-light' onClick={gotoLogin}>Login.</span></p>
      </form>        
 
    </div>
  )
}

export default Register