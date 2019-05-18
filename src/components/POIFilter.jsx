import React from 'react';
import { AutoComplete } from 'antd';

class POIFilter extends React.Component {
    static NoFilter = points => points

    state = { criteria: null }

    notifyParent = () => {
        const { onChange } = this.props
        onChange(this.filterPoints)
    }

    onChange = poiName => {
        this.setState(state => {
            const { criteria } = state
            return { criteria: { ...criteria, name: poiName } }
        }, this.notifyParent)
    }

    filterPoints = points => {
        const { criteria } = this.state
        if (criteria) {
            return points.filter(point => {
                const pointName = point.name.toUpperCase()
                const filterName = criteria.name.toUpperCase()
                return pointName.startsWith(filterName)
            })

        }
        else {
            return points
        }
    }

    render() {
        const { poi } = this.props
        const filteredPoints = this.filterPoints(poi)
        return (
            <div>
                <AutoComplete
                    dataSource={filteredPoints.map(poi => poi.name)}
                    style={{ width: 200, display: "inline-flex" }}
                    onChange={this.onChange}
                    placeholder="Name"
                />
            </div>
        );
    }
}

export default POIFilter;
