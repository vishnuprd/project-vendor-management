import React from 'react'
import Sidebar from '../../components/sidebar/index.jsx';
import Stats from "../../components/stats/index.jsx";
import NivoCharts from "../../components/nivocharts/index.jsx";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Stats/>
<NivoCharts/>
    </div>
  )
}
