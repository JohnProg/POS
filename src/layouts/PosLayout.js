import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin, Tabs, Button, Badge } from 'antd';
import ChooseList from '../routes/Pos/ChooseList'
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import groupBy from 'lodash/groupBy';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../components/NoticeIcon';
import NotFound from '../routes/Exception/404';
import styles from './PosLayout.less';
import ChooseCalculator from '../components/Calculator/Choose/'
import SelectedGoods from '../components/List/SelectedGoods/'
import { POS_TAB_TYPE } from '../constant'
import classnames from 'classnames'

let cls = classnames.bind(styles)

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
const TabPane = Tabs.TabPane;

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

class PosLayout extends PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    }
    constructor(props) {
        super(props);
    }
    getChildContext() {
        const { location, navData, getRouteData } = this.props;
        const routeData = getRouteData('PosLayout');
        return { location };
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'user/fetchCurrent',
        });
        this.innerHeight = window.innerHeight
        if (this.props.commodity.orders.length === 0) {
            this.props.dispatch({type: 'commodity/clickAddButton', payload: POS_TAB_TYPE.SALE})
        }
    }
    getPageTitle() {
        const { location, getRouteData } = this.props;
        const { pathname } = location;
        let title = 'Orssica';
        getRouteData('PosLayout').forEach((item) => {
            if (item.path === pathname) {
                title = `${item.name} - Orssica`;
            }
        });
        return title;
    }
    getNoticeData() {
        const { notices = [] } = this.props;
        if (notices.length === 0) {
            return {};
        }
        const newNotices = notices.map((notice) => {
            const newNotice = { ...notice };
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow();
            }
            // transform id to item key
            if (newNotice.id) {
                newNotice.key = newNotice.id;
            }
            if (newNotice.extra && newNotice.status) {
                const color = ({
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                })[newNotice.status];
                newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
            }
            return newNotice;
        });
        return groupBy(newNotices, 'type');
    }
    @Debounce(600)
    handleNoticeClear = (type) => {
        message.success(`清空了${type}`);
        this.props.dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    }
    handleNoticeVisibleChange = (visible) => {
        if (visible) {
            this.props.dispatch({
                type: 'global/fetchNotices',
            });
        }
    }
    onChange = (activeKey) => {
        if (activeKey === '+') {
            this.props.dispatch({type: 'commodity/clickAddButton', payload: POS_TAB_TYPE.SALE})
            return
        }
        if (activeKey === '-') {
            return
        }
        this.props.dispatch({type: 'commodity/changeActiveTabKey', payload: activeKey})
    }
    remove = (currentIndex) => {
        this.props.dispatch({type: 'commodity/clickRemoveButton', payload: currentIndex})
    }
    render() {
        console.log('this.props', this.props)
        const { currentUser, collapsed, fetchingNotices, getRouteData } = this.props;
        const { orders, activeKey } = this.props.commodity || {}
        const currentIndex = orders.findIndex(item => item.key === activeKey)
        const createTabTitle = (title, type, key, currentTime) => {
            const tabsBarContentCls = cls({
                [styles.tabsBarContent]: true,
                [styles.tabsBarContentAllocate]: type === POS_TAB_TYPE.ALLOCATEANDTRANSFER,
            })
            const activeTabKey = activeKey
            if (title === '+') {
                return (
                    <div className={styles.operationButton}>
                        <Icon type='plus'/>
                    </div>
                )
            }
            if (title === '-') {
                return (
                    <div className={styles.operationButton}>
                        <Icon type="minus" onClick={this.remove.bind(this, currentIndex)} />
                    </div>
                )
            }
            if (typeof title === 'number') {
                const tabsBarElement = (
                    <div className={tabsBarContentCls}>
                        <Badge count={title} overflowCount={1000} style={{background: '#393939'}} />
                        {
                            activeTabKey === key && <span>{currentTime}</span>
                        }
                    </div>
                )
                return tabsBarElement
            }
        }
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
                <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </Menu>
        );
        const noticeData = this.getNoticeData();
        const leftHeader = (
            <div className={styles.logo}>
                <Link to="/">
                    <h1>POS</h1>
                </Link>
            </div>
        )


        const layout = (
            <Layout>
                <Content style={{height: '100%' }}>
                    <div style={{ minHeight: 'calc(100vh - 260px)' }}>
                        <div
                            className={styles.tabsWrapper}
                        >
                            <Tabs
                                hideAdd
                                tabBarExtraContent={leftHeader}
                                onChange={this.onChange}
                                activeKey={activeKey}
                                type="card"
                            >
                                {
                                    orders.map(orderItem => (
                                        <TabPane tab={createTabTitle(orderItem.title, orderItem.type, orderItem.key, orderItem.currentTime)} key={orderItem.key}>
                                            <div className={styles.tabContent}>
                                                <Switch>
                                                    {
                                                        getRouteData('PosLayout').map(item =>
                                                            (
                                                                <Route
                                                                    exact={item.exact}
                                                                    key={item.path}
                                                                    path={item.path}
                                                                    component={item.component}
                                                                />
                                                            )
                                                        )
                                                    }
                                                    <Route component={NotFound} />
                                                </Switch>
                                            </div>
                                        </TabPane>
                                    ))
                                }
                            </Tabs>
                        </div>
                    </div>
                </Content>
            </Layout>
        );

        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames(params)}>{layout}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

export default connect(state => ({
    currentUser: state.user.currentUser,
    collapsed: state.global.collapsed,
    fetchingNotices: state.global.fetchingNotices,
    notices: state.global.notices,
    commodity: state.commodity,
}))(PosLayout);
