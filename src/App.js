
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconPage from './Pages/IconPage';
import Login from './Pages/Login';
import Homepage from './Pages/Homepage';
import { LoginAuth, UserAuth } from './Authorization/Authorization';
import Transactions from './Pages/Transactions';

function App() {
  return ( 
    <>   
      <ToastContainer />   
      <BrowserRouter>
        <Routes>
          <Route element={<LoginAuth />}>
            <Route path='/login' element={<Login />} />
          </Route>
          
            <Route path='/' element={<Homepage />} /> 

            <Route element={<UserAuth />}>
              <Route path='/transactions' element={<Transactions />} />
            </Route>
                  
        </Routes>
      </BrowserRouter>
    </> 
  );
}

export default App;
