import React, { useState, useEffect, createContext, useContext } from 'react'
import AdminLogin from './components/admin/inc/admin-forms/admin-login'
import AdminForgotPassword from './components/admin/inc/admin-forms/admin-re-password'
import AdminRegistration from './components/admin/inc/admin-forms/admin-registration'
import Admin from './components/admin/dashboard'
import { Dashboard } from './components/admin/dashboard'
import Media from './components/admin/media'
import Pages from './components/admin/pages'
import Products from './components/admin/products'
import { Subscriber, SubscriberDashboard } from './components/admin/subscriber-dashboard.js'
import { SubscriberReport } from './components/admin/subscriber-report.js'
import { SubscriberSetting } from './components/admin/subscriber-setting.js'
import Settings from './components/admin/settings'
import { Report } from './components/admin/report.js'
import Users from './components/admin/users'
import ErrorPage from './components/error-page'
import DatabaseForm from './components/admin/inc/admin-forms/database-form'
import Index from './components/content/index'
import { Single } from './components/content/single'
import { Search } from './components/content/search'
import { Page } from './components/content/page'
import { Archive } from './components/content/archive'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export const HOMECONTEXT = createContext()

function App() {
  const [ databaseExists, setDatabaseExists ] = useState( false )
  const [ overlay, setOverlay ] = useState( false )
  const [ cartActive, setCartActive ] = useState( false )
  const [ isSubscriber, setIsSubscriber ] = useState( false )
  const [ isAdmin, setIsAdmin ] = useState( false )

  const contextObject = {
    setOverlay,
    overlay,
    cartActive,
    setCartActive,
    isSubscriber,
    setIsSubscriber,
    isAdmin,
    setIsAdmin
  }

  return (
    <HOMECONTEXT.Provider value={ contextObject }>
      <Router>
        { databaseExists && <DatabaseForm /> }
        { ! databaseExists && <AdminFormLinks /> }
      </Router>
    </HOMECONTEXT.Provider>
  );
}

const AdminFormLinks = () => {
  const [ allUsers, setAllUsers ] = useState([])
  return (
    <Routes>
      <Route exact path='/swt-user' Component={ Subscriber }>
        <Route exact path='/swt-user' Component={ SubscriberDashboard }/>
        <Route exact path='/swt-user/setting' Component={ SubscriberSetting }/>
        <Route exact path='/swt-user/report' Component={ SubscriberReport }/>
      </Route>
      <Route exact path='/swt-admin' Component={ Admin }>
        <Route exact path='/swt-admin' Component={ Dashboard }/>
        <Route exact path='/swt-admin/pages' element={ <Pages /> }/>
        <Route exact path='/swt-admin/media' Component={ Media }/>
        <Route exact path='/swt-admin/products' element={ <Products /> }/>
        <Route exact path='/swt-admin/settings' Component={ Settings }/>
        <Route exact path='/swt-admin/report' Component={ Report }/>
        <Route exact path='/swt-admin/users' element={ <Users registeredUsers={ allUsers }/> }/>
      </Route>
      <Route exact path='/swt-admin/login' Component={ AdminLogin }/>
      <Route exact path='/swt-admin/swt-forgot-password' Component={ AdminForgotPassword }/>
      <Route exact path='/swt-admin/swt-registration' Component={ AdminRegistration }/>
      <Route exact path='/' Component={ Index }/>
      <Route path='*' Component={ ErrorPage } />
      <Route path='/single' Component={ Single } />
      <Route path='/page' Component={ Page } />
      <Route path='/search' Component={ Search } />
      <Route path='/archive' Component={ Archive } />
    </Routes>
  );
}

export default App;
