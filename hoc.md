前言
React高阶组件，即 Higher-Order Component，其官方解释是：
A higher-order component is a function that takes a component and returns a new component.
一个传入一个组件，返回另一个组件的函数，其概念与高阶函数的将函数作为参数传入类似。
用代码来解释就是：
const EnhancedComponent = higherOrderComponent(WrappedComponent);复制代码
以上通过 higherOrderComponent 函数返回的 EnhancedComponent 就是一个高阶组件。所以简单来说，高阶只是一种设计模式（pattern），并非一种新的组件类型。

为何使用
关于高阶组件解决的问题可以简单概括成以下几个方面：
代码复用：这是高阶组件最基本的功能。组件是React中最小单元，两个相似度很高的组件通过将组件重复部分抽取出来，再通过高阶组件扩展，增删改props，可达到组件可复用的目的；
条件渲染：控制组件的渲染逻辑，常见case：鉴权；
生命周期捕获/劫持：借助父组件子组件生命周期规则捕获子组件的生命周期，常见case：打点。

如何使用
遵循的原则

1、不要修改原始组件

常见做法是通过修改原组件的prototype来重写其生命周期方法等（如给WrappedComponent.prototype.componentWillReceiveProps重新赋值）。请使用纯函数返回新的组件，因为一旦修改原组件，就失去了组件复用的意义。


2、props保持一致


高阶组件在为子组件添加特性的同时，要保持子组件的原有的props不受影响。传入的组件和返回的组件在props上尽量保持一致。

3、保持可组合性


4、displayName




为了方便调试，最常见的高阶组件命名方式是将子组件名字包裹起来。


5、不要在render方法内部使用高阶组件






render中的高阶组件会在每次render时重新mount，之前组件内部的state也会丢失。




使用方法对比
高阶组件使用有几种不同的方式，在介绍这几种方式之前，我们可以几个方面来分析他们之间的差异。一个React组件有以下几个重要组成部分：
props
state
ref
生命周期方法
static方法
React 元素树
补充一下：为了访问DOM elements（focus事件、动画、使用第三方dom操作库）时我们会用到ref属性。它可以声明在DOM Element和Class Component上，无法声明在Functional Components上。一开始ref声明为字符串的方式基本不推荐使用，在未来的react版本中可能不会再支持，目前官方推荐的用法是ref属性接收一个回调函数。这个函数执行的时机为：
组件被挂载后，回调函数被立即执行，回调函数的参数为该组件的具体实例。
组件被卸载或者原有的ref属性本身发生变化时，回调也会被立即执行，此时回调函数参数为null，以确保内存泄露。

所以不同方式的对比可以从以下几个方面进行（原组件即传入组件）：
原组件所在位置：如能否被包裹或包裹其他组件；
能否读取到或操作原组件的props
能否读取、操作（编辑、删除）原组件的state
能否通过ref访问到原组件中的dom元素
是否影响原组件某些生命周期等方法
是否取到原组件static方法
能否劫持原组件生命周期方法
能否渲染劫持

使用方法介绍
下面我们来介绍下高阶组件的使用方法，在介绍之前，我们假设有一个简单的组件Student，有name和age两个通过props传入后初始化的state，一个年龄输入框，一个点击后focus输入框的按钮和一个sayHello的static方法。

1
3.3 KB


class Student extends React.Component {
    static sayHello() {
        console.log('hello from Student'); // eslint-disable-line
    }
    constructor(props) {
        super(props);
        console.log('Student constructor'); // eslint-disable-line
        this.focus = this.focus.bind(this);
    }
    componentWillMount() {
        console.log('Student componentWillMount'); // eslint-disable-line
        this.setState({
            name: this.props.name,
            age: this.props.age,
        });
    }
    componentDidMount() {
        console.log('Student componentDidMount'); // eslint-disable-line
    }
    componentWillReceiveProps(nextProps) {
        console.log('Student componentWillReceiveProps'); // eslint-disable-line
        console.log(nextProps); // eslint-disable-line
    }
    focus() {
        this.inputElement.focus();
    }
    render() {
        return (<div style={outerStyle}>
            <p>姓名：{this.state.name}</p>
            <p>
                年龄:
                <input
                    style={inputStyle}
                    value={this.state.age}
                    ref={(input) => {
                        this.inputElement = input;
                    }}
                />
            </p>
            <p>
                <input
                    style={buttonStyle}
                    type="button"
                    value="focus input"
                    onClick={this.focus}
                />
            </p>
        </div>);
    }
}复制代码

