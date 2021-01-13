import "./App.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

function App() {
  return (
    <div className="App">
      <Button type="primary" ghost>
        Primary
      </Button>
      <Button ghost>Default</Button>
      <Button type="dashed" ghost>
        Dashed
      </Button>
      <Button type="primary" icon={<DownloadOutlined />} />
      <Button type="danger" shape="circle" icon={<DownloadOutlined />} />
      <Button type="success" shape="round" icon={<DownloadOutlined />} />
    </div>
  );
}

export default App;
