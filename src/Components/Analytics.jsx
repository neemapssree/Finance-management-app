import React from 'react'
import { Progress } from 'antd';
import { categoriesList } from '../Constants/Constants';

const Analytics = ({ allTransaction }) => {
    const totalTransaction = allTransaction.length;
    const totalIncomeTransaction = allTransaction.filter(transaction => transaction.type === 'income');
    const totalExpenseTransaction = allTransaction.filter(transaction => transaction.type === 'expense');
    const totalIncomePercent =( totalIncomeTransaction.length / totalTransaction ) * 100;
    const totalExpensePercent =( totalExpenseTransaction.length / totalTransaction ) * 100;

    //total turnover
    const totalTurnOver = allTransaction.reduce(
        ( acc, transaction) => acc + transaction.amount, 
        0
        );

    const totalIncomeTurnOver = allTransaction.filter(
        transaction => transaction.type === 'income'
        ).reduce((acc,transaction) => acc + transaction.amount, 0);

    const totalExpenseTurnOver = allTransaction.filter(
        transaction => transaction.type === 'expense'
        ).reduce((acc,transaction) => acc + transaction.amount, 0);   // accumulator, reduce method

    const totalIncomeTurnOverPercent = ( totalIncomeTurnOver / totalTurnOver ) * 100;
    const totalExpenseTurnOverPercent = ( totalExpenseTurnOver / totalTurnOver ) * 100;

  return (
    <>
    <div className='row gy-3'>
        <div className="col-md-4">
            <div className="card">
                <div className="card-header">
                    Total Transactions: {totalTransaction}                    
                </div>
                <div className="card-body">
                    <h5>Income: { totalIncomeTransaction.length }</h5>
                    <h5>Expense: { totalExpenseTransaction.length }</h5>
                    <div className='mt-4'>
                        <Progress type="circle" percent={totalIncomePercent.toFixed(0)} strokeColor={'green'} className='me-2' />
                        <Progress type="circle" percent={totalExpensePercent.toFixed(0)} strokeColor={'red'} className='ms-2' />
                    </div>                    
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card">
                <div className="card-header">
                    Total Turnovers: {totalTurnOver}                    
                </div>
                <div className="card-body">
                    <h5>Income: { totalIncomeTurnOver }</h5>
                    <h5>Expense: { totalExpenseTurnOver }</h5>
                    <div className='mt-4'>
                        <Progress type="circle" percent={totalIncomeTurnOverPercent.toFixed(0)} strokeColor={'green'} className='me-2' />
                        <Progress type="circle" percent={totalExpenseTurnOverPercent.toFixed(0)} strokeColor={'red'} className='ms-2' />
                    </div>                    
                </div>
            </div>
        </div>
    </div>
    <div className="row mt-4 mb-5 gy-3">                  
        <h4 className='mb-3'>Categorywise Income</h4>
        {
            categoriesList.map(categoryItem => {
                const catIncomeAmount = allTransaction.filter(
                    transaction => transaction.type === 'income' && transaction.category === categoryItem.value
                    ).reduce((acc,transaction) => acc + transaction.amount,0);
                const catIncomePercent = ( catIncomeAmount / totalIncomeTurnOver ) * 100;
                return(                                
                    catIncomeAmount !== 0 && 
                    <div className="col-md-3 col-6"> 
                        <div className="card">
                            <div className="card-body">
                                <h5>{ categoryItem.value }</h5>
                                <Progress type="circle" percent={catIncomePercent.toFixed(0)} strokeColor={'yellow'} />
                            </div>
                        </div>  
                    </div>                          
                );
            })
            
        }       
        <h4 className='mt-4 mb-3'>Categorywise Expense</h4>
        {
            categoriesList.map(categoryItem => {
                const catExpenseAmount = allTransaction.filter(
                    transaction => transaction.type === 'expense' && transaction.category === categoryItem.value
                    ).reduce((acc,transaction) => acc + transaction.amount,0);
                const catExpensePercent = ( catExpenseAmount / totalExpenseTurnOver ) * 100;
                return(                                
                        catExpenseAmount !== 0 && 
                        <div className="col-md-3 col-6"> 
                            <div className="card">
                                <div className="card-body">
                                    <h5>{ categoryItem.value }</h5>
                                    <Progress type="circle" percent={catExpensePercent.toFixed(0)} strokeColor={'#564787'} />
                                </div>
                            </div>  
                        </div>                          
                );
            })
            
        }                    
    </div>
    </>
  )
}

export default Analytics