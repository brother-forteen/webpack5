import React from 'react';

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }

    // 在组件已经被渲染到 DOM 中后运行
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render(){
        return(
            <div>
                <h1>hello world</h1>
                <h2>{this.state.date.toLocaleTimeString()}</h2>
            </div>
        )
    }
}