总的来说，高阶组件中返回新组件的方式有以下3种：

1、直接返回一个stateless component，如：

function EnhanceWrapper(WrappedComponent) {
   const newProps = {
        source: 'app',
    };
    return props => <WrappedComponent {...props} {...newProps} />;
}复制代码
stateless component没有自己的内部state及生命周期，所以这种方式常用于对组件的props进行简单统一的逻辑处理。
√ 原组件所在位置（能否被包裹或包裹其他组件）
√ 能否取到或操作原组件的props
乄 能否取到或操作state
乄 能否通过ref访问到原组件中的dom元素
X  是否影响原组件生命周期等方法
√ 是否取到原组件static方法
X  能否劫持原组件生命周期
乄 能否渲染劫持
一些说明：
3：可以通过props 和回调函数对state进行操作。
4：因为 stateless component 并无实例，所以不要说 ref ，this都无法访问。但是可以通过子组件的ref回调函数来访问子组件的ref。

8：可以通过props来控制是否渲染及传入数据，但对 WrappedComponent 内部render的控制并不是很强。
关于ref的访问，以上面的子组件Student为例，父组件：

import Student from '../components/common/Student';

function EnhanceWrapper(WrappedComponent) {
    let inputElement = null;
    function handleClick() {
        inputElement.focus();
    }
    function wrappedComponentStaic() {
        WrappedComponent.sayHello();
    }
    return props => (<div>
        <WrappedComponent
            inputRef={(el) => { inputElement = el; }}
            {...props}
        />
        <input
            type="button"
            value="focus子组件input"
            onClick={handleClick}
        />
        <input
            type="button"
            value="调用子组件static"
            onClick={wrappedComponentStaic}
        />
    </div>);
}

const WrapperComponent = EnhanceWrapper(ShopList);复制代码

子组件中需要调用父组件传入的ref回调函数：
<input 
   ref={(input) => { 
       this.inputElement = input; 
    }}
/>复制代码
改为：
<input 
    ref={(input) => { 
        this.inputElement = input; 
        this.props.inputRef(input); 
    }}
/>复制代码
这样父组件可以访问到子组件中的input元素。
以下是ref调用和static方法调用的示例。



2、在新组件的render函数中返回一个新的class component，如：
function EnhanceWrapper(WrappedComponent) {
    return class WrappedComponent extends React.Component {
        render() {
           return <WrappedComponent {...this.props} />;
        }
    }
}复制代码
√ 原组件所在位置（能否被包裹或包裹其他组件）
√ 能否取到或操作原组件的props
乄 能否取到或操作state
乄 能否通过ref访问到原组件中的dom元素
√ 是否影响原组件生命周期等方法
√ 是否取到原组件static方法
X  能否劫持原组件生命周期
乄 能否渲染劫持

一些说明：
3：可以通过props 和回调函数对state进行操作。
4：ref虽然无法直接通过this来直接访问，但依旧可以利用上面所用的回调函数方式访问。
7：高阶组件和原组件的生命周期完全是React父子组件的生命周期关系。
8：和第一种类似，可以通过props来控制是否渲染及传入数据，但对WrappedComponent内部render的控制并不是很强。
function EnhanceWrapper(WrappedComponent) {
    return class WrapperComponent extends React.Component {
        static wrappedComponentStaic() {
            WrappedComponent.sayHello();
        }
        constructor(props) {
            super(props);
            console.log('WrapperComponent constructor'); // eslint-disable-line
            this.handleClick = this.handleClick.bind(this);
        }
        componentWillMount() {
            console.log('WrapperComponent componentWillMount'); // eslint-disable-line
        }
        componentDidMount() {
            console.log('WrapperComponent componentDidMount'); // eslint-disable-line
        }
        handleClick() {
            this.inputElement.focus();
        }
        render() {
            return (<div>
                <WrappedComponent
                    inputRef={(el) => { this.inputElement = el; }}
                    {...this.props}
                />
                <input
                    type="button"
                    value="focus子组件input"
                    onClick={this.handleClick}
                />
                <input
                    type="button"
                    value="调用子组件static"
                    onClick={this.constructor.wrappedComponentStaic}
                />
            </div>);
        }
    };
}复制代码




