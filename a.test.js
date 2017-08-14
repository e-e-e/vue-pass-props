const tape = require('tape')
const Vue = require('vue/dist/vue.common.js')
const PassProps = require('./index.common.js')

function TestComponentWithSingleChild () {
  const TestWrapper = {
    template: '<pass-props :something="something" other="this too."><slot/></pass-props>',
    components: {
      PassProps
    },
    props: ['something']
  }
  const WrappedComponent = {
    template: '<div>{{something}}, {{other}}</div>',
    props: ['something', 'other']
  }
  const Parent = {
    template: '<test-wrapper :something="someData"><wrapped-component/></test-wrapper>',
    components: {
      WrappedComponent,
      TestWrapper
    },
    props: ['someData']
  }
  return Vue.extend(Parent)
}

function TestComponentWithMultipleChildren () {
  const TestWrapper = {
    template: '<pass-props node="ul" :commonProp="commonProp"><slot/></pass-props>',
    components: {
      PassProps
    },
    props: ['commonProp']
  }
  const WrappedListComponent = {
    template: '<li>{{commonProp}}, {{unique}}</li>',
    props: ['commonProp', 'unique']
  }
  const Parent = {
    template: `<test-wrapper commonProp="shared">
                <wrapped-list-component unique="1"/>
                <wrapped-list-component unique="2"/>
                <wrapped-list-component unique="3"/>
              </test-wrapper>`,
    components: {
      WrappedListComponent,
      TestWrapper
    }
  }
  return Vue.extend(Parent)
}

function TestComponentWithOveride () {
  const TestWrapper = {
    template: '<pass-props node="ul" :commonProp="commonProp"><slot/></pass-props>',
    components: {
      PassProps
    },
    props: ['commonProp']
  }
  const WrappedComponent = {
    template: '<p>{{commonProp}}</p>',
    props: ['commonProp']
  }
  const Parent = {
    template: `<test-wrapper commonProp="shared">
                <wrapped-component commonProp="overide"/>
              </test-wrapper>`,
    components: {
      WrappedComponent,
      TestWrapper
    }
  }
  return Vue.extend(Parent)
}

tape('props passed to wrapper component are directly passed onto wrapped component', (t) => {
  const Ctor = TestComponentWithSingleChild()
  const vm = new Ctor({ propsData: {someData: 'ok'} }).$mount()
  t.same(vm.$el.textContent, 'ok, this too.')
  t.same(vm.$el.nodeName.toLowerCase(), 'div')
  t.end()
})

tape('props passed are also reactive', (t) => {
  const Ctor = TestComponentWithSingleChild()
  const vm = new Ctor({ propsData: {someData: 'ok'} }).$mount()
  t.same(vm.$el.textContent, 'ok, this too.')
  vm.$props.someData = 'wow'
  Vue.nextTick(() => {
    t.same(vm.$el.textContent, 'wow, this too.')
    t.end()
  })
})

tape('Tag type of PassProps can be set via node prop', (t) => {
  const Ctor = TestComponentWithMultipleChildren()
  const vm = new Ctor().$mount()
  t.same(vm.$el.textContent, 'shared, 1 shared, 2 shared, 3')
  t.same(vm.$el.nodeName.toLowerCase(), 'ul')
  t.end()
})

tape('Props passed to multiple children are shared by all', (t) => {
  const Ctor = TestComponentWithMultipleChildren()
  const vm = new Ctor().$mount()
  t.same(vm.$el.textContent, 'shared, 1 shared, 2 shared, 3')
  t.end()
})

tape('Props passed override props explicitly declared on the child component', (t) => {
  const Ctor = TestComponentWithOveride()
  const vm = new Ctor().$mount()
  t.same(vm.$el.textContent, 'shared')
  t.end()
})
