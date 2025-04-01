import {Routes,Route} from 'react-router-dom'
import Home from '../../pages/client/Home'  
import UserLogin from '../../pages/client/UserLogin'
import UserSignup from '../../pages/client/UserSignup'
import EmailverificationError from '@/pages/errors/EmailverificationError'
import Emailverificationsuccesspage from '@/pages/client/Emailverificationsuccesspage'
import OtpPage from '@/pages/client/OtpPage'


function UserRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<UserLogin />} />
      <Route path='/signup' element={<UserSignup />}/>
      <Route path='/otp' element={<OtpPage />}/>
      <Route path='/email-validation-error' element={<EmailverificationError/>}/>
      <Route path='/email-verified' element={<Emailverificationsuccesspage/>}/>
    </Routes>
  )
}

export default UserRoutes