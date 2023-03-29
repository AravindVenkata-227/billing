import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import Home from "./components/Home/Home";
import SignIn from './components/SignIn/SignIn';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const App = () => {
  return (
    <div className="App">
      <div className="desktop-only">Mobile version not supported. Kindly visit in Desktop</div>

      <Router>
        <Routes>
          <Route path='/dashboard/*' element={<Home />} />
          <Route path='/' exact element={<SignIn />} />
        </Routes>

      </Router>

    </div >
  );
}

export default App;
