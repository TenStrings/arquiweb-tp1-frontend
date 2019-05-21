import React, { Component } from 'react';
import { Table, Button, message } from 'antd';

import { suggestionsAPI, categoriesAPI } from '../api';

class BackofficeSugCategories extends Component {
  state = { loading: {} }

  toggleLoading(suggestion) {
    this.setState(
      prevState => {
        const { loading } = prevState
        const newLoading = Object.assign({}, loading)
        newLoading[suggestion._id] = !loading[suggestion._id]
        return { loading: newLoading }
      }
    )
  }

  async approveSuggestion(suggestion){
    this.toggleLoading(suggestion)
    const was_accepted = true
    await suggestionsAPI.delete(suggestion, this.props.userContext.token)
    delete suggestion['_id']
    await categoriesAPI.add(suggestion, this.props.userContext.token)
    this.props.notifySuggestionSolved(was_accepted)
    this.toggleLoading(suggestion)
  }

  onSugApproval = sug => {
    this.approveSuggestion(sug)
    .then(() => message.success("Sugerencia aprobada"))
    .catch(() => message.error("La sugerencia no pudo aprobarse"))
  }

  rejectSuggestion(suggestion){
    this.toggleLoading(suggestion)
    const was_accepted = false
    return suggestionsAPI
    .delete(suggestion, this.props.userContext.token)
    .finally(() => this.toggleLoading(suggestion))
    .then(() => this.props.notifySuggestionSolved(was_accepted))
    .catch(() => console.log("BackofficeSuggestions: failed to reject suggestion"));
  }

  onSugRejection = suggestion => {
    this.rejectSuggestion(suggestion)
    .then(() => message.success("Sugerencia rechazada"))
    .catch(() => message.error("La sugerencia no pudo eliminarse"))
  }



  render() {
      const { loading } = this.state;
      const { suggestions } = this.props;

      const columns = [
        {
          title: 'Titulo', width: 200, dataIndex: 'title',
        },
        {
          title: 'Icono', width: 100, dataIndex: 'icon',
        },
        {
          title: 'Aprobar', dataIndex: 'approve', width: 50,
        },
        {
          title: 'Rechazar', dataIndex: 'reject', width: 50,
        }
      ];

      const data = suggestions.map( sug => ({
          key : sug._id,
          title : sug.title,
          icon: sug.icon,
          approve : <Button type="primary" shape="circle" icon="check" loading={loading[sug._id]}
                            onClick={() => this.onSugApproval(sug)}
                    />,
          reject : <Button type="danger" shape="circle" icon="close" loading={loading[sug._id]}
                           onClick = { () => this.onSugRejection(sug)}
                   />
      }));

      return ( <Table columns={columns} dataSource={data} scroll={{ y: 600 }} />);
  }
}

export default BackofficeSugCategories;
