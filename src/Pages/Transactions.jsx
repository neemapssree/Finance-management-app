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
import graphImg from '../assets/img/graph-icon.png';
import listImg from '../assets/img/list-icon.png';
import Analytics from '../Components/Analytics';

const Transactions = () => {
    const navigate = useNavigate();
    const { errors, validateForm } = ValidationCheck();
    const [frequency, setFrequency] = useState('30');
    const [filterType, setFilterType] = useState('');
    const [showDateModal, setShowDateModal] = useState(false);    
    const [viewData, setViewData] = useState('table');

    const [selectedDate, setSelectedDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);   
      const [selCategory, setSelCategory] = useState('');       

    //get all transactions
    const [allTransactions,setAllTransactions] = useState([]); 
    const [customFrequencySelected, setCustomFrequencySelected] = useState(false);
    
    const handleFreqChange = (e) => {
        const newFrequency = e.target.value;
        setFrequency(newFrequency);
        if (newFrequency === 'custom' && !customFrequencySelected || newFrequency === 'custom' && customFrequencySelected) {
            setShowDateModal(true);
            setCustomFrequencySelected(true);            
        } else {
            setShowDateModal(false);            
        }  
        //console.log("option changed");      
    }
    const handleTypeChange = (e) => {
        const newType = e.target.value;
        setFilterType(newType);             
    }

    // const handleMenuOpen = (e) => {
    //     setFrequency(''); 
    //     console.log("menu opened");      
    // }

    const getAllTransactions = useCallback(async () => {        
        try{            
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
                selCategory,
                filterType
            });
            const sortedData = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));  //date sort
            setLoading(false);
            setAllTransactions(sortedData);            
        }catch(error){
            console.log(error);
        }        
    }, [frequency, selectedDate, selCategory, filterType]); // Add dependencies here

    useEffect(() => {        
        getAllTransactions();       
        
    }, [getAllTransactions, frequency, selectedDate, selCategory, filterType]); // Pass the function itself as the only dependency

    
    const columns = [
        {
            title:"Date",
            dataIndex:"date",
            width:"150",
        },
        {
            title:"Type",
            dataIndex:"type",
            width:"100",
        },
        {
            title:"Amount",
            dataIndex:"amount",
            width:"150",
        },
        {
            title:"Category",
            dataIndex:"category",
            width:"150",
        },
        {
            title:"Reference",
            dataIndex:"reference",
            width:"150",
        },
        {
            title:"Description",
            dataIndex:"description",
            width:"200",
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
        <div className='container my-5'>
            <div className='row'>
                <div className='d-md-flex flex-row justify-content-between mb-4'>
                    <div className='d-flex justify-content-start selectFilters mb-md-0 mb-4'>
                        <div>
                            <h6>Select frequency</h6>
                            <select name="frequency" value={frequency} onChange={(e) => handleFreqChange(e)}>
                                <option value="">Select</option>                           
                                <option value="7">Last one week</option>
                                <option value="30" selected>Last one month</option>
                                <option value="365">Last one Year</option>
                                <option value="custom">Custom</option>                          
                            </select>
                        {/* {frequency ==='custom' && 
                            <DateRange
                            editableDateInputs={true}
                            onChange={item => setSelectedDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={selectedDate}
                            /> 
                        } */}
                        </div>
                        <div className='ms-3'>
                            <h6>Select Category</h6>
                            <CategoryFilter />
                        </div>
                        <div className='ms-3'>
                            <h6>Select Type</h6>
                            <select name='filterType' id="filterType" value={filterType} onChange={(e) => handleTypeChange(e)} className='selectFilter'>
                                <option value="">Select type</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                    </div>
                    <div className='mb-md-0 mb-4'>
                        <p className='text-md-center h6 mb-3'>Select View</p>
                        <div className='viewsBox d-flex'>
                            <div className={`viewsBoxIcon ms-2 me-3 ${viewData === 'table' ? 'active-icon' : ''}`}
                                onClick={()=> setViewData('table')}>
                                <img src={listImg} width="30" />
                            </div>
                            <div className={`viewsBoxIcon ms-3 me-2 ${viewData === 'analytics' ? 'active-icon' : ''}`}
                                onClick={()=> setViewData('analytics')}>
                                <img src={graphImg} width="30" />
                            </div>
                        </div>
                    </div>
                    
                    <button className='btn secondaryBtn w-auto' onClick={()=>setShowModal(true)} style={{height:"fit-content"}}>Add New</button>
                </div>
                {loading && <Spinner />}
                {allTransactions &&  
                    viewData === 'table' ? 
                    <TableElement 
                        colTitle={columns} colElement={allTransactions} itemsPerPage={itemsPerPage} 
                        refreshTransactions={getAllTransactions} />
                    :
                    <Analytics allTransaction = {allTransactions} />
                }            
            </div>
        </div>
            
        <ModalView showModal={showModal} setShowModal={setShowModal} title="Add Transaction">
            {loading && <Spinner />}
            <form className='modalForm'>
                <div className='row'>
                    <div className="col-md-6 form-group my-2">
                        <p className='fw-bold'>Date</p>                    
                        <input type='date' name='date' value={transacData.date} onChange={(e)=>{setTransacData({...transacData,date:e.target.value})}} className='w-100'/>
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

        <ModalView showModal={showDateModal} setShowModal={setShowDateModal}>
            <DateRange
                editableDateInputs={true}
                onChange={item => setSelectedDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={selectedDate}
            />
        </ModalView>
    </Layout>
  )
}

export default Transactions