3、继承（extends）原组件后返回一个新的class component，如：

function EnhanceWrapper(WrappedComponent) {
    return class WrappedComponent extends WrappedComponent {
        render() {
            return super.render();
        }
    }
}复制代码
此种方式最大特点是下允许 HOC 通过 this 访问到 WrappedComponent，所以可以读取和操作state/ref/生命周期方法。
√ 原组件所在位置（能否被包裹或包裹其他组件）
√ 能否取到或操作原组件的props
√ 能否取到或操作state
√ 能否通过ref访问到原组件中的dom元素
√ 是否影响原组件生命周期等方法
√ 是否取到原组件static方法
√ 能否劫持原组件生命周期
√ 能否渲染劫持
function EnhanceWrapper(WrappedComponent) {
    return class WrapperComponent extends WrappedComponent {
        constructor(props) {
            super(props);
            console.log('WrapperComponent constructor'); // eslint-disable-line
            this.handleClick = this.handleClick.bind(this);
        }
        componentDidMount(...argus) {
            console.log('WrapperComponent componentDidMount'); // eslint-disable-line
            if (didMount) {
                didMount.apply(this, argus);
            }
        }
        handleClick() {
            this.inputElement.focus();
        }
        render() {
            return (<div>
                {super.render()}
                <p>姓名：{this.state.name}</p>
                <input
                    type="button"
                    value="focus子组件input"
                    onClick={this.handleClick}
                />
                <input
                    type="button"
                    value="调用子组件static"
                    onClick={WrapperComponent.sayHello}
                />
            </div>);
        }
    };
}复制代码


一些说明：

5：由于class继承时会先生成父类的示例，所以 Student 的 constructor 会先于WrapperComponent 执行。其次，继承会覆盖父类的实例方法，所以在 WrapperComponent定义 componentDidMount 后Student的 componentDidMount 会被覆盖不会执行。没有被覆盖的componentWillMount会被执行。


1
11.3 KB


7：虽然生命周期重写会被覆盖，但可以通过其他方式来劫持生命周期。
function EnhanceWrapper(WrappedComponent) {
    const willMount = WrappedComponent.prototype.componentWillMount;
    const didMount = WrappedComponent.prototype.componentDidMount;
    return class WrapperComponent extends WrappedComponent {
        constructor(props) {
            super(props);
            console.log('WrapperComponent constructor'); // eslint-disable-line
            this.handleClick = this.handleClick.bind(this);
        }
        componentWillMount(...argus) {
            console.log('WrapperComponent componentWillMount'); // eslint-disable-line
            if (willMount) {
                willMount.apply(this, argus);
            }
        }
        componentDidMount(...argus) {
            console.log('WrapperComponent componentDidMount'); // eslint-disable-line
            if (didMount) {
                didMount.apply(this, argus);
            }
        }
        handleClick() {
            this.inputElement.focus();
        }
        render() {
            return (<div>
                {super.render()}
                <p>姓名：{this.state.name}</p>
                <input
                    type="button"
                    value="focus子组件input"
                    onClick={this.handleClick}
                />
                <input
                    type="button"
                    value="调用子组件static"
                    onClick={WrapperComponent.sayHello}
                />
            </div>);
        }
    };
}复制代码

1
14.4 KB


8：此种方法因为可以取到 WrappedComponent 实例的render结果，所以还可以通过React.cloneElement等方法修改由 render 方法输出的 React 组件树。

场景举例
场景1：页面复用
描述：项目中有两个UI交互完全相同的页面，如下图。但由于服务于不同的业务，数据来源及部分文案有所不同。目前数据获取统一在lib/utils中进行封装，如 utils.getShopListA 和 utils.getShopListB。

