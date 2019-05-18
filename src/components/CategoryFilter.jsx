import React from 'react';
import { Tag } from 'antd';

const CheckableTag = Tag.CheckableTag;
//const tag_colors = ["magenta", "red", "volcano", "orange", "gold", "lime",
//                    "green", "cyan", "blue", "geekblue", "purple"]


class CategoryFilter extends React.Component {
    state = {
        selected_categories: new Set(this.props.categories.map(c => c.title))
    };

    onTagChangeDo(category_name, checked) {
        this.setState(state => {
            const { selected_categories } = state
            const new_categories = new Set(selected_categories)
            if (checked) new_categories.add(category_name)
            else new_categories.delete(category_name)
            return { selected_categories: new_categories }
        },
            this.notifyChange);
    }

    notifyChange = () => {
        this.props.updateMapWith(this.filterPoints)
    }

    filterPoints = points => {
        const { selected_categories } = this.state;
        return points.filter(point => selected_categories.has(point.categoryName)
        )
    }

    render() {
        const { selected_categories } = this.state;
        return (
            <div>
                {
                    this.props.categories.map(category => (
                        <CheckableTag
                            key={category.title}
                            checked={selected_categories.has(category.title)}
                            onChange={checked => this.onTagChangeDo(category.title,
                                checked)}
                        >
                            {category.title}
                        </CheckableTag>
                    ))
                }
            </div>
        );
    }
}

export default CategoryFilter;
