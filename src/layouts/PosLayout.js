import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin, Tabs } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import NoticeIcon from '../components/NoticeIcon';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import styles from './PosLayout.less';
import ChooseCalculator from '../components/Calculator/Choose/'
import SelectedGoods from '../components/List/SelectedGoods/'

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

class PosLayout extends React.PureComponent {
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
    render() {
        const { currentUser, collapsed, fetchingNotices, getRouteData, activeKey, orders } = this.props;


        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
                <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </Menu>
        );
        const noticeData = this.getNoticeData();


        const layout = (
            <Layout>
                <Sider
                    width={440}
                    className={styles.sider}
                >
                    <Header className={styles.leftHeader}
                    >
                        <div className={styles.logo}>
                            <Link to="/">
                                <h1>POS</h1>
                            </Link>
                        </div>
                    </Header>
                    <Content
                        className={styles.leftContent}
                    >
                        <SelectedGoods />
                    </Content>
                    <div
                        className={styles.calculator}
                    >
                        <ChooseCalculator />
                    </div>
                </Sider>
                <Layout
                    className={styles.rightContent}
                >
                    <Content style={{height: '100%' }}>
                        <div style={{ minHeight: 'calc(100vh - 260px)' }}>
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
                                <Redirect exact from="/pos" to="/pos/choose" />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                        <GlobalFooter
                            links={[{
                                title: 'Pro 首页',
                                href: 'http://pro.ant.design',
                                blankTarget: true,
                            }, {
                                title: 'GitHub',
                                href: 'https://github.com/ant-design/ant-design-pro',
                                blankTarget: true,
                            }, {
                                title: 'Ant Design',
                                href: 'http://ant.design',
                                blankTarget: true,
                            }]}
                            copyright={
                                <div>
                                    Copyright <Icon type="copyright" /> 2017 蚂蚁金服体验技术部出品
                                </div>
                            }
                        />
                    </Content>
                </Layout>
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
}))(PosLayout);