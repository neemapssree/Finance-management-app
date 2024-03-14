import React, { useState } from 'react'
import Layout from '../Components/Layout'
import './Homepage.css'
import {NonUserAuthSections, UserAuthSections } from '../Authorization/Authorization'

function Homepage() {  

  return (
    <Layout>
      
        <div className='container text-center py-5'>
          <h1 className='ff-caveat mb-4'>Budget Bliss:<br />
            <span class="cz_d">
              <svg className='cz_gf b1_f2' xmlns='http://www.w3.org/2000/svg' width='504' height='106' viewBox='0 0 504 106' style={{transform:'scaleX(0.9) scaleY(0.93) rotate(2deg)',marginLeft:'-42px',marginTop:'0px'}}>
                <path fill="none" stroke="#DBCBD8" stroke-linecap="round" stroke-width="43" d="M1106,1813.61193 C1391.48757,1788.3249 1542.09692,1785.22818 1557.82804,1804.32178 C1581.42472,1832.96217 1297.6495,1822.13368 1191.16891,1835.26224 C1084.68832,1848.39079 1016.09991,1866.56524 1566,1841.45052" transform="translate(-1084 -1770)"></path>
                </svg>
              <span class="cz_dg">Smoothing</span></span> Out Expenses with a Smile!</h1>
          <h4>Capture every incomes and expenses, and set your budget goals in the BudgetBuddy.</h4>
          <NonUserAuthSections authorized={false}>
            <a className='btn secondaryBtn w-auto mt-5' href='/login'>Start Now - It's Free!</a>
          </NonUserAuthSections>
        </div>

    </Layout>
  )
}

export default Homepage