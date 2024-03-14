import { faTriangleCircleSquare } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react'
import ModalView from './ModalView';
import { Spinner } from 'react-bootstrap';
import { categoriesList } from '../Constants/Constants';
import Select from 'react-select';
import { toast } from 'react-toastify';
import AxiosInstance from '../Config/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import ValidationCheck from './ValidationCheck';

const TableElement = ({ colTitle, colElement, itemsPerPage, refreshTransactions }) => {
    const navigate = useNavigate();    
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = colElement.slice(indexOfFirstItem,indexOfLastItem);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const [showModal,setShowModal] = useState(false);    
    const [loading,setLoading] = useState(false);
    const catOptions = categoriesList;
    const[updateTransacData,setUpdateTransacData] = useState({});
    const { errors, validateForm } = ValidationCheck();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEntry,setSelectedEntry] = useState({});

    const Category = () => (
        <Select options={catOptions}
        value={catOptions.find(option => option.value === updateTransacData.category)}
        id="category" name="category" placeholder="Select Category" 
        onChange={(selectedOption)=>setUpdateTransacData({...updateTransacData,category: selectedOption.value})} />
    );

    //edit
    const editEntry = (row) => {        
        setShowModal(true);
        setUpdateTransacData(row);
        //console.log(updateTransacData);
    }

    const handleEdit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(updateTransacData);
        if (Object.keys(validationErrors).length === 0) {
            try {
                setLoading(true);                
                AxiosInstance.post('/transaction/update-transaction',updateTransacData).then((res)=> {            
                    if(res.data.message ==="Successfully updated transaction") {                
                        toast.success("Updated transaction");
                        setLoading(false);
                        setShowModal(false);
                        refreshTransactions();
                    }            
                    if(res.data.message ==="Transaction not found") {
                        toast.error("Transaction not found");
                        setLoading(false);
                    }
                    if(res.data.message ==="Internal server error") {
                        toast.error("Internal server error");
                        setLoading(false);
                    }
                });                
            } catch (error) {
                console.log("error:",error);
                setLoading(false);
            }  
        }
    };

    //delete
    const deleteModal = (row) => {
        setShowDeleteModal(true);
        setSelectedEntry(row);
    };

    const deleteEntry = () => {
        try{
            AxiosInstance.post('/transaction/delete-transaction', selectedEntry).then((res)=>{
                if(res.data.message ==="Deleted Entry Successfully") {                
                    toast.success("Deleted Entry Successfully");                    
                    setShowDeleteModal(false);
                    refreshTransactions();
                }            
                if(res.data.message ==="Transaction not found") {
                    toast.error("Transaction not found");
                    setLoading(false);
                }
                if(res.data.message ==="Internal server error") {
                    toast.error("Internal server error");
                    setLoading(false);
                }
            });
        }catch(error){
            console.log(error);
        }
        
    };

  return (
    <>
    <table cellPadding="10" width="100%" className="myTable">
        <thead>
            {colTitle.map((column) => (
                <th key={column.dataIndex} width={column.width}>{column.title}</th>
            ))} 
            <th width="20%">Action</th>           
        </thead>
        <tbody>
            {currentItems.map((row,rowIndex) => (
                <tr key={rowIndex}>
                    {colTitle.map((column,colIndex) => (
                        <td key={colIndex}>{row[column.dataIndex]}</td>
                    ))}   
                    <td className='d-flex justify-content-between'>
                        <a className='link' onClick={(e) => editEntry(row)}>Edit</a>
                        <a className='link' style={{color:"red"}} onClick={(e)=> deleteModal(row)}>Delete</a></td> 
                </tr>
            ))}

            
        </tbody>
    </table>
    <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={colElement.length}
        paginate={paginate}
        currentPage={currentPage}
    />

<ModalView showModal={showModal} setShowModal={setShowModal} title="Edit Transaction">
        {loading && <Spinner />}
            <form className='modalForm'>
                <div className='row'>
                    <div className="col-md-6 form-group my-2">
                        <p className='fw-bold'>Date</p>                    
                        <input type='date' name='date' value={updateTransacData.date} onChange={(e)=>{setUpdateTransacData({...updateTransacData,date:e.target.value})}} className='w-100'/>
                        {errors.date && <span className='errors'>{errors.date}</span>}
                    </div>
                    <div className="col-md-6 form-group my-2">  
                        <p className='fw-bold'>Type</p>                 
                        <select name='type' id="type" value={updateTransacData.type} onChange={(e)=>{setUpdateTransacData({...updateTransacData,type:e.target.value})}} className='w-100'>
                            <option value="" selected disabled>Select type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        {errors.type && <span className='errors'>{errors.type}</span>}
                    </div>
                    <div className="col-md-6 form-group my-2"> 
                        <p className='fw-bold'>Amount</p>                   
                        <input type='number' name='amount' value={updateTransacData.amount} onChange={(e)=>{setUpdateTransacData({...updateTransacData,amount:e.target.value})}} placeholder='Enter amount' className='w-100'/>
                        {errors.amount && <span className='errors'>{errors.amount}</span>}
                    </div>
                    
                    <div className="col-md-6 form-group my-2">
                        <p className='fw-bold'>Category</p>
                        <Category /> 
                        {errors.category && <span className='errors'>{errors.category}</span>}                       
                    </div>
                    <div className="col-12 form-group my-2">  
                        <p className='fw-bold'>Reference</p>                  
                        <input type='text' name='reference' value={updateTransacData.reference} onChange={(e)=>{setUpdateTransacData({...updateTransacData,reference:e.target.value})}} placeholder='Enter reference' className='w-100'/>
                    </div>
                    <div className="col-12 form-group my-2"> 
                        <p className='fw-bold'>Description</p>                   
                        <input type='text' name='description' value={updateTransacData.description} onChange={(e)=>{setUpdateTransacData({...updateTransacData,description:e.target.value})}} placeholder='Enter additional information' className='w-100'/>
                    </div>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button type="submit" className="btn secondaryBtn my-3 text-uppercase w-auto py-2 align-self-end" onClick={handleEdit}>Update Entry</button>
                    </div>
            </form> 
    </ModalView>
    
    {/* Delete modal */}
    <ModalView showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <h5>Are you sure you want to delete the entry?</h5>
        <div className="mt-5" style={{display:"flex", gap:"20px"}}>
            <button value="yes" className='btn secondaryBtn w-auto py-1 px-4' onClick={deleteEntry}>Yes</button>
            <button value="no" className='btn secondaryBtn w-auto py-1 px-4' onClick={() => setShowDeleteModal(false)}>No</button>
        </div>
    </ModalView>
    </>
    
  )
}

