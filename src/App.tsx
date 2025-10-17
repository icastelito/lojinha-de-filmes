import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Home from './pages/Home/Home'
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage'
import CartSidebar from './components/Cart/CartSidebar'
import FavoritesSidebar from './components/Favorites/FavoritesSidebar'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)

  const handleCartClick = () => {
    setCartOpen(true)
    setFavoritesOpen(false)
  }

  const handleFavoritesClick = () => {
    setFavoritesOpen(true)
    setCartOpen(false)
  }

  const handleCheckout = () => {
    setCartOpen(false)
    // A navegação será feita pelo Link dentro do CartSidebar
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<Home onCartClick={handleCartClick} onFavoritesClick={handleFavoritesClick} />} />
            <Route path="/checkout" element={<CheckoutPage onCartClick={handleCartClick} onFavoritesClick={handleFavoritesClick} />} />
          </Routes>
          <CartSidebar 
            open={cartOpen} 
            onOpenChange={setCartOpen}
            onCheckout={handleCheckout}
          />
          <FavoritesSidebar
            open={favoritesOpen}
            onOpenChange={setFavoritesOpen}
          />
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
