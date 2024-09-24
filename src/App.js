import React, { useState, useEffect } from 'react'
import AdminLogin from './components/admin/inc/admin-forms/admin-login'
import AdminForgotPassword from './components/admin/inc/admin-forms/admin-re-password'
import AdminRegistration from './components/admin/inc/admin-forms/admin-registration'
import Admin from './components/admin/dashboard'
import { Dashboard } from './components/admin/dashboard'
import Media from './components/admin/media'
import Pages from './components/admin/pages'
import Products from './components/admin/products'
import Settings from './components/admin/settings'
import Users from './components/admin/users'
import ErrorPage from './components/error-page'
import DatabaseForm from './components/admin/inc/admin-forms/database-form'
import Index from './components/content/index'
import { Single } from './components/content/single'
import { Archive } from './components/content/archive'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [ databaseExists, setDatabaseExists ] = useState( false )

  return (
    <Router>
      { databaseExists && <DatabaseForm /> }
      { ! databaseExists && <AdminFormLinks /> }
    </Router>
  );
}

const AdminFormLinks = () => {
  const [ allUsers, setAllUsers ] = useState([])
  return (
    <Routes>
      <Route exact path='/swt-admin' Component={ Admin }>
        <Route exact path='/swt-admin' Component={ Dashboard }/>
        <Route exact path='/swt-admin/pages' element={ <Pages /> }/>
        <Route exact path='/swt-admin/media' Component={ Media }/>
        <Route exact path='/swt-admin/products' element={ <Products /> }/>
        <Route exact path='/swt-admin/settings' Component={ Settings }/>
        <Route exact path='/swt-admin/users' element={ <Users registeredUsers={ allUsers }/> }/>
      </Route>
      <Route exact path='/swt-admin/login' Component={ AdminLogin }/>
      <Route exact path='/swt-admin/swt-forgot-password' Component={ AdminForgotPassword }/>
      <Route exact path='/swt-admin/swt-registration' Component={ AdminRegistration }/>
      <Route exact path='/' Component={ Index }/>
      <Route path='*' Component={ ErrorPage } />
      <Route path='/single' Component={ Single } />
      <Route path='/archive' Component={ Archive } />
    </Routes>
  );
}

export default App;
