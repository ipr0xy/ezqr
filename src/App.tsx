import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { AppLayout } from './components/Layout/AppLayout';

// Screens
import { Dashboard } from './screens/Dashboard/Dashboard';
import { ItemList } from './screens/Items/ItemList';
import { CreateItem } from './screens/Items/CreateItem';
import { ItemQRCode } from './screens/Items/ItemQRCode';
import { Profile } from './screens/Profile/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="items" element={<ItemList />} />
          <Route path="items/create" element={<CreateItem />} />
          <Route path="items/:itemId/qr" element={<ItemQRCode />} />
          
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;