import styles from "./App.module.css";
import {LeftSidebar} from './components/sidebars/left-side-bar/LeftSidebar';
import {Dashboard} from './components/dashboard/Dashboard';

function App() {
  return (
    <div className={styles.app}>
      <LeftSidebar />
      <div className={styles.container}>
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
