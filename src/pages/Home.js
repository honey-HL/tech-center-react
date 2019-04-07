import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Row, Col, Input, Tabs } from 'antd';
import '../assets/styles/Home.css';
import { http } from "../common/http.js";
import ask from '../assets/images/home/ask.png';
import search_icon from '../assets/images/home/search.png';
import Banner from '../components/banner/banner';
import CardHorizontal from '../components/card_horizontal/card_horizontal'
import Search from '../components/search/search'
import Consulting from '../components/consulting/consulting'
import loading_img from '../assets/images/loading.png';
import { ListView } from 'antd-mobile';
import axios from 'axios'



class TabsCard extends React.Component {
    constructor(props) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            pageIndex: 1,
            data: [],
            dataSource,
            isLoading: true,
            active_item: '',
            open: true,
            total: '',
            pageSize: 10,
            no_data: false,
            show_loading: false,
            hideAdd: false,
            gutter: 0,
            style_obj: {
                color:'#666'
            },
            data: [
                // {
                //     content: '721893743204732047324470324703780183iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // },
                // {
                //     content: 'iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // },
                // {
                //     content: 'iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // },
                // {
                //     content: '721893743204732047324470324703780183iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // },
                // {
                //     content: 'iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // },
                // {
                //     content: 'iPhone XS很难修？认证专家告 诉你这些小技巧',
                //     src: require('../assets/images/1.jpg'),
                //     view: 72,
                //     heart: 134
                // }
            ],
            types: [ // 0推荐 1发布时间 2热度
                {name: '推荐', active: true, id: 0},
                {name: '最新', active: false, id: 1},
                {name: '最热', active: false, id: 2}
                // {name: '专题', active: false, id: 4},
                // {name: '技巧', active: false, id: 5}
            ]
        }
    }
    changeActiveTab = (info) => {
        const items = this.state.types;
        items.forEach((item) => {
            item.active = false;
            if (info.id !== undefined) {
                if ((info.id+'') === (item.id +'')) {
                item.active = true;
                    return
            }
            } else {
                if ((info.jacId === item.jacId)) {
                    item.active = true;
                    return
                }
            }
        })
        this.setState({
            types: items,
            active_item: info
        })
        // this.searchList(info)
        // console.log(this.state.types);
    }
    getTabsNav = async () => {
        // let res = await http('/jszx/classify', {type: 1});
        // let new_types = this.state.types;
        // res.data.forEach((item) => {
        //     new_types.push({name: item.jacName, jacId: item.jacId, active: false})
        // })
        // this.setState({types: new_types})
        // this.searchList(this.state.types[0])
    }
    // searchList = async (item) => {
    //     let list = this.state.data;
    //     let params = {
    //         title: '',
    //         pageSize: this.state.pageSize,
    //         pageIndex: this.state.pageIndex,
    //         orderBy: item.id !== undefined ? item.id:'',
    //         classifyId: item.jacId !== undefined ? item.jacId: '',
    //         type: 4 // 1问问百科 2知识库 3大师分享 4首页文章
    //     }
    //     let res = await http('/jszx/search', params);
    //     console.log(res.data);
    //     let data = res.data.data;
    //     if (data.length > 0) {
    //         for (let i = 0; i < data.length;i++) {
    //             list.push(data[i])
    //         } 
    //         this.setState({
    //             data: list,  
    //             total: res.data.total
    //         })
    //     } else {
    //         this.setState({data: [], no_data: true})
    //     }
    //     this.setState({open: true})
    // }

    loadData () {
        // let response = await http('/jszx/search', params);
        axios.get('https://jszx.3ceasy.com/video/videocenter/api/search',{
          params:{
            brandId: '',
            typeId: '',
            modelId: '',
            pageIndex: this.state.pageIndex,
            pageSize: 10,
            title: ''
          }
        })
        .then((response)=>{
          let new_data = this.state.data;
          response.data.data.data.forEach(element => {
            new_data.push(element);
          });
          this.setState({ 
            total: response.data.data.total,
            isLoading: false,
            pageIndex: this.state.pageIndex + 1,
            data: new_data,
            dataSource: this.state.dataSource.cloneWithRows(new_data),
          })
          console.log(response.data.data.total);
        })
        .catch(function(err){
          console.log(err);
        });
    }
    
    onEndReached = (event) => {
        // debugger
        console.log(this.state.data.length)
        if (this.state.data.length < this.state.total) {
            // debugger
            if (this.state.data.length >= this.state.total || this.state.data.length < this.state.pageSize) {
                this.setState({isLoading: false})
            } else {
                this.setState({isLoading: true})
                this.loadData()
            }
        }
    }
    
    componentDidMount () {
        window.$mobile.navigationShow(true);
        this.getTabsNav()
        this.setState({isLoading: true})
        this.loadData()
    }
    render(){
        const row = (rowData, sectionID, rowID) => {
            return (
              <div key={rowID} style={{ padding: '0 15px' }}>
                <div
                  style={{
                    lineHeight: '50px',
                    color: '#888',
                    fontSize: 18,
                    borderBottom: '1px solid #F6F6F6',
                  }}
                >{rowData.viTitle}</div>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  {/* <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" /> */}
                  <div style={{ lineHeight: 1 }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{rowData.viTitle}</div>
                    <div><span style={{ fontSize: '30px', color: '#FF6E27' }}>35</span>¥ {rowID}</div>
                  </div>
                </div>
              </div>
            );
        };
        return(
            <div className="TabsCard">
                <div className="tab_bar">
                    <div className="tab_bar_box">
                    {
                        this.state.types.map((item, index) => {
                            return(
                                <div onClick={() => this.changeActiveTab(item)} className={`tab_item ${item.active?'active':''}`} key={index}>{item.name}</div>
                            )
                        })
                    }
                    </div>
                    <div className="tab_content">
                    {/* {
                        this.state.data.map((info, index1) => {
                            return(
                                <CardHorizontal key={index1} info={info}/>
                            )
                        })
                    } */}
                     <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        className="am-list sticky-list"
                        useBodyScroll
                        renderFooter={() => (
                        <div style={{ padding: 30, textAlign: 'center', display:'flex',justifyContent:'center'}}>
                        {
                            this.state.isLoading?<div className={`loading_img`}>
                                <img className="banner_img" src={loading_img} alt="loading" />
                            </div>:<div>无更多数据</div>
                        }
                        </div>
                        )}
                        renderRow={row}
                        pageSize={4}
                        onScroll={() => { console.log('scroll'); }}
                        scrollEventThrottle={200}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                    />
                    </div>
                    {/* <div className={`loading ${this.state.show_loading?'show_loading':'hide_loading'}`}>
                        <div className="loading_img"><img className="banner_img" src={loading_img} alt="loading" /></div>
                    </div> */}
                </div>
            </div>
        )
    }
}

