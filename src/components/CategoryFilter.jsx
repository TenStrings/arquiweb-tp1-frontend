import React from 'react';
import { Tag } from 'antd';

const CheckableTag = Tag.CheckableTag;

class CategoryFilter extends React.Component {
    state = {
        selected_categories: new Set(this.props.categories.map(c => c.title))
    };

    onTagChangeDo(categoryName, checked) {
        this.setState(state => {
            const { selected_categories } = state
            const new_categories = new Set(selected_categories)
            if (checked) new_categories.add(categoryName)
            else new_categories.delete(categoryName)
            return { selected_categories: new_categories }
        },
            this.notifyChange);
    }

    notifyChange = () => {
        this.props.updateMapWith(this.filterPoints)
    }

    filterPoints = points => {
        const { selected_categories } = this.state;
        return points.filter(point => selected_categories.has(point.categoryName))
    }

    render() {
        const { selected_categories } = this.state;
        let titles = new Set(this.props.categories.map(c => c.title))
        return (
            <div>
                {
                    Array.from(titles).map(title => (
                        <CheckableTag
                            key={title}
                            checked={selected_categories.has(title)}
                            onChange={checked => this.onTagChangeDo(title, checked)}
                        >
                            {title}
                        </CheckableTag >
                    ))
                }
            </div>
        );
    }
}

export default CategoryFilter;