1
24.4 KB

思路：将获取数据的函数作为参数传入，返回高阶组件。

components/ShopList.jsx
import React from 'react';

class ShopList extends React.Component {
    componentWillMount() {
    }

    render() {
        // 使用this.props.data渲染
    }
}

export default ShopList;复制代码

common/shopListWithFetching.jsx
import ShopList from '../components/ShopList.jsx';

function shopListWithFetching(fetchData, defaultProps) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                data: [],
            };
        }
        componentWillMount() {
            fetchData().then((list) => {
                this.setState({
                    data: list,
                });
            }, (error) => {
                console.log(error); // eslint-disable-line
            });
        }
        render() {
            return <ShopList data={this.state.data} {...defaultProps} {...this.props} />;
        }
    };
}
export default shopListWithFetching;复制代码

page/SholistA.jsx
import React from 'react';
import ReactDOM from 'react-dom';

import getShopListA from '../lib/utils';
import shopListWithFetching from '../common/shopListWithFetching.jsx';

const defaultProps = {
    emptyMsg: '暂无门店数据',
};
const SholistA = shopListWithFetching(getShopListA, defaultProps);
ReactDOM.render(<SholistA />, document.getElementById('app'));复制代码

page/SholistB.jsx
import React from 'react';
import ReactDOM from 'react-dom';

import getShopListB from '../lib/utils';
import shopListWithFetching from '../components/ShopList.jsx';

const defaultProps = {
   emptyMsg: '暂无合作的门店',
};
const SholistB = shopListWithFetching(getShopListB, defaultProps);
ReactDOM.render(<SholistB />, document.getElementById('app'));复制代码

场景2：页面鉴权
描述：最近有一个新业务要上线，包含有一系列相关页面。现在需要对其中几个页面增加白名单功能，如果不在白名单中的用户访问这些页面只进行文案提示，不展示业务数据。一周后去掉白名单，对全部用户开放。
以上场景中有几个条件：
几个页面：鉴权代码不能重复写在页面组件中；
只进行文案提示：鉴权过程在页面部分生命周期（业务数据请求）之前；
一周后去掉白名单：鉴权应该完全与业务解耦，增加或去除鉴权应该最小化影响原有逻辑。
思路：将鉴权流程封装，通过高阶组件像一件衣服穿在在业务组件外面。

假设原有页面（以page1和page2为例）代码如下：
pages/Page1.jsx
import React from 'react';

class Page1 extends React.Component {
   componentWillMount() {
       // 获取业务数据
   }
   render() {
       // 页面渲染
   }
}
export default Page1复制代码
pages/Page2.jsx
import React from 'react';

class Page2 extends React.Component {
  componentWillMount() {
      // 获取业务数据
  }
  render() {
      // 页面渲染
  }
}
export default Page2

复制代码
思路：通过高阶组件将页面顶层组件封装，页面加载时请求后端鉴权接口，在render方法中增加渲染逻辑，鉴权失败展示文案，成功渲染原页面组件，请求业务数据。
高阶组件（components/AuthWrapper.jsx），鉴权方法名为whiteListAuth（lib/utils.js）。
import React from 'react';
import { whiteListAuth } from '../lib/utils';

/**
 * 白名单权限校验
 * @param WrappedComponent
 * @returns {AuthWrappedComponent}
 * @constructor
 */
function AuthWrapper(WrappedComponent) {
    class AuthWrappedComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                permissionDenied: -1,
            };
        }
        componentWillMount() {
            whiteListAuth().then(() => {
                // success
                this.setState({
                    permissionDenied: 0,
                });
            }, (error) => {
                this.setState({
                    permissionDenied: 1,
                });
                console.log(error);
            });
        }
        render() {
            if (this.state.permissionDenied === -1) {
                return null;
            }
            if (this.state.permissionDenied) {
                return <div>功能即将上线，敬请期待~</div>;
            }
            return <WrappedComponent {...this.props} />;
        }
    }

    return AuthWrappedComponent;
}

export default AuthWrapper;复制代码

