import {Routes,Route} from 'react-router-dom'
import Home from '../../pages/client/Home'  
import UserLogin from '../../pages/client/UserLogin'
import UserSignup from '../../pages/client/UserSignup'

function UserRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/login' element={<UserLogin />} />
      <Route path='/signup' element={<UserSignup />}/>
    </Routes>
  )
}

export default UserRoutes