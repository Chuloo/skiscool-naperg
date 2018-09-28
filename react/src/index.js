import React from 'react'
import ReactDOM from 'react-dom'
import { AUTH_TOKEN } from './constants/constants' 

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context';
import { ApolloLink, Observable, split } from "apollo-link";
//import { onError } from "apollo-link-error";
//import { ApolloClient, InMemoryCache, HttpLink, split } from 'apollo-client-preset';
import { WebSocketLink } from "apollo-link-ws";
//import { createUploadLink } from "apollo-upload-client"; 
import { getMainDefinition } from "apollo-utilities"; 
import Zepto from './components/zepto'

import 'tachyons'
import './index.css'
import App from './components/nav/layout/App'

global.Zepto = Zepto

console.log("AUTH_TOKEN",AUTH_TOKEN)
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true,
    connectionParams: () => ({
      authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
    })
  }
})
const httpLink = new HttpLink({ uri: 'http://localhost:4000' })
 
const middlewareAuthLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN)
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ``
    }
  }
})
 

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkWithAuthToken,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

// const isMobile = ()=> window.innerWidth<600 ? true : false

ReactDOM.render(
  <ApolloProvider client={client}>
    <div>
    <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'/>
    <App />
    </div>
  </ApolloProvider>,
  document.getElementById('root'),
)
