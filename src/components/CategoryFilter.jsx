import React from 'react';
import { Tag } from 'antd';

const CheckableTag = Tag.CheckableTag;

class CategoryFilter extends React.Component {
    state = {
        selected_categories: new Set(this.props.categories.map(c => c._id))
    };

    onTagChangeDo(categoryId, checked) {
        this.setState(state => {
            const { selected_categories } = state
            const new_categories = new Set(selected_categories)
            if (checked) new_categories.add(categoryId)
            else new_categories.delete(categoryId)
            return { selected_categories: new_categories }
        },
            this.notifyChange);
    }

    notifyChange = () => {
        this.props.updateMapWith(this.filterPoints)
    }

    filterPoints = points => {
        const { selected_categories } = this.state;
        return points.filter(point => selected_categories.has(point.categoryId))
    }

    render() {
        const { selected_categories } = this.state;
        return (
            <div>
                {
                    this.props.categories.map(category => (
                        <CheckableTag
                            key={category._id}
                            checked={selected_categories.has(category._id)}
                            onChange={checked => this.onTagChangeDo(category._id, checked)}
                        >
                            {category.title}
                        </CheckableTag >
                    ))
                }
            </div>
        );
    }
}

export default CategoryFilter;
