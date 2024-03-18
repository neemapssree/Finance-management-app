import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../Components/Layout'
import ModalView from '../Components/ModalView';
import Select from 'react-select';
import AxiosInstance from '../Config/AxiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { categoriesList } from '../Constants/Constants';
import TableElement from '../Components/TableElement';
import ValidationCheck from '../Components/ValidationCheck';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Transactions = () => {
    const navigate = useNavigate();
    const { errors, validateForm } = ValidationCheck();
    const [frequency, setFrequency] = useState('');
    const [selectedDate, setSelectedDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);   
      const [selCategory, setSelCategory] = useState(''); 

    //get all transactions
    const [allTransactions,setAllTransactions] = useState('');    

    const getAllTransactions = useCallback(async () => {
        try{
            console.log("Category changed:", selCategory);
            const user = JSON.parse(localStorage.getItem("user"));
            console.log("user is:", user.userId);
            setLoading(true);
            if(frequency === 'custom') {
                console.log(selectedDate);
            }
            const response = await AxiosInstance.post('/transaction/get_All_Transactions', {
                userid:user.userId,
                frequency,
                selectedDate,
                selCategory
            });
            const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));  //date sort
            setLoading(false);
            setAllTransactions(sortedData);            
        }catch(error){
            console.log(error);
        }        
    }, [frequency, selectedDate, selCategory]); // Add dependencies here

    useEffect(() => {
        getAllTransactions();
    }, [getAllTransactions]); // Pass the function itself as the only dependency
    
    const columns = [
        {
            title:"Date",
            dataIndex:"date",
            width:"15%",
        },
        {
            title:"Type",
            dataIndex:"type",
            width:"10%",
        },
        {
            title:"Amount",
            dataIndex:"amount",
            width:"15%",
        },
        {
            title:"Category",
            dataIndex:"category",
            width:"15%",
        },
        {
            title:"Reference",
            dataIndex:"reference",
            width:"15%",
        },
        {
            title:"Description",
            dataIndex:"description",
            width:"20%",
        },
    ]

    const itemsPerPage = 5;

    //add transaction

    const [showModal, setShowModal] = useState(false);  
    const catOptions = categoriesList;
     
    const [transacData, setTransacData] = useState({
        date:'', type:'', amount:'', category:'', reference:'', description:''
    });      

    const Category = () => (
    <Select options={catOptions}
    value={catOptions.find(option => option.value === transacData.category)}
    id="category" name="category" placeholder="Select Category" 
    onChange={(selectedOption)=>setTransacData({...transacData,category: selectedOption.value})} />
    );
    
    const CategoryFilter = () => (
        <Select options={catOptions}
        value={catOptions.find(option => option.value === selCategory)}
        id="category" name="category" placeholder="Select Category" 
        onChange={(selectedOption)=>setSelCategory(selectedOption.value)} />
        );

    const [loading,setLoading] = useState(false);      
      //error validation
    // const [errors,setErrors] = useState('');     

    const handleSubmit = (e) => {
        e.preventDefault();
        // const validationErrors ={};
        const validationErrors = validateForm(transacData);
               
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);                
                AxiosInstance.post('/transaction/add-transaction',transacData).then((res)=> {            
                    if(res.data.message ==="successfully added new transaction") {                
                        toast.success("Added new transaction");
                        setLoading(false);
                        setShowModal(false);
                        getAllTransactions();
                    }            
                    if(res.data.message ==="couldn\'t add new transaction") {
                        toast.success("An error occured");
                        setLoading(false);
                    }
                })                
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }        

    };

  return (
    <Layout>
        <div className='container mt-5'>
            <div className='row'>
                <div className='d-flex flex-row justify-content-between mb-4'>
                    <div className='d-flex justify-content-start'>
                        <div>
                            <h6>Select frequency</h6>
                            <select name="frequency" value={frequency} onChange={(e)=> setFrequency(e.target.value)}> 
                                <option value="">Select</option>                           
                                <option value="7">Last one week</option>
                                <option value="30">Last one month</option>
                                <option value="365">Last one Year</option>
                                <option value="custom">Custom</option>                            
                            </select>
                        {frequency ==='custom' && 
                            <DateRange
                            editableDateInputs={true}
                            onChange={item => setSelectedDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={selectedDate}
                            /> 
                        }
                        </div>
                        <div className='ms-3'>
                            <h6>Select Category</h6>
                            <CategoryFilter />
                        </div>
                    </div>
                    <button className='btn secondaryBtn w-auto' onClick={()=>setShowModal(true)} style={{height:"fit-content"}}>Add New</button>
                </div>
                {loading && <Spinner />}
                {allTransactions &&  
                    <TableElement colTitle={columns} colElement={allTransactions} itemsPerPage={itemsPerPage} refreshTransactions={getAllTransactions} />
                }            
            </div>
        </div>
            
        <ModalView showModal={showModal} setShowModal={setShowModal} title="Add Transaction">
            {loading && <Spinner />}
            <form className='modalForm'>
                <div className='row'>
                    <div className="col-md-6 form-group my-2">
                        <p className='fw-bold'>Date</p>                    
                        <input type='date' name='date' value={transacData.data} onChange={(e)=>{setTransacData({...transacData,date:e.target.value})}} className='w-100'/>
                        {errors.date && <span className='errors'>{errors.date}</span>}
                    </div>
                    <div className="col-md-6 form-group my-2">  
                        <p className='fw-bold'>Type</p>                 
                        <select name='type' id="type" value={transacData.type} onChange={(e)=>{setTransacData({...transacData,type:e.target.value})}} className='w-100'>
                            <option value="" selected disabled>Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        {errors.type && <span className='errors'>{errors.type}</span>}
                    </div>
                    <div className="col-md-6 form-group my-2"> 
                        <p className='fw-bold'>Amount</p>                   
                        <input type='number' name='amount' value={transacData.amount} onChange={(e)=>{setTransacData({...transacData,amount:e.target.value})}} placeholder='Enter amount' className='w-100'/>
                        {errors.amount && <span className='errors'>{errors.amount}</span>}
                    </div>
                    
                    <div className="col-md-6 form-group my-2">
                        <p className='fw-bold'>Category</p>
                        <Category /> 
                        {errors.category && <span className='errors'>{errors.category}</span>}                       
                    </div>
                    <div className="col-12 form-group my-2">  
                        <p className='fw-bold'>Reference</p>                  
                        <input type='text' name='reference' value={transacData.reference} onChange={(e)=>{setTransacData({...transacData,reference:e.target.value})}} placeholder='Enter reference' className='w-100'/>
                    </div>
                    <div className="col-12 form-group my-2"> 
                        <p className='fw-bold'>Description</p>                   
                        <input type='text' name='description' value={transacData.description} onChange={(e)=>{setTransacData({...transacData,description:e.target.value})}} placeholder='Enter additional information' className='w-100'/>
                    </div>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button type="submit" className="btn secondaryBtn my-3 text-uppercase w-auto py-2 align-self-end" onClick={handleSubmit}>Add Entry</button>
                    </div>
            </form>            
        </ModalView>
    </Layout>
  )
}

export default Transactions