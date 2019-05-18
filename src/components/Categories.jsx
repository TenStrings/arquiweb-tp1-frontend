import React, { Component } from 'react';
import { List, Avatar, Switch } from 'antd';
import icon from 'leaflet/dist/images/marker-icon.png';

//TODO VINCULAR A MOSTRAR CATEGORIA Y AGREGAR O SACAR EL TAG
function onChange(checked) {
  console.log(`switch to ${checked}`);
}
class Categories extends Component {
    state = {}
    render() {
        let {data} = this.props
        return (
            <div style={{ ...this.props.style, padding: '10px' }}>
                <h1> Categorías </h1>
                <hr className="my-2" />
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={<Avatar size="small" src={icon} />}
                        title={item.title}
                        />
                        <Switch defaultChecked onChange={onChange} />
                    </List.Item>

                    )}
                />
                    {this.props.children}
            </div>
        );
    }
}

export default Categories;
