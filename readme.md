# vue-pass-props

[![Build Status](https://travis-ci.org/e-e-e/vue-pass-props.svg?branch=master)](https://travis-ci.org/e-e-e/vue-pass-props)

PassProps is a component that helps in passing props a parent component to any component defined as it's slot.

This is useful if you have a parent component that has some data which needs to be shared with all it's children.
For example if you are defining a menu component and want to set contextual variables for each of it's menu items, you only need to set the variable parent, and PassProps pass the props down to each menu item.

## Install

Install the package

```sh
npm install vue-pass-props
```

Register the component

```js
import Vue from 'vue';
import PassProps from 'vue-pass-props';

Vue.component('PassProps', PassProps);
```

You may now use the component in your markup

```html
<pass-props :something="varToPass"><slot/></pass-props>
```

## Attributes

The list of props available

**node**: Allows you to set the type of element that pass-props will be. Defaults to `div`.

**class**: Is not passed down to slots.

**style**: Is not passed down to slots.

**[others]**: Any other attribute set are passed to the slots as if they were defined on them explicitly. These values will override any props set on the wrapped components.

## Basic usage

Using the example above.

Here is a skeleton of a menu component using PassProps to pass a single dynamic prop and a static one down to its children via slots.

```html
<!-- Menu.vue -->
<template>
  <pass-props
    class="menu"
    node="ul"
    :context="context"
    static="something unchanging">
    <slot/>
  </pass-props>
</template>

<script>
  import PassProps from './PassProps';

  export default {
    name: 'Menu',
    components: {
      PassProps,
    },
    props: ['context'],
  };
</script>
```

Where menu item could be something like:

```html
<!-- MenuItem.vue -->
<template>
  <li :class="static">
    <a v-if="context === 'normal'" :href="link">{{$children}}</a>
    <div v-if="context !== 'normal'">
      <h2>{{$children}}<a :href="link">*</a></h2>
    </div>
  </li>
</template>

<script>;
  export default {
    name: 'MenuItem',
    props: ['context', 'static', 'link'],
  };
</script>
```

This is a silly example - but based on the context prop MenuItem will display differently.

Now in the App, rather than explicitly setting the context on each MenuItem. We can pass the context to the Menu - which will automatically pass it on to the MenuItems.

```html
  <menu context="normal">
    <menu-item link="/A">A</menu-item>
    <menu-item link="/B">B</menu-item>
    <menu-item link="/C">C</menu-item>
  </menu>
```


