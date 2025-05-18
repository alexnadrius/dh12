import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DealList from './components/DealList';
import Chat from './components/Chat';
import Balance from './components/Balance';
import Login from './components/Login';

const API_URL =
  'https://script.google.com/macros/s/AKfycbvUYsCBhtiWID9kP4t_MtO2cxsgGyqFszzSIcliZqSfORD2xYstkyaTzQgBm6ZLxB8sjw/exec';

const App = () => {
  const [deals, setDeals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const fetchDeals = async (phone) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'getDeals', phone }),
    });
    const data = await res.json();
    setDeals(data);
  };

  const handleLoginSuccess = async () => {
    const phone = localStorage.getItem('currentUserPhone');
    await fetchDeals(phone);
  };

  useEffect(() => {
    const phone = localStorage.getItem('currentUserPhone');
    if (phone) {
      setCurrentUser({ phone });
      fetchDeals(phone);
    }
  }, []);

  const updateDeal = (updatedDeal) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d))
    );
  };

  if (!currentUser) {
    return (
      <Login
        setCurrentUser={setCurrentUser}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        currentUserPhone={currentUser.phone}
        setCurrentUserPhone={() => {}}
      />
      <main className="flex-1 bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Balance deals={deals} role={'buyer'} />
                <DealList
                  deals={deals}
                  updateDeal={updateDeal}
                  currentUserPhone={currentUser.phone}
                />
              </>
            }
          />
          <Route
            path="/deal/:id"
            element={<Chat deals={deals} updateDeal={updateDeal} />}
          />
        </Routes>
      </main>
      <Footer role="buyer" />
    </div>
  );
};

export default App;
