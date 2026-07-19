import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="text-b2-600 text-2xl p-8">B2.Work</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
