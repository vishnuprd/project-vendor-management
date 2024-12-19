import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie"; 

export default function NivoCharts() {
  const [vendorData, setVendorData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [bankTableData, setBankTableData] = useState([]);

  const fetchVendorData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-vendors`);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      alert("Failed to load vendor data. Please try again.");
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/get-products`);
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      alert("Failed to load product data. Please try again.");
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customer/get-customers`);
      if (response.status === 200) {
        setCustomerData(response.data);
      } else {
        console.log("Error fetching customer data");
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const fetchBanktableData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor/get-bankdetails`);
      setBankTableData(response.data);
    } catch (error) {
      console.error("Error fetching bank details data:", error);
      alert("Failed to load bank details data. Please try again.");
    }
  };

  useEffect(() => {
    fetchVendorData();
    fetchProductData();
    fetchCustomerData();
    fetchBanktableData();
  }, []);

  const chartData = [
    {
      category: "Products",
      value: productData.length
    },
    {
      category: "Customers",
      value: customerData.length
    },
    {
      category: "Banks",
      value: bankTableData.length
    },
    {
      category: "Vendors",
      value: vendorData.length
    }
  ];

  const pieChartData = chartData.map(item => ({
    id: item.category,
    label: item.category,
    value: item.value
  }));

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <h2 className="text-center text-xl font-bold">Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-4">
        
          <div className="flex items-center justify-center rounded bg-gray-50 h-72 dark:bg-gray-800">
            <ResponsiveBar
              data={chartData}
              keys={['value']}
              indexBy="category"
              margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
              padding={0.3}
              layout="vertical"
              colors={({ indexValue }) => {
                switch (indexValue) {
                  case "Vendors":
                    return "#ff6361"; 
                  case "Products":
                    return "#ffa600"; 
                  case "Bank Table Data":
                    return "#003f5c";
                  case "Customers":
                    return "#58508d"; 
                  default:
                    return "#ddd"; 
                }
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Category',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          </div>

          <div className="flex items-center justify-center rounded bg-gray-50 h-72 dark:bg-gray-800">
            <ResponsivePie
              data={pieChartData}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              colors={['#ff6361', '#ffa600', '#003f5c', '#58508d']} 
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
                },
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
                }
              ]}
              fill={[
                { match: { id: 'Products' }, id: 'dots' },
                { match: { id: 'Customers' }, id: 'lines' }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
