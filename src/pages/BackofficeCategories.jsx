import React, { Component } from 'react';
import { Table, Button, Switch } from 'antd';

function onChange(checked) {
  console.log(`switch to ${checked}`);
}
class BackofficeCategories extends Component {
  state = {  }
  render() {
      const columns = [
        {
          title: 'Nombre', width: 200, dataIndex: 'name',
        },
        {
          title: 'Icono', dataIndex: 'img', width: 50, //button with card or popUp with image
        },
        {
          title: 'Habilitada', dataIndex: 'enabled', width: 50, //button with card or popUp with image
        },
        {
          title: 'Visible', dataIndex: 'visible', width: 50, //button with card or popUp with image
        },
        {
          title: 'Editar', dataIndex: 'edit', width: 50,
        },
        {
          title: 'Borrar', dataIndex: 'delete', width: 50,
        }
      ];

      const data = [];
      for (let i = 0; i < 100; i++) {
        data.push({
          name: "La facultad",
          img: "unBoton a img",
          enabled:   <Switch defaultChecked onChange={onChange}/>,
          visible:   <Switch defaultChecked onChange={onChange}/>,
          edit: <Button type="primary" shape="circle" icon="edit"></Button>,
          delete:<Button type="danger" shape="circle" icon="delete"></Button>
        });
      }
      return ( <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
  }
}

export default BackofficeCategories;
