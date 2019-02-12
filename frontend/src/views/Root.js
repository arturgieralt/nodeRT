import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import Main from './Main';
import { StyledBanner } from '../components/Banner/Banner';
import { StyledBar } from '../components/Bar/Bar';
import { StyledMenuList } from '../components/Menu/MenuList';
import ArticleList from '../containers/ArticleList';
import SingleArticle from './SingleArticle';
import ArticleEditor from '../containers/ArticleEditor';
import { RegisterForm } from '../components/RegisterForm/RegisterForm';

const Root = ({ store }) => (
    <Provider store={store}>
        <StyledBar>
            <StyledMenuList />
          </StyledBar>
          <StyledBanner />
        <Switch>
            <Route exact={true} path="/" component={Main} />
            <Route exact={true} path="/articles" component={ArticleList} />
            <Route exact={true} path="/articles/add" component={ArticleEditor} />
            <Route path="/articles/:id" component={SingleArticle} />
            <Route path="/register" component={RegisterForm} />
          </Switch>
    </Provider>
);
  
Root.propTypes = {
    store: PropTypes.object.isRequired,
}

export default Root;