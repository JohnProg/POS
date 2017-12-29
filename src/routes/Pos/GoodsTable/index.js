import React, { PureComponent } from 'react';
import { Table, Card, Collapse } from 'antd'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { connect } from 'dva'
import StandardFormRow from '../../../components/StandardFormRow';
import TagSelect from '../../../components/TagSelect';

const { Panel } = Collapse


function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
    const hoverClientX = clientOffset.x - sourceClientOffset.x;
    if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
        return 'rightward';
    }
    if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
        return 'leftward';
    }

}

let HeaderCell = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        moveColumn,
        dragRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'rightward') {
            className += ' drop-over-rightward';
            // className += styles.dropOverDownward
        }
        if (direction === 'leftward') {
            className += ' drop-over-leftward';
            // className += styles.dropOverUpward
        }
    }
    return connectDragSource(
        connectDropTarget(
            <th
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
}
const columnSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const columnTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveColumn(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};


HeaderCell = DropTarget('column', columnTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('column', columnSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(HeaderCell)
);

class GoodsTable extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            columns: [
                {
                    title: '商品名',
                    dataIndex: 'Name',
                    key: 'name',
                    onHeaderCell: (columns) => {
                        const index = this.state.columns.findIndex(item => item.key === columns.key)
                        return {
                            index,
                            moveColumn: this.moveColumn,
                        }
                    },
                },
                {
                    title: '单价',
                    dataIndex: 'UnitPrice',
                    key: 'unitPrice',
                    onHeaderCell: (columns) => {
                        const index = this.state.columns.findIndex(item => item.key === columns.key)
                        return {
                            index,
                            moveColumn: this.moveColumn,
                        }
                    },
                },
            ],
            tagList: [
                {
                    title: '商品名',
                    dataIndex: 'Name',
                    key: 'Name',
                    onHeaderCell: (columns) => {
                        const index = this.state.columns.findIndex(item => item.key === columns.key)
                        return {
                            index,
                            moveColumn: this.moveColumn,
                        }
                    },
                },
                {
                    title: '单价',
                    dataIndex: 'UnitPrice',
                    key: 'UnitPrice',
                    onHeaderCell: (columns) => {
                        const index = this.state.columns.findIndex(item => item.key === columns.key)
                        return {
                            index,
                            moveColumn: this.moveColumn,
                        }
                    },
                },
            ]
        }
    }



    components = {
        header: {
            cell: HeaderCell
        }
    }
    moveColumn = (dragIndex, hoverIndex) => {
        const { columns } = this.state;
        const dragRow = columns[dragIndex];

        this.setState(
            update(this.state, {
                columns: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    }
    handleTagChange = (tagList) => {
        const newColumns = this.state.tagList.filter(columnItem => {
            return !!tagList.find(tagItem => (tagItem === columnItem.dataIndex))
        })
        this.setState({columns: newColumns})
    }
    render() {
        const defaultValue = this.state.tagList.map(item => item.dataIndex)
        const customPanelStyle = {
            background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            border: 0,
            overflow: 'hidden',
        }
        return (
            <div>
              <Collapse bordered={false}>
                  <Panel  header="表格配置" style={customPanelStyle}>
                      <TagSelect onChange={this.handleTagChange} defaultValue={defaultValue}>
                          {
                              this.state.tagList.map(item => (
                                  <TagSelect.Option value={item.dataIndex} key={item.key}>{item.title}</TagSelect.Option>
                              ))
                          }
                      </TagSelect>
                  </Panel>
              </Collapse>
                <Table
                    bordered
                    dataSource={this.props.content}
                    columns={this.state.columns}
                    components={this.components}
                    rowKey={record => record.Key}
                />
            </div>
        )
    }
}
const Demo = DragDropContext(HTML5Backend)(GoodsTable);
export default Demo
