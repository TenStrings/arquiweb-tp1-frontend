import React, { Component } from 'react';
import { Table, Button } from 'antd';

class BackofficeSugCategories extends Component {
  state = {  }
  render() {
      const columns = [
        {
          title: 'Nombre', width: 200, dataIndex: 'name',
        },
        {
          title: 'Aprobar', dataIndex: 'approve', width: 50,
        },
        {
          title: 'Rechazar', dataIndex: 'reject', width: 50,
        }
      ];

      const data = [];
      for (let i = 0; i < 100; i++) {
        data.push({
          key : i,
          name : "Categoria sugerida ejemplo",
          approve : <Button type="primary" shape="circle" icon="check"></Button>,
          reject : <Button type="danger" shape="circle" icon="close"></Button>
        });
      }
      return ( <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
  }
}

export default BackofficeSugCategories;
