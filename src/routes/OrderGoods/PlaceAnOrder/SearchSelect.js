import React, { PureComponent } from 'react';
import { Select, Modal } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const searchTypeMapping = {
}

const generateOptions = (options) => {
  const newOptions = options.map((item) => {
    return <Option value={item.ID} key={item.ID}> {item['label']} </Option>;
  });
  return newOptions;
};

export default class Searchable extends PureComponent {
  static propTypes = {
    fetchData: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    data: PropTypes.array,
    label: PropTypes.string,
    CreateForm: PropTypes.func,
  }
  constructor() {
    super();
    this.state = {
      searchString: '',
      isShowModal: false,
      cacheSearchString: '',
      value: null,
      searchType: new Set(),
    };
  }
  componentDidMount() {
    if (this.props.payload) {
      this.props.fetchData && this.props.fetchData(this.props.payload);
      this.props.cascadeFunc && this.props.cascadeFunc(this.props.payload);
      return;
    }
    this.props.fetchData && this.props.fetchData();
  }
  toggleModal = () => {
    this.setState({ isShowModal: !this.state.isShowModal });
  }
  searchHandler = (string) => {
    this.setState({
      searchString: string,
    });
  }
  selectHandler = (value, option) => {
    const searchTypeItem = value.split('-')[0]
    const newSearchType = this.state.searchType.add(searchTypeItem)
    this.setState({searchType: newSearchType})
    // if (value.includes('create-')) {
    //   this.toggleModal();
    //   this.setState({ cacheSearchString: value });
    // } else {
    //   this.props.onChange(value);
    // }
  }
  render() {
    const { searchString } = this.state;
    const options = searchString ?
      [
        { ID: `sku-${searchString}`, label: `在SKU下查询  ${searchString}` },
        { ID: `ChineseName-${searchString}`, label: `在中文名下查询 ${searchString}` },
        { ID: `EnglishName-${searchString}`, label: `在英文名下查询 ${searchString}` },
        { ID: `BrandChineseName-${searchString}`, label: `在品牌中文名下查询 ${searchString}` },
        { ID: `BrandEnglishName-${searchString}`, label: `在品牌英文名下查询 ${searchString}` },
      ]
      :
      []
    return (
      <div>
        <div>
        <Select
          style={{ width: '100%' }}
          mode='multiple'
          showSearch
          onSearch={this.searchHandler}
          optionFilterProp="children"
          filterOption={(input, option) => {
            return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          notFoundContent="请输入想要搜索的内容"
          allowClear
          onSelect={this.selectHandler}
        >
          {generateOptions(options)}
        </Select>
        </div>
      </div>
    );
  }
}
