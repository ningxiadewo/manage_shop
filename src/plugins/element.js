import Vue from "vue";
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Main,
  Aside,
  Submenu,
  menuItemGroup,
  menuItem,
  Menu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tooltip,
  Tree,
  Select,
  Option,
} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Main);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Submenu);
Vue.use(menuItemGroup);
Vue.use(menuItem);
Vue.use(Menu);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);

// 把message挂载到原型上
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
