### Common BC's

1. Components can not have props and methods (API methods, getters etc.) with the same name.

   Now `Diagram` widget has both `export` option and `export` API method.

   WA - rename either method or option.

1. There is no default value for templates

   Template options now don't have default value. All default templates are implemented in view functions, not as templates.

   WA - we don't need one

1. Private method `setAria` is no longer supported.

   WA - To set `aria` attributes use `aria` prop.

### jQuery widgets

1. Both the component's root element and jQuery widget's container element should be of the same type.

   That means that you should always use `div` as root element and users have to use `div` for jQuery widget container. Using different element types leads to wrong HTML-tree.

   This rule applies to components that register jQuery widget.

   WA - User projects need to be changed to use `div` s jQuery widget container.

1. Custom CSS classes on widget's component.

   Users can have custom CSS classes on widget's container, change them between renderings and so on.

   The only exception is classes starting with `dx-` prefix. These classes should be set before widget initialization and can not be changed later, widget will always set them on every rendering.

   WA - If someone used classes with `dx-` prefix and changed them at runtime they should be changed to not have that prefix.

1. Asynchronous rendering

   jQuery widget renders Preact component. So, we get async rendering, effects execution etc.

   WA - Perform any actions on `ready` events.

1. CheckBox.value now accepts `null` value as special value.

   See BC for native components. jQuery widgets continue to accept `undefined` but pass it as `null` to underlying Preact component.

   WA - Not needed, but `undefined` value might be deprecated and users have to change projects to use `null`.

1. Assigning `undefined` to option resets it to default value (or `null`)

   To overcome Preact limitaion on setting `undefined` to TwoWay props, we changed the way jQuery widget process `undefined` option value.

   When user sets `undefined` to some option, jQuery widget pass option's default value or `null` if it is allowed by declaration.

   This does not affect option reading.

   ```ts
   $(selector).dxWidget("option", "someOption", undefined); // sets default value to someOption, e.g. 15

   $(selector).dxWidget("option", "someOption") === undefined; // true, jQuery widget stores user's values
   ```

   Current widgets implementation behaves pretty similar, so this change should be unnoticeable for users.

### Wrappers

1. Component's instance is now jQuery wrapper that only contains its own members and declared API (`@Method` decorator)

   This affects customers who used private API

   WA - no WA

### Native compared to old wrappers

1. `undefined` can not be used as special value for `TwoWay` props.

   `null` value should be used instead.

1. Component's refs now contain component or object with API methods (for React). Compare with old wrappers:

   Wrapper

   ```typescript
   <Button ref={this.buttonRef} {...props} />;
   this.buttonRef.instance.focus();
   ```

   New native component

   ```typescript
   <Button ref={this.buttonRef} {...props} />;
   this.buttonRef.focus();
   ```

1. Many API methods are removed.

   Almost all common methods are considered redundant for native components - `begin/endUpdate`, `dispose`, `element`, `getInstance`, `instance`, `on/off`, `option`, `registerKeyHandler`, `repaint`, `reset`, `resetOption` etc.

   Only component specific API methods (e.g. `focus`) are/should be implemented in declarative component. Also `defaultOptions` static method is implemented.

1. Some common events are removed.

   Common events are also considered redundant. These include `onDisposing`, `onInitialized`, `onOptionChanged`.

   `onContentReady` event is implemented but we are going to move it to jQuery wrapper

   Component specific events (e.g. `onClick`) are implemented.

1. Event argument only contains event specific data.

   That means that `component` and `element` properties are removed from event argument.

   With removed API methods this may lead to the following cases:

   Old approach

   ```typescript
   onClick(e) {
     const buttonText = e.component.option('text');
     notify(`The ${this.capitalize(buttonText)} button was clicked`);
   }
   ```

   New approach

   ```typescript
   onClick(e) {
     const buttonText = e.event.target.textContent;
     notify(`The ${this.capitalize(buttonText)} button was clicked`);
   }
   ```

1. Nested components of nested components includes parent name (React and Vue).

   According to the docs, if we use few levels of nested components, and some nested properties have equal names on different levels - components should have different names.

   For example, in the Grid we have the `headerFilter` nested property and the `headerFilter` property for nested `columns` property. These options have equal name but different components:

   ```jsx
   <Grid>
     <HeaderFilter />
     <Column>
       <ColumnHeaderFilter />
     </Column>
     <Column>
       <ColumnHeaderFilter />
     </Column>
   </Grid>
   ```

   (https://js.devexpress.com/Documentation/Guide/Widgets/DataGrid/Filtering_and_Searching/)

   But now, in the wrappers we collect all possible options from all nested properties with the same name. So, in demo we can see the next code (and it works):

   ```jsx
   <Grid>
     <HeaderFilter />
     <Column>
       <HeaderFilter />
     </Column>
     <Column>
       <HeaderFilter />
     </Column>
   </Grid>
   ```

   (https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/Filtering/React/Light/)

   In new components we support only first example.

1. Angular templates API is changed

   New Angular components use native template syntax with ng-template directive

   old syntax

   ```html
   <dx-button *ngFor="let item of items" text="Click Me!" template="template1">
     <div *dxTemplate="let data of 'template1'">
       <div style="border: 1px solid blue;">
         {{ data.text + "!" }}
       </div>
     </div>
   </dx-button>
   -->
   ```

   new syntax

   ```html
   <dx-button
     *ngFor="let item of items"
     text="Click Me!"
     [template]="template1"
   >
     <ng-template #template1 let-data="data">
       <div style="border: 1px solid blue;">
         {{ data.text + "!" }}
       </div>
     </ng-template>
   </dx-button>
   -->
   ```

### Other notes

#### Button Breaking Changes

1. Ink ripple markup is added to the tree on rendering, not on user action.

#### Grid pager Breaking WA

1. Use 'all' value for allowedPageSizes to add 'All' item into page size section of pager. We add default localization for it (dxPager-pageSizesAllText). (T725186, T535399)
2. For controll of pager UI apperance use displayMode option in pager section. It can take on the following values: 'adaptive', 'compact' or 'full'. (T672366, T709640, T745052)