const Pagination = ({itemsPerPage,totalItems,paginate,currentPage}) => {
    const pageNumbers = [];

    for(let i=1; i<=Math.ceil(totalItems / itemsPerPage); i++){
        pageNumbers.push(i);
    }

    const prevShow = () => {
        // console.log(currentPage,"currentpage");
        // console.log(pageNumbers.length,"pageNumbers length");
        paginate(currentPage-1);
    }
    const nextShow = () => {
        paginate(currentPage+1);
    }
    const prevShowLast = () => {        
        paginate(1);
    }  
    const nextShowLast = () => {
        paginate(pageNumbers.length);
    }

    return (        
        <nav style={{display:"flex",justifyContent:"space-between"}} className='mt-3'>
            <ul className='pagination'>                
                <li className={currentPage === 1 ? 'prevArrow' : 'active prevArrow'} >
                    <button onClick={prevShowLast} disabled={currentPage === 1}>&lt;&lt;</button>
                </li>                
                <li className={currentPage < (pageNumbers.length) ? 'active nextArrow' : 'nextArrow'}>
                    <button onClick={nextShowLast} disabled={currentPage >= (pageNumbers.length)}>&gt;&gt;</button>
                </li>
            </ul>

            <ul className='pagination'>                
                <li className={currentPage === (pageNumbers.length)-1 || currentPage <= 1 ? 'prevArrow' : 'active prevArrow'} >
                    <button onClick={prevShow} disabled={currentPage === (pageNumbers.length)-1 || currentPage <= 1 }>&lt;</button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number} className={number===currentPage ? 'active' : null}>
                        <button onClick={()=> paginate(number)}>{number}</button>
                    </li>
                ))}
                <li className={currentPage < (pageNumbers.length) ? 'active nextArrow' : 'nextArrow'}>
                        <button onClick={nextShow} disabled={currentPage >= (pageNumbers.length)}>&gt;</button>
                </li>
            </ul>
        </nav>
    )
}

export default TableElement