增加鉴权后的页面
pages/Page1.jsx
import React from 'react';
import AuthWrapper from '../components/AuthWrapper';

class Page1 extends React.Component {
  componentWillMount() {
      // 获取业务数据
  }
  render() {
      // 页面渲染
  }
}
// export default Page1
export default AuthWrapper(Page1);复制代码
pages/Page2.jsx
import React from 'react';
import AuthWrapper from '../components/AuthWrapper';

class Page2 extends React.Component {
 componentWillMount() {
     // 获取业务数据
 }
 render() {
     // 页面渲染
 }
}
// export default Page2
export default AuthWrapper(Page2);

复制代码
这样鉴权与业务完全解耦，也避免鉴权失败情况下多余的数据请求，只需要增加/删除一行代码，改动一行代码，即可增加/去除白名单的控制。

场景3：日志及性能打点
描述：所有使用React的前端项目页面需要增加PV，UV，性能打点。每个项目的不同页面顶层组件生命周期中分别增加打点代码无疑会产生大量重复代码。

思路：通过extends方法返回高阶组件，劫持原页面组件的生命周期。具体可期待其他小伙伴后续的文章。


高阶组件常见问题
Ref
如上面的第一、二种高阶组件方法中所示，常规的通过this是无法获取你想要的ref，但可以通过ref的回调函数获取。

Static方法丢失
如上面的第一、二种高阶组件方法中所示，高阶组件对子组件包装之后会返回一个容器组件，这意味着新组件不包含任何子组件中包含的静态方法。为了解决这个问题，应该将静态方法拷贝到容器组件之后，再将其返回。可以使用 hoist-non-react-statics 来自动的拷贝所有非React的静态方法。当然另一个解决方案是将组件自身和静态方法分别导出。

componentWillReceiveProps
如上面的第一、二种高阶组件方法中所示，props层层传递，值变化时必然会引起一些维护上的困难。

常用高阶组件库
React-Redux - connect
使用过React-Redux的同学都知道，组件中访问全局state数据，我们需要调用connect函数，如官方示例中：
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)复制代码
其中 TodoList 是一个React组件。以下是connect函数源代码：
return function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    pure = true,
    areStatesEqual = strictEqual,
    areOwnPropsEqual = shallowEqual,
    areStatePropsEqual = shallowEqual,
    areMergedPropsEqual = shallowEqual,
    ...extraOptions
  } = {}
) {
    return connectHOC(selectorFactory, {...})
}复制代码
上面的connectHOC的默认值就是下面的 connectAdvanced
export default function connectAdvanced() {
    return function wrapWithConnect(WrappedComponent) {
        class Connect extends Component {
            render() {
                // 返回           
                return createElement(WrappedComponent, this.addExtraProps(selector.props))
            }
        }
    }
    // Similar to Object.assign
    return hoistStatics(Connect, WrappedComponent)
}复制代码
可以看出，connect函数传入mapStateToProps等参数，执行结果是返回另一个函数。给这个函数传入原始组件（WrappedComponent），会返回另一个新的组件（Connect），props也传入了这个组件。

recompose
Recompose is a React utility belt for function components and higher-order components.
以 withHandlers 为例：
/* eslint-disable no-console */
import { Component } from 'react'
import createEagerFactory from './createEagerFactory'
import setDisplayName from './setDisplayName'
import wrapDisplayName from './wrapDisplayName'
import mapValues from './utils/mapValues'

const withHandlers = handlers => BaseComponent => {
  const factory = createEagerFactory(BaseComponent)
  class WithHandlers extends Component {
    cachedHandlers = {}

    handlers = mapValues(
      typeof handlers === 'function' ? handlers(this.props) : handlers,
      (createHandler, handlerName) => (...args) => {
        const cachedHandler = this.cachedHandlers[handlerName]
        if (cachedHandler) {
          return cachedHandler(...args)
        }

        const handler = createHandler(this.props)
        this.cachedHandlers[handlerName] = handler

        if (
          process.env.NODE_ENV !== 'production' &&
          typeof handler !== 'function'
        ) {
          console.error(
            // eslint-disable-line no-console
            'withHandlers(): Expected a map of higher-order functions. ' +
              'Refer to the docs for more info.'
          )
        }

        return handler(...args)
      }
    )

    componentWillReceiveProps() {
      this.cachedHandlers = {}
    }

    render() {
      return factory({
        ...this.props,
        ...this.handlers,
      })
    }
  }
  return WithHandlers
}