class FourTypes extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            icons: [
                {
                    src: require('../assets/images/question_icon.png'),
                    title: '问问百科',
                    path: 'encyclopedia'
                },{
                    src: require('../assets/images/video_icon.png'),
                    title: '教学视频',
                    path: 'video'
                }, {
                    src: require('../assets/images/knowleage_icon.png'),
                    title: '知识库',
                    path: 'knowledge'
                },{
                    src: require('../assets/images/share_icon.png'),
                    title: '大师分享',
                    path: 'sharing'
                }
            ]
        }
    }
    componentDidMount () {}
    render () {
        return (
            <div className='four_types'>
                <div className="bar"></div>
                <div className="types_container">
                    <div className="types_row">
                        {
                            this.state.icons.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Link history={this.props.history} to={item.path} className="home-server-item link">
                                            <div className="types_items">
                                                <div className="types_img">
                                                    <img className="banner_img" src={item.src} alt="banner" />
                                                </div>
                                                <div className='types_title'>{item.title}</div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                </div>
                </div>
                <div className="bar"></div>
            </div>
        )
    }
}

class Home extends Component {
    constructor (props) {
        super(props)
        this.state = {
            availHeight: '',
            search_value: '',
            bannerArr: []
        }
    }
    getBannerList = async () => {
        let res = await http('/jszx/banner', {type: 1});
        console.log('res ', res);
        this.setState({bannerArr: res.data});
        console.log(this.state.bannrArr);
    }
    getValue (event) {
        this.setState({search_value: event.target.value});
        console.log('from home', this.state.search_value);
    }
    onScrollHandle = () => {
        console.log('出发了')
        // eslint-disable-next-line
        const scrollTop = this.scrollRef.scrollTop;
        console.log(scrollTop)
        // eslint-disable-next-line
        const clientHeight = this.scrollRef.clientHeight;
        // eslint-disable-next-line
        const scrollHeight = this.scrollRef.scrollHeight;
        // const isBottom = scrollTop + clientHeight === scrollHeight;
        if (scrollHeight-clientHeight-scrollTop <= 120) {
            // debugger
            this.refs.tabsCard.loadMore()
        }
      };
    componentDidMount () {
        this.setState({availHeight: window.screen.availHeight + 'px'})
        this.getBannerList()
    }
    render() {
        return(
            <div 
            // style={{ maxHeight: this.state.availHeight, overflowY: 'scroll' }}
            // ref={c => {this.scrollRef = c;}}
            // onScrollCapture={() => this.onScrollHandle()}
            className="Home">
                <div className="header_box">
                    <div className='title'>技术中心</div>
                    <div className="search_box" type="flex" justify="space-around" align="middle">
                        <div className="search_left" span={16}>
                            <Search history={this.props.history} back="/" pass={this.getValue.bind(this)} />
                        </div>
                        <Consulting/>
                    </div>
                </div>
                <div className="home_container">
                    <Banner data={this.state.bannerArr}/>
                    <FourTypes/>
                    <TabsCard ref="tabsCard"/>
                </div>
            </div>
        );
    }
}

export default Home;