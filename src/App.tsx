import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import Homepage from './pages/Homepage'
import Detail from './pages/Detail'
import CartPage from './pages/CartPage'
import Catalog from './pages/CatalogPage'
import Library from './pages/LibraryPage'
import Login from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import OrderConfirmation from './pages/OrderConfirmationPage'
import PaymentPage from './pages/PaymentPage'
import ProfilePage from './pages/ProfilePage'
import NavbarComponent from "./components/NavbarComponent"
import FooterComponent from './components/FooterComponent'
function App() {
  return(
    <BrowserRouter>
    <NavbarComponent/>
    <Routes>
      <Route path="/" element={<Homepage/>}/>
<Route path="/details/:id" element={<Detail/>}/>
<Route path="/cart" element={<CartPage/>}/>
<Route path="/catalog" element={<Catalog/>}/>
<Route path="/library/:id" element={<Library/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/orderConfirmation" element={<OrderConfirmation/>}/>
<Route path="/payment" element={<PaymentPage/>}/>
<Route path="/profile/:id" element={<ProfilePage/>}/>
<Route path="*" element={<NotFoundPage/>}/>
</Routes>
<FooterComponent/>
</BrowserRouter>)
}
export default App
