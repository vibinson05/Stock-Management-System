
import Layout from "./Layout";

const DashboardPage = () => {
    return (
       
        <div className="d-flex">
        
        
      <Layout isOpen={true} />

  
        
        <div className="flex-grow-1 p-4" style={{ marginLeft: '220px' }}>
          <h2>Welcome to Dashboard</h2>
          
        </div>
      </div>
    );
  };
  
  export default DashboardPage;
  