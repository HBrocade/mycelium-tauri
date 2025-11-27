import "./styles/App.css";
import Bar from "./components/layout/Bar";
import { CompassOutlined } from "@ant-design/icons";

function App() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Bar
        style={{
          position: 'sticky',
          top: 0
        }}
        title="Mycelium"
        icon={<CompassOutlined />}
      />

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}
      >

      </div>
    </div>
  );
}

export default App;