export default withHandlers复制代码

Relay - RelayContainer
function createContainerComponent(
  Component: React.ComponentType<any>,
  spec: RelayContainerSpec,
): RelayContainerClass {
    const ComponentClass = getReactComponent(Component);
    class RelayContainer extends React.Component<$FlowFixMeProps,
    {
      queryData: {[propName: string]: mixed},
      rawVariables: Variables,
      relayProp: RelayProp,
      },
    > {
        render(): React.Node {
            if (ComponentClass) {
                return (
                  <ComponentClass
                  {...this.props}
                  {...this.state.queryData}
                  ref={'component'} // eslint-disable-line react/no-string-refs
                  relay={this.state.relayProp}
                 />
               );
            } else {
                // Stateless functional.
                const Fn = (Component: any);
                return React.createElement(Fn, {
                  ...this.props,
                  ...this.state.queryData,
                  relay: this.state.relayProp,
                });
            }
        }
    }
    return RelayContainer;
}复制代码

Function as Child Components
在React社区中，还有另一种类似高阶组件的方式叫做 Function as Child Components。它的思路是将函数（执行结果是返回新的组件）作为子组件传入，在父组件的render方法中执行此函数，可以传入特定的参数作为子组件的props。
以上面的Student组件为例：
class StudentWithAge extends React.Component {
    componentWillMount() {
        this.setState({
            name: '小红',
            age: 25,
        });
    }
    render() {
        return (
            <div>
                {this.props.children(this.state.name, this.state.age)}
            </div>
        );
    }
}复制代码

使用的时候可以这样：
<StudentWithAge>
    {
        (name, age) => {
            let studentName = name;
            if (age > 22) {
                studentName = `大学毕业的${studentName}`;
            }
            return <Student name={studentName} />;
        }
    }
</StudentWithAge>复制代码

比起高阶组件，这种方式有一些优势：

1、代码结构上少掉了一层（返回高阶组件的）函数封装。

2、调试时组件结构更加清晰；

3、从组件复用角度来看，父组件和子组件之间通过children连接，两个组件其实又完全可以单独使用，内部耦合较小。当然单独使用意义并不大，而且高阶组件也可以通过组合两个组件来做到。


同时也有一些劣势：
1、（返回子组件）函数占用了父组件原本的props.children；
2、（返回子组件）函数只能进行调用，无法劫持劫持原组件生命周期方法或取到static方法；

3、（返回子组件）函数作为子组件包裹在父组件中的方式看起来虽灵活但不够优雅；
4、由于子组件的渲染控制完全通过在父组件render方法中调用（返回子组件）函数，无法通过shouldComponentUpdate来做性能优化。


所以这两种方式各有优劣，可根据具体场景选择。

关于Mixins
在使用ES6语法写组件之前，组件复用我们通常使用mixin方式，而使用ES6语法之后mixin不再支持，所以现在组内的项目中也不再使用。而mixin作为一种抽象和共用代码的方案，许多库（比如react-router）都依赖这一功能。
90% of the time you don't need mixins, in general prefer composition via high order components. For the 10% of the cases where mixins are best (e.g. PureRenderMixin and react-router's Lifecycle mixin), this library can be very useful.
在React官方文章 Mixins Considered Harmful 中阐述了一些Mixins存在的问题：
Mixins introduce implicit dependencies
Mixins cause name clashes
Mixins cause snowballing complexity

两者生命周期上的差异
HOC的生命周期依赖于其实现，而mixin中除了render之外其他的生命周期方法都可以重复且会调用，但不可以设置相同的属性或者包含相同名称的普通方法。重复的生命周期调用方法的顺序是：mixin方法首先会被调用（根据mixins中的顺序从左到右的进行调用），然后再是组件的中方法被调用。
